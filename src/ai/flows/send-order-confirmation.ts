
'use server';
/**
 * @fileOverview A flow to handle sending order confirmation emails.
 *
 * - sendOrderConfirmation - A function that handles sending emails to customer and admin.
 * - OrderConfirmationInput - The input type for the sendOrderConfirmation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

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
        vendorId: z.string().optional(), // This is the vendor's email
    })).describe('The items in the order.'),
    cartTotal: z.number().describe('The total price of the order.'),
});

export type OrderConfirmationInput = z.infer<typeof OrderConfirmationInputSchema>;

export async function sendOrderConfirmation(input: OrderConfirmationInput): Promise<void> {
  await sendOrderConfirmationFlow(input);
}

// Helper function to create a Nodemailer transporter using SMTP
const createTransporter = async (): Promise<Transporter | null> => {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email service (SMTP) is not configured. Skipping email sending.");
        return null;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // This should be the App Password
            },
        });
        return transporter;
    } catch (error) {
        console.error("Failed to create Nodemailer transporter:", error);
        return null;
    }
};

const generateHtmlEmail = (title: string, preheader: string, body: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #2563eb; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; line-height: 1.6; color: #333; }
            .content h2 { color: #2563eb; }
            .item-list { margin: 20px 0; border-collapse: collapse; width: 100%; }
            .item-list th, .item-list td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
            .item-list th { background-color: #f1f5f9; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
        <div class="container">
            <div class="header">
                <h1>${title}</h1>
            </div>
            <div class="content">
                ${body}
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Lautech Shoppa. All Rights Reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};


const sendOrderConfirmationFlow = ai.defineFlow(
  {
    name: 'sendOrderConfirmationFlow',
    inputSchema: OrderConfirmationInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    
    const { orderId, customer, cartItems, cartTotal } = input;
    const transporter = await createTransporter();
    
    if (!transporter) {
        console.log("Skipping email notifications because email service is not configured.");
        return;
    }
    
    const senderEmail = process.env.EMAIL_USER!;
    const superAdminEmail = "promiseoyedele07@gmail.com"; 

    // 1. Generate and send customer email
    const customerEmailSubject = `Order Confirmed - Your Lautech Shoppa Order #${orderId}`;
    const customerEmailBody = `
        <h2>Hi ${customer.name},</h2>
        <p>Thank you for your order! We've received it and are getting it ready for you.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <table class="item-list">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${cartItems.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₦${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('')}
            </tbody>
        </table>
        <p class="total">Total: ₦${cartTotal.toFixed(2)}</p>
        <p>We'll notify you again once your order is out for delivery.</p>
        <p>Thanks,<br/>The Lautech Shoppa Team</p>
    `;
    const customerHtml = generateHtmlEmail('Order Confirmed!', `Your order #${orderId} has been placed.`, customerEmailBody);
    
    try {
        await transporter.sendMail({
            from: `"Lautech Shoppa" <${senderEmail}>`,
            to: customer.email,
            subject: customerEmailSubject,
            html: customerHtml,
        });
        console.log(`Customer confirmation email sent to ${customer.email}`);
    } catch (error) {
        console.error(`Failed to send customer email to ${customer.email}:`, error);
    }


    // 2. Group items by vendor
    const itemsByVendor = new Map<string, typeof cartItems>();

    for (const item of cartItems) {
      const vendorId = item.vendorId || superAdminEmail; // Default to super admin if no vendor
      if (!itemsByVendor.has(vendorId)) {
        itemsByVendor.set(vendorId, []);
      }
      itemsByVendor.get(vendorId)!.push(item);
    }
    
    // 3. Send email to each vendor
    for (const [vendorEmail, items] of itemsByVendor.entries()) {
      const vendorTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const vendorEmailSubject = `New Order Notification: #${orderId}`;
      const vendorEmailBody = `
          <h2>You have a new order to fulfill on Lautech Shoppa.</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
          <h3>Items to fulfill:</h3>
           <table class="item-list">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>₦${(item.price * item.quantity).toFixed(2)}</td></tr>`).join('')}
            </tbody>
          </table>
          <p class="total">Total for your items: ₦${vendorTotal.toFixed(2)}</p>
          <p>Please process this order in the admin dashboard.</p>
      `;
       const vendorHtml = generateHtmlEmail('New Order!', `You have a new order #${orderId}.`, vendorEmailBody);

       try {
            await transporter.sendMail({
                from: `"Lautech Shoppa" <${senderEmail}>`,
                to: vendorEmail,
                subject: vendorEmailSubject,
                html: vendorHtml,
            });
            console.log(`Vendor notification sent to ${vendorEmail}`);
       } catch (error) {
            console.error(`Failed to send vendor email to ${vendorEmail}:`, error);
            if (vendorEmail !== superAdminEmail) {
                try {
                     await transporter.sendMail({
                        from: `"Lautecha Shoppa System" <${senderEmail}>`,
                        to: superAdminEmail,
                        subject: `Failed to notify vendor for order #${orderId}`,
                        text: `The system failed to send an order notification to ${vendorEmail} for order #${orderId}. Please notify them manually. Error: ${error instanceof Error ? error.message : String(error)}`,
                    });
                } catch (superAdminError) {
                    console.error("Failed to send failure notification to super admin:", superAdminError);
                }
            }
       }
    }
  }
);
