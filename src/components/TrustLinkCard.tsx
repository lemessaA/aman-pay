'use client';

import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Share2, ExternalLink } from "lucide-react";

interface TrustLinkCardProps {
  listingId: string;
  itemName: string;
  price: number;
  location: string;
  confidence: number;
  aiSummary: string;
  shareUrl: string;
}

export function TrustLinkCard({ listingId, itemName, price, location, confidence, aiSummary, shareUrl }: TrustLinkCardProps) {
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${shareUrl}` : shareUrl;

  const handleShareTelegram = () => {
    const text = `🔒 *LEGA-AI VERIFIED*\n\n*${itemName}*\n💰 ${price.toLocaleString()} ETB\n📍 ${location}\n\n✅ AI Verified (${confidence}% confidence)\n\nBuy safely with M-Pesa Escrow:\n${fullUrl}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col gap-4"
    >
      {/* Certificate Card */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-6">
        {/* Background glow */}
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">Lega-Shield™</p>
            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">AI Verification Certificate</p>
          </div>
          <div className="p-3 bg-orange-500 rounded-2xl text-black shadow-lg shadow-orange-500/20">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* Item Info */}
        <div className="flex flex-col gap-1 mb-5">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">{itemName}</h3>
          <div className="flex items-center gap-3">
            <span className="text-orange-500 font-black text-lg">{price.toLocaleString()} ETB</span>
            <span className="text-zinc-700">·</span>
            <div className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold uppercase">
              <MapPin size={10} />
              {location}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-5 border-l-2 border-orange-500/40 pl-3">
          {aiSummary}
        </p>

        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col items-center p-3 rounded-2xl bg-black border border-zinc-900">
            <span className="text-xl font-black text-white">{confidence}%</span>
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">AI Confidence</span>
          </div>
          <div className="flex-1 flex flex-col items-center p-3 rounded-2xl bg-black border border-zinc-900">
            <span className="text-xl font-black text-orange-500">✓</span>
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Verified</span>
          </div>
          <div className="flex-1 flex flex-col items-center p-3 rounded-2xl bg-black border border-zinc-900">
            <span className="text-[11px] font-black text-white">{listingId}</span>
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">ID</span>
          </div>
        </div>
      </div>

      {/* Share to Telegram */}
      <button
        onClick={handleShareTelegram}
        className="w-full py-4 rounded-2xl bg-orange-500 text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-transform"
      >
        <Share2 size={18} />
        Share in Telegram Groups
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-full py-4 rounded-2xl bg-zinc-950 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all"
      >
        <ExternalLink size={16} />
        Copy Trust-Link
      </button>
    </motion.div>
  );
}
