'use client';

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Lock,
  AlertCircle,
  Zap,
  Package,
  Truck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { useTelegram } from "@/components/TelegramProvider";

interface Listing {
  id: string;
  itemName: string;
  price: number;
  location: string;
  category: "physical" | "digital";
  credentials?: { identity: string; secret: string };
  verified: boolean;
  confidence: number;
  aiSummary: string;
  status: "pending" | "funded" | "shipped" | "delivered";
  otp: string;
  busDate?: string;
  busRoute?: string;
  createdAt: string;
}

type BuyStep = "certificate" | "mpesa" | "processing" | "secured";

const PHYSICAL_STAGES = [
  { key: "funded",    icon: Lock,          label: "Funds Locked",       sub: "Your M-Pesa is secured in the Vault" },
  { key: "shipped",   icon: Package,        label: "Item Shipped",       sub: "Seller confirmed dispatch on Lega Bus" },
  { key: "transit",   icon: Truck,          label: "In Transit",         sub: "Bus en route to your city" },
  { key: "delivered", icon: Star,           label: "Delivered",          sub: "OTP confirmed — funds released" },
];

const DIGITAL_STAGES = [
  { key: "funded",    icon: Lock,          label: "Funds Locked",       sub: "M-Pesa secured. AI Watchdog Active" },
  { key: "verifying", icon: ShieldCheck,   label: "AI Audit",           sub: "Verifying account credentials..." },
  { key: "released",  icon: Zap,           label: "Handoff",            sub: "Credentials released to Buyer" },
  { key: "completed", icon: CheckCircle2,  label: "Complete",           sub: "30-min Anti-Pullback active" },
];

