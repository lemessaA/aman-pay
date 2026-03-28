/**
 * Telegram Bot Notification Utility
 * Sends messages via the Lega-AI Telegram Bot to specific users.
 * Requires TELEGRAM_BOT_TOKEN in .env.local
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramMessage(
  chatId: string | number,
  message: string,
  parseMode: "HTML" | "Markdown" = "Markdown"
): Promise<boolean> {
  if (!BOT_TOKEN) {
    console.warn("[Lega-AI Bot] TELEGRAM_BOT_TOKEN not set — skipping Telegram notification.");
    console.log(`[Lega-AI Bot] Would have sent to ${chatId}:\n${message}`);
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error("[Lega-AI Bot] Failed to send message:", data.description);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Lega-AI Bot] Network error:", err);
    return false;
  }
}

/**
 * Send OTP to buyer after payment is confirmed.
 */
export async function sendOTPToBuyer(
  buyerTelegramId: string | number,
  otp: string,
  itemName: string,
  listingId: string
): Promise<boolean> {
  const message = 
`🔒 *LEGA-AI — FUNDS SECURED*

Your payment is safely locked in the Escrow Vault.

📦 *Item:* ${itemName}
🔑 *Your Delivery OTP:* \`${otp}\`

*Show this code to the Lega Bus driver when they arrive with your item.*
Do NOT share it before receiving your goods.

🆔 Transaction ID: \`${listingId}\`

_Powered by Lega-AI Secure Escrow_`;

  return sendTelegramMessage(buyerTelegramId, message);
}

/**
 * Notify seller that funds are secured and they must ship within 24h.
 */
export async function notifySeller(
  sellerTelegramId: string | number,
  itemName: string,
  price: number,
  buyerLocation: string,
  listingId: string
): Promise<boolean> {
  const message =
`✅ *LEGA-AI — FUNDS SECURED!*

A buyer has locked *${price.toLocaleString()} ETB* in the Escrow Vault for your item.

📦 *Item:* ${itemName}
📍 *Deliver to:* ${buyerLocation}
⏰ *Deadline:* You have *24 hours* to put the item on a Lega Bus.
🆔 *Transaction ID:* \`${listingId}\`

Once delivered, the buyer will release your funds using their OTP.

_Powered by Lega-AI Secure Escrow_`;

  return sendTelegramMessage(sellerTelegramId, message);
}
