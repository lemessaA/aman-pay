'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, CheckCircle2, AlertCircle, Package, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";

type DriverStep = "input" | "processing" | "success" | "error";

export default function DriverPortal() {
  const [listingId, setListingId] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<DriverStep>("input");
  const [result, setResult] = useState<{ message: string; itemName: string; amount: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const otpString = otp.join("");

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[index] = val;
    setOtp(next);
    // Auto-advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    if (listingId.trim().length < 4 || otpString.length < 6) return;
    setStep("processing");
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listingId.trim().toUpperCase(), otp: otpString }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ message: data.message, itemName: data.itemName, amount: data.amount });
        setStep("success");
      } else {
        setErrorMsg(data.error || "Invalid OTP.");
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error. Try again.");
      setStep("error");
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <header className="mb-12 flex flex-col gap-1">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500"
          >
            <Zap size={12} /> Legal Node: Driver Portal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black uppercase italic tracking-tighter text-white sm:text-5xl"
          >
            Release Funds
          </motion.h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
            Escrow Settlement via Smart-OTP
          </p>
        </header>

        <AnimatePresence mode="wait">
          {/* ─── OTP INPUT ─── */}
          {step === "input" && (
            <motion.div 
              key="input" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="flex flex-col gap-8 rounded-[40px] border border-white/5 bg-zinc-950/50 p-8 shadow-2xl backdrop-blur-xl md:p-12"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Verification Step</h2>
                <p className="max-w-md text-xs leading-relaxed text-zinc-500">
                  The buyer will provide a 6-digit confirmation code. Entering this code triggers the instant release of funds from the Escrow Vault to the Seller.
                </p>
              </div>

              {/* Listing ID */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <Package size={12} className="text-orange-500" /> Transaction ID
                </label>
                <input
                  type="text"
                  value={listingId}
                  onChange={e => setListingId(e.target.value.toUpperCase())}
                  placeholder="LEGA-XXXX"
                  className="w-full rounded-2xl border border-zinc-900 bg-black p-5 text-center text-2xl font-black uppercase tracking-widest text-white outline-none transition-all placeholder:text-zinc-800 focus:border-orange-500/50 focus:bg-zinc-950"
                />
              </div>

              {/* OTP Boxes */}
              <div className="flex flex-col gap-3 text-center sm:text-left">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">6-Digit Settlement OTP</label>
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start lg:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="tel"
                      maxLength={1}
                      inputMode="numeric"
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`h-16 w-12 rounded-2xl border bg-black text-center text-2xl font-black transition-all sm:h-20 sm:w-16 sm:text-3xl ${
                        digit ? 'border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'border-zinc-900 text-zinc-800'
                      } focus:border-orange-500 focus:text-orange-500 focus:shadow-[0_0_24px_rgba(249,115,22,0.2)] outline-none`}
                    />
                  ))}
                </div>
              </div>

              {/* Warning/Info */}
              <div className="flex gap-4 rounded-3xl border border-orange-500/10 bg-orange-500/5 p-6">
                <ShieldCheck size={20} className="mt-1 shrink-0 text-orange-500" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Security Protocol</span>
                  <p className="text-[10px] leading-relaxed text-zinc-500">
                    Entering this OTP is permanent. Only proceed if the physical item has been inspected and received by the buyer. AI Watchdog tracks this signature.
                  </p>
                </div>
              </div>

              <button
                disabled={otpString.length < 6 || listingId.trim().length < 4}
                onClick={handleSubmit}
                className="group relative h-16 w-full overflow-hidden rounded-full bg-orange-500 font-black uppercase tracking-widest text-black shadow-xl shadow-orange-500/10 transition-all hover:shadow-orange-500/20 active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2 text-sm">
                  <CheckCircle2 size={18} />
                  Authorize Settlement
                </span>
              </button>
            </motion.div>
          )}

          {/* ─── PROCESSING ─── */}
          {step === "processing" && (
            <motion.div 
              key="processing" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-10 py-32 text-center"
            >
              <div className="relative h-32 w-32">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-[3px] border-zinc-900 border-t-orange-500" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Truck size={40} className="text-orange-500" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Connecting to Vault...</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Validating Cryptographic Handshake</p>
              </div>
            </motion.div>
          )}

          {/* ─── SUCCESS ─── */}
          {step === "success" && result && (
            <motion.div 
              key="success" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center gap-8 py-12 text-center"
            >
              <div className="relative h-40 w-40 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.3)]">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 size={72} className="text-black" strokeWidth={2.5} />
                </motion.div>
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Payout Released</h2>
                <p className="mx-auto max-w-sm text-xs font-medium leading-relaxed text-zinc-500">
                  Transaction <span className="text-orange-500">{listingId}</span> has been finalized. Funds are currently being cleared to the seller's M-PESA wallet.
                </p>
              </div>

              <div className="w-full space-y-px overflow-hidden rounded-3xl border border-white/5 bg-zinc-950">
                <div className="flex items-center justify-between p-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Merchant Item</span>
                  <span className="text-sm font-black italic text-white uppercase">{result.itemName}</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between p-6 bg-orange-500/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Settlement Amount</span>
                  <span className="text-2xl font-black italic text-orange-500 tracking-tighter">{result.amount.toLocaleString()} ETB</span>
                </div>
              </div>

              <Link 
                href="/" 
                className="h-16 w-full rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
              >
                Back to Terminal
              </Link>
            </motion.div>
          )}

          {/* ─── ERROR ─── */}
          {step === "error" && (
            <motion.div 
              key="error" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="flex flex-col items-center gap-8 py-12 text-center"
            >
              <div className="h-32 w-32 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <AlertCircle size={52} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Auth Failed</h2>
                <p className="max-w-xs text-xs text-zinc-500 mx-auto">{errorMsg || "The OTP provided does not match our records for this transaction."}</p>
              </div>
              <button
                onClick={() => { setStep("input"); setOtp(["", "", "", "", "", ""]); }}
                className="h-16 w-full rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-sm hover:bg-red-500/20 transition-all"
              >
                Reset & Try Again
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
