'use server';
import { ai } from '@/server/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const OrderConfirmationItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const OrderConfirmationInputSchema = z.object({
  orderId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  cartItems: z.array(OrderConfirmationItemSchema),
  subTotal: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
});
export type OrderConfirmationInput = z.infer<typeof OrderConfirmationInputSchema>;

const GreetingOutputSchema = z.object({
  greeting: z.string().describe('A short, warm 1-2 sentence thank-you note for the customer, no order details or numbers.'),
});

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function buildOrderItemsHtml(items: z.infer<typeof OrderConfirmationItemSchema>[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name} × ${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatNaira(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');
}

function buildEmailHtml(input: OrderConfirmationInput, greeting: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#2b1b12;">
      <h2 style="color:#e56b3f;">Order Confirmed 🎉</h2>
      <p>${greeting}</p>
      <p style="color:#666;">Order ID: <strong>${input.orderId}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${buildOrderItemsHtml(input.cartItems)}
        <tr>
          <td style="padding:8px 0;">Subtotal</td>
          <td style="padding:8px 0;text-align:right;">${formatNaira(input.subTotal)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;">Delivery fee</td>
          <td style="padding:8px 0;text-align:right;">${formatNaira(input.deliveryFee)}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-weight:bold;border-top:2px solid #e56b3f;">Total</td>
          <td style="padding:12px 0;font-weight:bold;text-align:right;border-top:2px solid #e56b3f;">${formatNaira(input.total)}</td>
        </tr>
      </table>
      <p style="color:#666;font-size:14px;">We'll let you know as soon as your order is on its way.</p>
    </div>
  `;
}

export async function sendOrderConfirmation(input: OrderConfirmationInput): Promise<{ sent: boolean }> {
  let greeting = `Thanks for your order, ${input.customerName}!`;

  try {
    const greetingPrompt = ai.definePrompt({
      name: 'orderConfirmationGreetingPrompt',
      input: { schema: z.object({ customerName: z.string() }) },
      output: { schema: GreetingOutputSchema },
      prompt: `Write a short, warm 1-2 sentence thank-you greeting for {{customerName}}, who just placed an order on Shoppa, a student food delivery service in Nigeria. Do not mention specific items, prices, or totals.`,
    });
    const { output } = await greetingPrompt({ customerName: input.customerName });
    if (output?.greeting) {
      greeting = output.greeting;
    }
  } catch (err) {
    console.error('Order confirmation greeting generation failed, using fallback:', err);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping order confirmation email send.');
    return { sent: false };
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL || 'Shoppa <onboarding@resend.dev>';
    await resend.emails.send({
      from,
      to: input.customerEmail,
      subject: `Your Shoppa order ${input.orderId} is confirmed`,
      html: buildEmailHtml(input, greeting),
    });
    return { sent: true };
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
    return { sent: false };
  }
}
