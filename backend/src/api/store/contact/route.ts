import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Where do you want to receive the alerts?
const ADMIN_EMAIL = "support@nextlicense.shop";

// 2. Which email should show up as the sender?
// (Since you verified the domain, we hardcode this to look professional)
const SENDER_EMAIL = "NextLicense Support <support@nextlicense.shop>";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, subject, message, orderId } = req.body as any;

  if (!email || !message) {
    return res.status(400).json({ message: "Email and Message are required" });
  }

  // Create a short Ticket ID (e.g., T-4592)
  const ticketId = `T-${Math.floor(1000 + Math.random() * 9000)}`;

  console.log(`[Support] 🎫 Processing Ticket ${ticketId} from ${email}`);

  try {
    // --- EMAIL 1: Notify You (The Admin) ---
    // This stays in English so it's easy for you to read quickly
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: email, // So you can just hit "Reply" in your inbox
      subject: `[${ticketId}] New Support Request: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">New Support Ticket</h2>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>User:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <p><strong>Order ID:</strong> ${orderId || "N/A"}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <h3 style="font-size: 16px;">Message:</h3>
          <p style="background: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // --- EMAIL 2: Confirmation to Customer (Persian) ---
    // Translated to match your website language
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: `[${ticketId}] درخواست شما ثبت شد`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">درخواست شما دریافت شد</h2>
          <p>سلام ${name} عزیز،</p>
          <p>پیام شما با موفقیت در سیستم ثبت شد. همکاران ما در سریع‌ترین زمان ممکن آن را بررسی کرده و پاسخ را به همین ایمیل ارسال خواهند کرد.</p>
          
          <div style="background: #eff6ff; border: 1px solid #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>شماره پیگیری:</strong> ${ticketId}</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">لطفاً در مکاتبات بعدی از این شماره استفاده کنید.</p>
          </div>

          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          
          <p><strong>موضوع:</strong> ${subject}</p>
          <p><strong>متن پیام شما:</strong></p>
          <p style="color: #555; background: #f9fafb; padding: 10px; border-radius: 6px;">${message}</p>
          
          <br/>
          <p style="font-size: 12px; color: #9ca3af;">تیم پشتیبانی نکست لایسنس</p>
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
