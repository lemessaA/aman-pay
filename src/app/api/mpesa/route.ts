import { NextRequest, NextResponse } from "next/server";
import { updateListingStatus, getListing } from "@/lib/listings";
import { sendOTPToBuyer, notifySeller } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, listingId, buyerTelegramId } = await req.json();

    if (!phone || !amount || !listingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing = getListing(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Simulate M-Pesa STK Push processing (real: Daraja API call goes here)
    await new Promise(r => setTimeout(r, 2500));

    const checkoutRequestId = `CR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Update listing: mark as funded, store buyer Telegram ID
    updateListingStatus(listingId, "funded", {
      buyerTelegramId: buyerTelegramId?.toString() || "",
    });

    // Fetch updated listing to get the OTP
    const updatedListing = getListing(listingId)!;

    // 🤖 Send OTP to buyer via Telegram Bot
    if (buyerTelegramId) {
      await sendOTPToBuyer(
        buyerTelegramId,
        updatedListing.otp,
        listing.itemName,
        listingId
      );
    }

    // 🤖 Notify seller that funds are secured
    if (listing.sellerTelegramId && listing.sellerTelegramId !== "unknown") {
      await notifySeller(
        listing.sellerTelegramId,
        listing.itemName,
        listing.price,
        listing.location,
        listingId
      );
    }

    return NextResponse.json({
      success: true,
      checkoutRequestId,
      otpSentViaTelegram: !!buyerTelegramId,
      message: buyerTelegramId
        ? `STK Push sent to ${phone}. OTP delivered to your Telegram!`
        : `STK Push sent to ${phone}. Check the app for your OTP.`,
      amount,
      listingId,
    });
  } catch (err) {
    console.error("M-Pesa error:", err);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
