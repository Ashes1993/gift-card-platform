// Helper to format currency
const formatMoney = (amount: any) => {
  const value = Number(amount) || 0;
  return (
    new Intl.NumberFormat("fa-IR", {
      style: "decimal",
      maximumFractionDigits: 0, // <--- FIX: Forces no decimals
      minimumFractionDigits: 0,
    }).format(value) + " ریال"
  );
};

export const EmailTemplates = {
  /**
   * 1. Digital Delivery Email
   */
  digitalDelivery: (
    orderId: string,
    items: { code: string; label: string }[],
  ) => {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
        <head>
          <meta charset="utf-8">
          <title>تحویل محصول دیجیتال</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Tahoma, Arial, sans-serif;">
          
          <div dir="rtl" style="direction: rtl; text-align: right; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="background: #000; padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">تحویل سفارش</h1>
            </div>

            <div style="padding: 40px 30px;">
              <p style="margin: 0 0 10px; font-size: 16px; color: #555;">سلام،</p>
              <p style="margin: 0; font-size: 16px; color: #555;">
                از خرید شما سپاسگزاریم! سفارش شماره <strong>#${orderId}</strong> پردازش شد&rlm;.
              </p>

              <div style="margin: 30px 0;">
                <h3 style="font-size: 14px; color: #888; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">
                  کد(های) فعال‌سازی شما:
                </h3>
                ${items
                  .map(
                    (item) => `
                  <div style="background: #f0fdf4; border: 1px dashed #16a34a; border-radius: 8px; padding: 15px; text-align: center; margin-bottom: 15px;">
                    ${item.label ? `<div style="font-size: 14px; color: #16a34a; font-weight: bold; margin-bottom: 8px;">${item.label}</div>` : ""}
                    
                    <div style="direction: ltr; text-align: center;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 700; color: #15803d; letter-spacing: 2px;">
                        ${item.code}
                      </span>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>

              <p style="font-size: 14px; color: #666; background: #fafafa; padding: 15px; border-radius: 6px; border-right: 4px solid #000; margin: 0;">
                <strong>💡 راهنما:</strong><br/>
                کد بالا را کپی کرده و استفاده کنید&rlm;.
              </p>
            </div>

            <div style="background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="font-size: 12px; color: #999; margin: 0;">
                &copy; ${new Date().getFullYear()} فروشگاه نکست لایسنس. تمامی حقوق محفوظ است&rlm;.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  },

  /**
   * 2. Receipt Email (Order Placed)
   */
  orderReceipt: (order: any) => {
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
        <head>
          <meta charset="utf-8">
          <title>رسید سفارش</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Tahoma, Arial, sans-serif;">
          
          <div dir="rtl" style="direction: rtl; text-align: right; max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="background: #000; padding: 30px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 22px;">تایید سفارش</h1>
            </div>

            <div style="padding: 40px 30px;">
              <p style="margin: 0 0 10px; font-size: 16px; color: #555;">سلام،</p>
              <p style="margin: 0; font-size: 16px; color: #555;">
                سفارش شماره <strong>#${order.display_id}</strong> با موفقیت ثبت شد&rlm;.
              </p>
              
              <div style="background: #fffbe6; border: 1px solid #ffe58f; border-radius: 6px; padding: 15px; margin: 20px 0; font-size: 14px; color: #8a6d3b;">
                <strong>توجه:</strong> کد فعال‌سازی در ایمیلی جداگانه ارسال خواهد شد&rlm;.
              </div>

              <div style="margin-top: 30px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                <h3 style="font-size: 14px; color: #888; margin-bottom: 15px;">خلاصه سفارش</h3>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr style="border-bottom: 2px solid #eee;">
                    <th style="padding: 10px 0; text-align: right; color: #888; font-weight: normal;">محصول</th>
                    <th style="padding: 10px 0; text-align: left; color: #888; font-weight: normal;">قیمت</th>
                  </tr>

                  ${(order.items || [])
                    .map(
                      (item: any) => `
                    <tr style="border-bottom: 1px solid #f9f9f9;">
                      <td style="padding: 12px 0; color: #333;">
                        <strong>${item.title}</strong> 
                        <div style="color: #888; font-size: 12px; margin-top: 4px;">تعداد: ${item.quantity}</div>
                      </td>
                      <td style="padding: 12px 0; text-align: left; direction: ltr;">
                        ${formatMoney(item.unit_price * item.quantity)}
                      </td>
                    </tr>
                  `,
                    )
                    .join("")}

                  <tr>
                    <td style="padding-top: 20px; color: #666;">جمع جزء</td>
                    <td style="padding-top: 20px; text-align: left; direction: ltr; color: #666;">
                      ${formatMoney(order.subtotal)}
                    </td>
                  </tr>

                  ${
                    order.tax_total > 0
                      ? `
                  <tr>
                    <td style="padding-top: 5px; color: #d32f2f;">مالیات (۹٪)</td>
                    <td style="padding-top: 5px; text-align: left; direction: ltr; color: #d32f2f;">
                      ${formatMoney(order.tax_total)}
                    </td>
                  </tr>`
                      : ""
                  }

                  <tr>
                    <td style="padding-top: 10px; font-weight: bold; color: #000; font-size: 16px;">مبلغ قابل پرداخت</td>
                    <td style="padding-top: 10px; text-align: left; font-weight: bold; color: #000; font-size: 18px; direction: ltr;">
                      ${formatMoney(order.total)}
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <div style="background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="font-size: 12px; color: #999; margin: 0;">
                &copy; ${new Date().getFullYear()} فروشگاه نکست لایسنس. تمامی حقوق محفوظ است&rlm;.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  },
};
