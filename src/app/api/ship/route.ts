import { NextRequest, NextResponse } from "next/server";
import { updateListingStatus, getListing } from "@/lib/listings";

// POST: Seller marks item as shipped (adds bus date/route)
export async function POST(req: NextRequest) {
  try {
    const { listingId, busDate, busRoute } = await req.json();
    if (!listingId) return NextResponse.json({ error: "Missing listingId" }, { status: 400 });

    const listing = getListing(listingId);
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    updateListingStatus(listingId, "shipped", { busDate, busRoute });

    return NextResponse.json({ success: true, message: "Listing marked as shipped." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
