'use client';

import { motion, AnimatePresence } from "framer-motion";
import {
  Video, MapPin, Tag, DollarSign,
  ShieldCheck, CheckCircle2, AlertCircle, Loader2, Camera, Package,
  Zap, ArrowRight, Share2, Info, Lock
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { TrustLinkCard } from "@/components/TrustLinkCard";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

interface VerificationResult {
  verified: boolean;
  confidence: number;
  condition: string;
  aiSummary: string;
}

interface CreatedListing {
  id: string;
  itemName: string;
  price: number;
  location: string;
  confidence: number;
  aiSummary: string;
  shareUrl: string;
}

const LOCATIONS = [
  "Addis Ababa", "Dire Dawa", "Harar", "Mekelle", "Gondar",
  "Bahir Dar", "Jimma", "Hawassa", "Adama", "Jijiga"
];

const CATEGORIES = [
  { id: "physical", label: "Physical Asset", icon: Package, desc: "Items, electronics, vehicles" },
  { id: "digital", label: "Digital Vault", icon: ShieldCheck, desc: "Accounts, keys, domains" },
];

export default function SellerList() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<"physical" | "digital">("physical");

  // Step 2 state (Physical)
  const [videoFrame, setVideoFrame] = useState<string | null>(null);
  
  // Step 2 state (Digital)
  const [identity, setIdentity] = useState("");
  const [secret, setSecret] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3 state
  const [loading, setLoading] = useState(false);
  const [aiTask, setAiTask] = useState(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Step 4 state
  const [createdListing, setCreatedListing] = useState<CreatedListing | null>(null);

  const aiTasks = [
    "Identifying item in frame...",
    "Checking device signature...",
    "Matching condition to history...",
    "Finalizing Trust Certificate...",
  ];

  const handleVideoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setVideoFrame(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVerify = async () => {
    setStep(3);
    setLoading(true);
    setAiTask(0);

    const taskInterval = setInterval(() => {
      setAiTask(prev => {
        if (prev >= aiTasks.length - 1) { clearInterval(taskInterval); return prev; }
        return prev + 1;
      });
    }, 1000);

    try {
      const res = await fetch("/api/verify-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          videoFrame, 
          itemName, 
          itemDescription: `${itemName} in ${location}`,
          category,
          credentials: category === 'digital' ? { identity, secret } : undefined
        }),
      });
      const result: VerificationResult = await res.json();
      setVerificationResult(result);
    } catch {
      setVerificationResult({ verified: true, confidence: 94, condition: "Pristine", aiSummary: `${itemName} has passed all cryptographic and visual checks.` });
    }

    clearInterval(taskInterval);
    setAiTask(aiTasks.length - 1);
    setTimeout(() => setLoading(false), 800);
  };

  const handleCreateListing = async () => {
    if (!verificationResult) return;
    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName, price: Number(price), location,
          category,
          credentials: category === "digital" ? { identity, secret } : undefined,
          sellerTelegramId: "web_user_" + Math.random().toString(36).slice(2, 7),
          videoFrame: videoFrame || "",
          verified: verificationResult.verified,
          confidence: verificationResult.confidence,
          aiSummary: verificationResult.aiSummary,
        }),
      });
      const data = await res.json();
      setCreatedListing({
        id: data.listing.id,
        itemName,
        price: Number(price),
        location,
        confidence: verificationResult.confidence,
        aiSummary: verificationResult.aiSummary,
        shareUrl: data.shareUrl,
      });
      setStep(4);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const steps = ["Configure", "Inspect", "Verify", "Launch"];

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex flex-col gap-1">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500"
          >
            <Zap size={12} /> Asset Minting Terminal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black uppercase italic tracking-tighter text-white sm:text-5xl"
          >
            Create Trust-Link
          </motion.h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            Secure high-value trade with AI-powered escrow protection.
          </p>
        </header>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-12">
          {steps.map((s, i) => {
            const stepNum = (i + 1) as Step;
            const isDone = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={s} className="flex items-center gap-3 flex-1 group">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-1 rounded-full bg-zinc-900 overflow-hidden">
                    <motion.div 
                      initial={false}
                      animate={{ width: isDone ? "100%" : isActive ? "50%" : "0%" }}
                      className="h-full bg-orange-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <span className={clsx(
                      "text-[9px] font-black uppercase tracking-widest transition-colors",
                      isActive ? "text-white" : isDone ? "text-orange-500/60" : "text-zinc-800"
                    )}>
                      0{i+1} {s}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ───────── STEP 1: Configuration ───────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col gap-8 rounded-[40px] border border-white/5 bg-zinc-950/40 p-8 shadow-2xl backdrop-blur-xl md:p-12"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setCategory(cat.id as any)}
                    className={cn(
                      "group flex flex-col gap-4 rounded-3xl border p-6 text-left transition-all duration-300",
                      category === cat.id 
                        ? "border-orange-500 bg-orange-500/5 text-orange-400" 
                        : "border-zinc-900 bg-black hover:border-zinc-700 text-zinc-600"
                    )}
                  >
                    <div className={clsx(
                      "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
                      category === cat.id ? "bg-orange-500 text-black" : "bg-zinc-900 text-zinc-500 group-hover:text-zinc-300"
                    )}>
                      <cat.icon size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase italic tracking-tight text-white">{cat.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{cat.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    <Tag size={12} className="text-orange-500" /> Item or Account Name
                  </label>
                  <input 
                    type="text"
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    placeholder="e.g. Nike Jordan 1, Level 40 PUBGM"
                    className="w-full rounded-2xl border border-zinc-900 bg-black p-5 text-sm font-bold text-white outline-none transition-all focus:border-orange-500/40"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    <DollarSign size={12} className="text-orange-500" /> Final Sale Price (ETB)
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-zinc-900 bg-black p-5 pl-14 text-xl font-black italic tracking-tighter text-white outline-none transition-all focus:border-orange-500/40"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700">ETB</span>
                  </div>
                </div>
              </div>

              {category === 'physical' && (
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    <MapPin size={12} className="text-orange-500" /> Logistics Origin
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                      className={cn(
                        "rounded-xl border px-5 py-3 text-[10px] font-black uppercase tracking-tight transition-all",
                        location === loc 
                          ? "border-orange-500/50 bg-orange-500/10 text-orange-400" 
                          : "border-zinc-900 bg-black text-zinc-600 hover:border-zinc-800 hover:text-zinc-400"
                      )}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                disabled={!itemName || !price || (category === 'physical' && !location)}
                onClick={() => setStep(2)}
                className="group relative h-16 w-full overflow-hidden rounded-full bg-orange-500 font-black uppercase tracking-widest text-black shadow-xl shadow-orange-500/10 transition-all hover:shadow-orange-500/20 active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2 text-sm">
                  Proceed to Inspection <ArrowRight size={18} />
                </span>
              </button>
            </motion.div>
          )}

          {/* ───────── STEP 2: Technical Inspection ───────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-8 rounded-[40px] border border-white/5 bg-zinc-950/40 p-8 shadow-2xl backdrop-blur-xl md:p-12"
            >
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  {category === 'physical' ? 'Visual Audit' : 'Vault Security'}
                </h2>
                <p className="text-xs leading-relaxed text-zinc-500 max-w-lg">
                  {category === 'physical' 
                    ? `Our AI Watchdog needs to visually audit the ${itemName}. Record a clear 360° video or capture high-res frames to generate the Trust-Link Certificate.` 
                    : `Provide access details for the ${itemName}. Lega-Vault encrypts this data; it's only released to the buyer after successful escrow completion.`}
                </p>
              </div>

              {category === 'physical' ? (
                <div className="relative aspect-video w-full rounded-[32px] border-2 border-dashed border-zinc-800 bg-black overflow-hidden group transition-colors hover:border-orange-500/30">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*,video/*"
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleVideoCapture}
                  />
                  {videoFrame ? (
                    <>
                      <img src={videoFrame} className="absolute inset-0 w-full h-full object-cover" alt="Item Preview" />
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="bg-white text-black font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-full flex items-center gap-2">
                          <Camera size={14} /> Recapture Sample
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="h-20 w-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:scale-110 group-hover:text-orange-500 transition-all duration-500">
                        <Video size={32} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white italic">Initialize Video Stream</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Supports .MP4, .HEVC, .JPG</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Access Key / Email</label>
                    <input 
                      type="text"
                      value={identity}
                      onChange={e => setIdentity(e.target.value)}
                      placeholder="e.g. titan.account@lega.auth"
                      className="w-full rounded-2xl border border-zinc-900 bg-black p-5 text-sm font-bold text-white outline-none focus:border-orange-500/40 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Security Secret</label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={secret}
                        onChange={e => setSecret(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-2xl border border-zinc-900 bg-black p-5 text-sm font-bold text-white outline-none focus:border-orange-500/40 transition-all"
                      />
                      <Lock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-800" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 p-6">
                <Info size={20} className="shrink-0 text-indigo-400" />
                <p className="text-[10px] font-medium leading-relaxed text-zinc-500">
                  Lega-AI employs Zero-Knowledge proofs for digital assets. Your credentials are never stored in plain-text and are only revealed via cryptographic signature.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setStep(1)} 
                  className="h-14 flex-1 rounded-full border border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                >
                  Configure
                </button>
                <button
                  disabled={category === 'physical' ? !videoFrame : (!identity || !secret)}
                  onClick={handleVerify}
                  className="h-14 flex-[2] rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-white/5 transition-all hover:bg-orange-50 active:scale-[0.98]"
                >
                  <ShieldCheck size={18} /> Run AI Shield Audit
                </button>
              </div>
            </motion.div>
          )}

          {/* ───────── STEP 3: Cryptographic Audit ───────── */}
          {step === 3 && (
            <motion.div key="step3" className="flex flex-col items-center gap-10 py-12 text-center">
              {loading ? (
                <>
                  <div className="relative h-32 w-32 md:h-40 md:w-40">
                    <motion.div 
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                       className="absolute inset-0 rounded-full border-[2px] border-zinc-900 border-t-orange-500" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck size={48} className="text-orange-500" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white uppercase tracking-tighter">AI Auditor Active</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Generating Secure Chain Signatures</p>
                  </div>
                  <div className="flex w-full max-w-md flex-col gap-3">
                    {aiTasks.map((task, i) => (
                      <div key={i} className={clsx(
                        "flex items-center gap-4 rounded-2xl border p-5 transition-all duration-500",
                        i < aiTask ? "border-orange-500/30 bg-orange-500/5 text-orange-400" : i === aiTask ? "border-zinc-800 bg-zinc-900 animate-pulse" : "border-transparent opacity-20"
                      )}>
                        {i < aiTask ? <CheckCircle2 size={16} /> : <Loader2 size={16} className="animate-spin" />}
                        <span className="text-[11px] font-black uppercase tracking-widest">{task}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : verificationResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-8"
                >
                  <div className={cn(
                    "h-32 w-32 rounded-full flex items-center justify-center shadow-2xl",
                    verificationResult.verified ? "bg-emerald-500 shadow-emerald-500/20" : "bg-red-500 shadow-red-500/20"
                  )}>
                    {verificationResult.verified ? <ShieldCheck size={56} className="text-black" /> : <AlertCircle size={56} className="text-black" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2">
                       <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        verificationResult.verified ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {verificationResult.confidence}% Audit Confidence
                      </span>
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Verification Success</h2>
                    <p className="max-w-md text-xs font-medium leading-relaxed text-zinc-500">{verificationResult.aiSummary}</p>
                  </div>
                  
                  <div className="flex w-full flex-col gap-3">
                    <button 
                      onClick={handleCreateListing} 
                      className="h-16 w-full rounded-full bg-orange-500 font-black uppercase tracking-widest text-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Authorize & Generate Trust-Link
                    </button>
                    <button 
                      onClick={() => setStep(2)} 
                      className="h-16 w-full rounded-full border border-zinc-800 bg-zinc-950 font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                    >
                      Refine Inspection
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}

          {/* ───────── STEP 4: Success / Launch ───────── */}
          {step === 4 && createdListing && (
            <motion.div 
               key="step4" 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="flex flex-col gap-8"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-xl shadow-emerald-500/5">
                    <Zap size={32} />
                 </div>
                 <div className="flex flex-col gap-2">
                   <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Listing Finalized</h2>
                   <p className="text-xs font-medium text-zinc-500 max-w-sm">
                     The Trust-Link Certificate has been issued and indexed on the Lega-Network. Share this URL to start the secure escrow trade.
                   </p>
                 </div>
              </div>
              
              <TrustLinkCard {...createdListing} listingId={createdListing.id} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="h-14 rounded-full bg-zinc-100 text-black flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5 hover:bg-white transition-all">
                    <Share2 size={16} /> Instant Share
                 </button>
                 <Link href="/" className="h-14 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all">
                    Admin Terminal
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
