import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "ashkaneslamii1993@gmail.com";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, subject, message, orderId } = req.body as any;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and Message are required" });
  }

  const ticketId = `T-${Math.floor(1000 + Math.random() * 9000)}`;

  console.log(`[Support] 🎫 Processing Ticket ${ticketId} from ${email}`);

  try {
    // 1. Email Admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      replyTo: email, // <--- FIXED: CamelCase
      subject: `[${ticketId}] New Support Request: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #d32f2f;">New Support Ticket</h2>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Order ID:</strong> ${orderId || "N/A"}</p>
          <hr />
          <h3>Message:</h3>
          <p style="background: #f4f4f5; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });

    // 2. Email Customer
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: `[${ticketId}] We received your request`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Request Received</h2>
          <p>Hi ${name},</p>
          <p>Thanks for contacting us. Your ticket ID is <strong>${ticketId}</strong>.</p>
          <p>Our support team will review your message and get back to you shortly.</p>
          <hr />
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message Copy:</strong></p>
          <p style="color: #555;">${message}</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "Ticket sent successfully",
      ticketId,
    });
  } catch (error) {
    console.error("[Support] 💥 Resend Error:", error);
    return res.status(500).json({ message: "Failed to send emails" });
  }
}
