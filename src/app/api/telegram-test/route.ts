import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set in .env.local" }, { status: 500 });
  }

  // Step 1: Get the very latest message sent to the bot
  const updatesRes = await fetch(`${TELEGRAM_API}/getUpdates?limit=100&offset=-1`);
  const updates = await updatesRes.json();

  if (!updates.ok || updates.result.length === 0) {
    return NextResponse.json({ 
      error: "No messages found. Make sure you sent 'Start' or any message to your bot in Telegram first.",
      tip: "Open your bot in Telegram and type anything, then reload this page."
    }, { status: 404 });
  }

  // Get the most recent sender's chat ID
  const latestUpdate = updates.result[updates.result.length - 1];
  const chatId = latestUpdate.message?.chat?.id || latestUpdate.message?.from?.id;
  const firstName = latestUpdate.message?.from?.first_name || "User";

  if (!chatId) {
    return NextResponse.json({ error: "Could not extract chat ID from updates" }, { status: 500 });
  }

  // Step 2: Send a test OTP message to that user
  const testOtp = "482917";
  const message = `🔒 *LEGA-AI — TEST MESSAGE*

✅ Your Telegram Bot is working!

📦 *Item:* iPhone 13 Pro (Test)
🔑 *Your Delivery OTP:* \`${testOtp}\`

Show this code to the Lega Bus driver when they arrive with your item.

🆔 Transaction ID: \`LEGA-TEST\`

_Powered by Lega-AI Secure Escrow_`;

  const sendRes = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
  });
  const sendData = await sendRes.json();

  if (sendData.ok) {
    return NextResponse.json({ 
      success: true, 
      message: `✅ Test OTP sent to ${firstName} (ID: ${chatId}). Check your Telegram!`,
      chatId,
      firstName,
    });
  } else {
    return NextResponse.json({ 
      error: "Bot found your chat ID but failed to send the message.",
      telegramError: sendData.description,
      chatId 
    }, { status: 500 });
  }
}
