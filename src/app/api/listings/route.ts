import { NextRequest, NextResponse } from "next/server";
import { createListing, getListing } from "@/lib/listings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemName, price, location, category, sellerTelegramId, videoFrame, verified, confidence, aiSummary } = body;

    if (!itemName || !price || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing = createListing({
      itemName,
      price: Number(price),
      location,
      category: category === "digital" ? "digital" : "physical",
      sellerTelegramId: sellerTelegramId || "unknown",
      videoFrame: videoFrame || "",
      verified: verified ?? false,
      confidence: confidence ?? 0,
      aiSummary: aiSummary || "",
      status: "pending",
    });

    return NextResponse.json({ listing, shareUrl: `/listing/${listing.id}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing listing ID" }, { status: 400 });

  const listing = getListing(id);
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  return NextResponse.json({ listing });
}
