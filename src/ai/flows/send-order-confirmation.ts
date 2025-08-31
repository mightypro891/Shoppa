
'use server';
/**
 * @fileOverview A flow to handle sending order confirmation emails.
 *
 * - sendOrderConfirmation - A function that handles sending emails to customer and admin.
 * - OrderConfirmationInput - The input type for the sendOrderConfirmation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { CartItem } from '@/lib/types';
import { getAdminUserByUid } from '@/lib/data';

const OrderConfirmationInputSchema = z.object({
    orderId: z.string().describe('The unique identifier for the order.'),
    customer: z.object({
        name: z.string().describe('The name of the customer.'),
        email: z.string().email().describe('The email address of the customer.'),
    }),
    cartItems: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        image: z.string(),
        description: z.string(),
        aiHint: z.string(),
        tags: z.array(z.string()).optional(),
        vendorId: z.string().optional(),
    })).describe('The items in the order.'),
    cartTotal: z.number().describe('The total price of the order.'),
});

export type OrderConfirmationInput = z.infer<typeof OrderConfirmationInputSchema>;

export async function sendOrderConfirmation(input: OrderConfirmationInput): Promise<void> {
  await sendOrderConfirmationFlow(input);
}


const sendOrderConfirmationFlow = ai.defineFlow(
  {
    name: 'sendOrderConfirmationFlow',
    inputSchema: OrderConfirmationInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    // In a real application, you would integrate with an email sending service like SendGrid, Resend, or Nodemailer.
    // For this prototype, we will just log the email content to the console.

    const { orderId, customer, cartItems, cartTotal } = input;
    const superAdminEmail = "admin@lautechshoppa.com"; // Super admin gets all notifications

    // 1. Generate and "send" customer email
    const customerEmailSubject = `Order Confirmed - Your Lautech Shoppa Order #${orderId}`;
    const customerEmailBody = `
        Hi ${customer.name},

        Thank you for your order! We've received it and are getting it ready for you.

        Order ID: ${orderId}
        Total: ₦${cartTotal.toFixed(2)}

        Items:
        ${cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}

        We'll notify you again once your order is out for delivery.

        Thanks,
        The Lautech Shoppa Team
    `;

    console.log('--- Sending Customer Email ---');
    console.log(`To: ${customer.email}`);
    console.log(`Subject: ${customerEmailSubject}`);
    console.log(customerEmailBody);
    console.log('----------------------------');


    // 2. Group items by vendor
    const itemsByVendor = new Map<string, CartItem[]>();

    for (const item of cartItems) {
      const vendorId = item.vendorId || 'superadmin';
      if (!itemsByVendor.has(vendorId)) {
        itemsByVendor.set(vendorId, []);
      }
      itemsByVendor.get(vendorId)!.push(item);
    }
    
    // 3. Send email to each vendor
    for (const [vendorId, items] of itemsByVendor.entries()) {
      let vendorEmail = superAdminEmail;
      
      if (vendorId !== 'superadmin') {
          // In a real app, this would be a proper DB lookup.
          // Here we simulate it based on our localStorage "DB" logic.
          const adminUser = await getAdminUserByUid(vendorId);
          if (adminUser) {
            vendorEmail = adminUser.email;
          } else {
             console.log(`Could not find vendor email for vendorId: ${vendorId}. Notifying super admin.`);
          }
      }
      
      const vendorTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const vendorEmailSubject = `New Order Notification: #${orderId}`;
      const vendorEmailBody = `
          You have a new order to fulfill on Lautech Shoppa.

          Order ID: ${orderId}
          Customer: ${customer.name} (${customer.email})
          
          Total for your items: ₦${vendorTotal.toFixed(2)}

          Items to fulfill:
          ${items.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}

          Please process this order in the admin dashboard.
      `;
      
      console.log(`---- Sending Vendor/Admin Email to ${vendorEmail} ----`);
      console.log(`Subject: ${vendorEmailSubject}`);
      console.log(vendorEmailBody);
      console.log('--------------------------------------------------');
    }
  }
);
