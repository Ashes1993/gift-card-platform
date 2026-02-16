// simulate-payment.js
const crypto = require("crypto");

// 1. Fill in your exact production details
const IPN_SECRET = "1WPT+2hTrhxuXl9w9MJNu2OO6I2n30MK";
const CART_ID = "cart_01KHJW08KBCK8WW1EJ9EE0VZJ7";
const WEBHOOK_URL = "http://127.0.0.1:9000/hooks/nowpayments";

// 2. The fake payload exactly as NOWPayments sends it
const payload = {
  payment_id: "50505050",
  payment_status: "finished",
  pay_address: "TYourWalletAddress...",
  price_amount: 15.0,
  price_currency: "usd",
  pay_amount: 15.0,
  pay_currency: "usdttrc20",
  order_id: CART_ID,
  order_description: `Cart #${CART_ID}`,
  created_at: new Date().toISOString(),
};

// 3. Generate the cryptographic signature to bypass your security check
const signature = crypto
  .createHmac("sha512", IPN_SECRET)
  .update(JSON.stringify(payload))
  .digest("hex");

console.log(`🚀 Firing simulated webhook for ${CART_ID}...`);

// 4. Send the request
fetch(WEBHOOK_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-nowpayments-sig": signature,
  },
  body: JSON.stringify(payload),
})
  .then(async (res) => {
    const text = await res.text();
    console.log(`\n📦 Server Status: ${res.status}`);
    console.log(`📦 Server Response: ${text}`);
  })
  .catch((err) => console.error("💥 Network Error:", err));