export default function BuyerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useTelegram();
  const [listing, setListing] = useState<Listing | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [buyStep, setBuyStep] = useState<BuyStep>("certificate");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [error, setError] = useState("");
  const [showTracker, setShowTracker] = useState(false);
  const [watchdogStatus, setWatchdogStatus] = useState("Monitoring...");
  const [isScam, setIsScam] = useState(false);

  const fetchListing = () =>
    fetch(`/api/listings?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.listing) setListing(d.listing); else setFetchError(true); })
      .catch(() => setFetchError(true));

  useEffect(() => { fetchListing(); }, [id]);

  useEffect(() => {
    if (!listing) return;

    const isActive = listing.status === "funded" || listing.status === "shipped" || listing.status === "delivered";
    if (isActive) {
      setShowTracker(true);
    }

    if (listing.category === "digital" && listing.status === "funded" && !isScam) {
      const timer = setTimeout(() => {
        setWatchdogStatus("Account Pulled Back! Scam Detected!");
        setIsScam(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [listing, isScam]);

  const handleBuy = async () => {
    if (mpesaPhone.length < 9) { setError("Please enter a valid phone number."); return; }
    setError("");
    setBuyStep("processing");
    try {
      const res = await fetch("/api/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mpesaPhone, amount: listing!.price, listingId: id, buyerTelegramId: user?.id }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchListing();
        setBuyStep("secured");
        setShowTracker(true);
      } else {
        setError("Payment failed.");
        setBuyStep("mpesa");
      }
    } catch {
      setError("Network error.");
      setBuyStep("mpesa");
    }
  };

  if (fetchError) return (
    <AppLayout>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-2xl font-black italic uppercase">Listing Not Found</h2>
        <Link href="/" className="mt-4 rounded-full bg-orange-500 px-8 py-4 font-black text-black">
          Back to Vault
        </Link>
      </div>
    </AppLayout>
  );

  if (!listing) return (
    <AppLayout>
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    </AppLayout>
  );

  const stages = listing.category === 'physical' ? PHYSICAL_STAGES : DIGITAL_STAGES;
  const stageIdx = listing.status === "funded" ? 0 : listing.status === "shipped" ? 2 : listing.status === "delivered" ? 3 : -1;

  return (
    <AppLayout>
      <div className="mb-6">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500">
          AI {listing.category} Escrow
        </p>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter sm:text-3xl">Lega-Shield™</h1>
      </div>

      <AnimatePresence mode="wait">
        {showTracker && (
          <motion.div key="tracker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
            {/* Header Card */}
            <div className={`p-5 rounded-3xl border flex items-center gap-4 ${isScam ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-950 border-zinc-800'}`}>
              <div className={`p-3 rounded-2xl text-black ${isScam ? 'bg-red-500' : 'bg-orange-500'}`}>
                {isScam ? <AlertCircle size={22} /> : <ShieldCheck size={22} />}
              </div>
              <div className="flex flex-col">
                <h2 className={`text-lg font-black italic uppercase tracking-tighter ${isScam ? 'text-red-500' : ''}`}>{listing.itemName}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-black text-sm">{listing.price.toLocaleString()} ETB</span>
                  {listing.category === 'digital' && !isScam && (
                    <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-black uppercase">Watchdog Active</span>
                  )}
                </div>
              </div>
            </div>

            {isScam ? (
              <div className="p-6 rounded-3xl bg-red-600 text-white flex flex-col gap-3 shadow-2xl shadow-red-600/20">
                <div className="flex items-center gap-2 font-black italic uppercase tracking-tighter">
                  <AlertCircle size={20} /> Scam Detected
                </div>
                <p className="text-xs font-bold leading-relaxed">
                  The Seller changed the account password during the trade. AI Watchdog detected "Login Failure".
                </p>
                <div className="h-px bg-white/20 my-1" />
                <p className="text-sm font-black uppercase tracking-widest text-center">💸 Refunded to M-Pesa</p>
              </div>
            ) : (
              <>
                {/* Watchdog Status */}
                {listing.category === 'digital' && (
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-2 h-2 rounded-full bg-orange-500 animate-pulse">
                        <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-50" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AI Watchdog</span>
                    </div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{watchdogStatus}</span>
                  </div>
                )}

                {/* Status Timeline */}
                <div className="flex flex-col gap-0">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-3">Escrow Status</p>
                  {stages.map((stage, i) => {
                    const done = stageIdx >= i;
                    const active = stageIdx === i;
                    const Icon = stage.icon;
                    return (
                      <div key={stage.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-orange-500 text-black' : 'bg-zinc-900 text-zinc-700'}`}>
                            {done ? <CheckCircle2 size={16} strokeWidth={2.5} /> : <Icon size={16} />}
                          </div>
                          {i < stages.length - 1 && <div className={`w-[2px] flex-1 my-1 rounded-full min-h-[24px] ${done && stageIdx > i ? 'bg-orange-500/50' : 'bg-zinc-900'}`} />}
                        </div>
                        <div className="pb-6 flex flex-col gap-0.5">
                          <p className={`text-sm font-black uppercase tracking-tight ${done ? 'text-white' : 'text-zinc-700'}`}>{stage.label}</p>
                          <p className={`text-[10px] font-bold ${done ? 'text-zinc-500' : 'text-zinc-800'}`}>{stage.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reveal Credentials / OTP */}
                {listing.status === "funded" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl bg-zinc-950 border border-orange-500/20 p-6 overflow-hidden relative">
                    <div className="absolute inset-0 bg-orange-500/5" />
                    {listing.category === 'digital' ? (
                      <div className="flex flex-col gap-4 relative">
                        <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">🔑 Digital Credentials</p>
                        <div className="flex flex-col gap-2">
                          <div className="p-3 bg-black border border-zinc-800 rounded-xl flex items-center justify-between">
                            <span className="text-[10px] text-zinc-600 uppercase font-black">ID</span>
                            <span className="text-sm font-mono font-bold text-white">{listing.credentials?.identity}</span>
                          </div>
                          <div className="p-3 bg-black border border-zinc-800 rounded-xl flex items-center justify-between">
                            <span className="text-[10px] text-zinc-600 uppercase font-black">SECRET</span>
                            <span className="text-sm font-mono font-bold text-orange-500">{listing.credentials?.secret}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 relative">
                        <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">📲 Delivery OTP</p>
                        <div className="flex gap-2 justify-center">
                          {listing.otp.split("").map((digit, i) => (
                            <div key={i} className="w-11 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-2xl font-black text-orange-500">{digit}</div>
                          ))}
                        </div>
                        <p className="text-[8px] text-zinc-500 text-center uppercase tracking-widest font-black mt-2">Enter this code with the driver to release funds</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}

            <Link href="/" className="w-full py-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-white font-black uppercase text-sm text-center">Back to Dashboard</Link>
          </motion.div>
        )}

        {/* Certificate View */}
        {!showTracker && buyStep === "certificate" && (
          <motion.div key="cert" className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
              <div className="absolute inset-0 bg-orange-500/3" />
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">AI Verified</p>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Lega-Shield {listing.category === 'digital' ? 'Vault' : 'Goods'}</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-2xl text-black"><ShieldCheck size={24} strokeWidth={2.5} /></div>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">{listing.itemName}</h2>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-orange-500 font-black text-xl">{listing.price.toLocaleString()} ETB</span>
                <span className="text-zinc-700">·</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase italic">{listing.category} escort</span>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-zinc-900 mb-4">
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1.5">AI AUDIT SUMMARY</p>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">{listing.aiSummary}</p>
              </div>
              {listing.category === 'digital' && (
                <div className="mb-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-2">
                  <ShieldCheck size={14} className="text-orange-500 shrink-0" />
                  <p className="text-[9px] text-zinc-400 leading-snug">
                    <strong className="text-white">Anti-Pullback Active:</strong> AI Groq will monitor this account for 30 minutes. If the seller changes the password, you are refunded instantly.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center p-3 rounded-2xl bg-black border border-zinc-900">
                  <span className="text-lg font-black text-white">{listing.confidence}%</span>
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Trust Score</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-black border border-zinc-900">
                  <Lock size={18} className="text-orange-500 mb-0.5" />
                  <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Vaulted</span>
                </div>
              </div>
            </div>
            <button onClick={() => setBuyStep("mpesa")} className="w-full py-5 rounded-full bg-orange-500 text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20">
              <Lock size={18} /> Buy & Lock Funds
            </button>
          </motion.div>
        )}

        {/* M-PESA & Other Steps */}
        {!showTracker && buyStep === "mpesa" && (
           <motion.div key="mpesa" className="flex flex-col gap-5">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Enter M-Pesa Number</h2>
            <input type="tel" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} placeholder="07XX XXX XXX" className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-white font-black text-xl text-center focus:border-orange-500" />
            {error && <p className="text-xs font-bold text-red-400">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setBuyStep("certificate")} className="flex-1 py-4 font-black uppercase text-sm border border-zinc-900 rounded-2xl">Back</button>
              <button onClick={handleBuy} className="flex-[2] py-4 rounded-full bg-orange-500 text-black font-black uppercase tracking-widest">Confirm</button>
            </div>
           </motion.div>
        )}

        {!showTracker && buyStep === "processing" && (
          <motion.div key="processing" className="flex flex-col items-center justify-center py-20 gap-8">
            <Loader2 size={48} className="text-orange-500 animate-spin" />
            <p className="font-black italic uppercase tracking-tighter text-xl">Confirming M-Pesa...</p>
          </motion.div>
        )}

        {!showTracker && buyStep === "secured" && (
          <motion.div key="secured" className="flex flex-col items-center gap-6 py-8 text-center text-white">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-black shadow-2xl shadow-orange-500/40"><Lock size={40} /></div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Funds Secured</h2>
            <button onClick={() => setShowTracker(true)} className="px-8 py-4 rounded-full bg-orange-500 text-black font-black uppercase tracking-widest">Go to Handoff →</button>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
