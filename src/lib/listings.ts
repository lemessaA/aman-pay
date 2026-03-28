// In-memory listing store (for demo/MVP)
// Replace with Supabase calls when ready

export interface Listing {
  id: string;
  itemName: string;
  price: number;
  location: string;
  sellerTelegramId: string;
  buyerTelegramId?: string;   // set when buyer pays
  category: "physical" | "digital";
  credentials?: {
    identity: string; // username / email / id
    secret: string;   // password / key / token
  };
  videoFrame: string;
  verified: boolean;
  confidence: number;
  aiSummary: string;
  status: "pending" | "funded" | "shipped" | "delivered";
  otp: string;
  busDate?: string;
  busRoute?: string;
  createdAt: string;
}

const listingsStore: Map<string, Listing> = new Map();

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createListing(data: Omit<Listing, "id" | "createdAt" | "otp">): Listing {
  const id = `LEGA-${Math.floor(1000 + Math.random() * 9000)}`;
  const listing: Listing = { ...data, id, otp: generateOTP(), createdAt: new Date().toISOString() };
  listingsStore.set(id, listing);
  return listing;
}

export function getListing(id: string): Listing | undefined {
  return listingsStore.get(id);
}

export function updateListingStatus(id: string, status: Listing["status"], extra?: Partial<Listing>): boolean {
  const listing = listingsStore.get(id);
  if (!listing) return false;
  listingsStore.set(id, { ...listing, status, ...extra });
  return true;
}

export function validateOTP(id: string, enteredOtp: string): boolean {
  const listing = listingsStore.get(id);
  if (!listing || listing.otp !== enteredOtp) return false;
  listingsStore.set(id, { ...listing, status: "delivered" });
  return true;
}

export function getAllListings(): Listing[] {
  return Array.from(listingsStore.values());
}
