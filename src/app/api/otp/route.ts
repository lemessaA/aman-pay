import { NextRequest, NextResponse } from "next/server";
import { validateOTP, getListing } from "@/lib/listings";

// POST: Driver submits an OTP to release funds
export async function POST(req: NextRequest) {
  try {
    const { listingId, otp } = await req.json();
    if (!listingId || !otp) {
      return NextResponse.json({ error: "Missing listingId or OTP" }, { status: 400 });
    }

    const listing = getListing(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.status !== "shipped") {
      return NextResponse.json({ error: "Item is not in transit yet" }, { status: 400 });
    }

    const valid = validateOTP(listingId, otp);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid OTP. Funds remain locked." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: `Funds of ${listing.price.toLocaleString()} ETB have been released to the seller. Delivery confirmed!`,
      listingId,
      itemName: listing.itemName,
      amount: listing.price,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
