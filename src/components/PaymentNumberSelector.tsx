'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Check, Zap, Info } from "lucide-react";
import { useTelegram } from "./TelegramProvider";

interface PaymentNumberSelectorProps {
  onComplete: (phoneNumber: string) => void;
  initialValue?: string;
}

export function PaymentNumberSelector({ onComplete, initialValue = "" }: PaymentNumberSelectorProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);
  const [provider, setProvider] = useState<{ name: string; color: string } | null>(null);
  const { webApp } = useTelegram();

  useEffect(() => {
    detectProvider(phoneNumber);
  }, [phoneNumber]);

  const detectProvider = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('07') || cleanNum.startsWith('2517')) {
      setProvider({ name: "Safaricom Wallet", color: "text-orange-400" });
    } else if (cleanNum.startsWith('09') || cleanNum.startsWith('2519')) {
      setProvider({ name: "M-Pesa / Ethio Telecom", color: "text-amber-400" });
    } else {
      setProvider(null);
    }
  };

  const handleQuickFill = () => {
    if (webApp) {
      const isSupported = webApp.isVersionAtLeast && webApp.isVersionAtLeast('7.0');
      if (isSupported && webApp.requestContact) {
        webApp.requestContact((sent: boolean) => {
          if (sent) setPhoneNumber("+251 (SIM Card)");
        });
      }
    }
  };

  const isInvalid = phoneNumber.length < 9;

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.35em]">STEP 4</p>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
          LINK PAYMENT
        </h2>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
          Connect your M-Pesa or Safaricom Wallet
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500/10 blur-2xl group-focus-within:bg-orange-500/15 transition-all rounded-full pointer-events-none" />
        <div className="relative bg-zinc-950 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden">
          
          <div className="flex flex-col gap-4">
            {/* Input */}
            <div className="relative">
              <input 
                type="tel"
                placeholder="07... or 09..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full py-5 px-6 rounded-2xl bg-black border border-zinc-800 text-white font-black text-center text-2xl tracking-tight focus:border-orange-500/60 outline-none transition-all placeholder:text-zinc-800 shadow-inner"
              />
              <AnimatePresence>
                {provider && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-1 right-2"
                  >
                    <div className="bg-zinc-800 p-1 rounded-full text-orange-500">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Provider Label */}
            <div className="h-5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {provider ? (
                  <motion.div 
                    key={provider.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`flex items-center gap-1.5 ${provider.color} font-black text-[9px] uppercase tracking-widest`}
                  >
                    <Zap size={10} fill="currentColor" />
                    {provider.name}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-zinc-700 font-bold text-[9px] uppercase tracking-widest"
                  >
                    <Info size={10} />
                    Enter Safaricom (07) or Ethio (09)
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Fill */}
      <button 
        onClick={handleQuickFill}
        className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800/60 hover:border-zinc-700 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-400 rounded-xl">
            <Zap size={18} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-black text-white uppercase italic tracking-tight">Quick Fill</span>
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Use Telegram SIM Number</span>
          </div>
        </div>
        <Phone size={14} className="text-zinc-700 group-hover:text-orange-400 transition-colors" />
      </button>

      {/* CTA */}
      <button 
        disabled={isInvalid}
        onClick={() => onComplete(phoneNumber)}
        className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98] ${
          isInvalid 
            ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800' 
            : 'bg-orange-500 text-black shadow-xl shadow-orange-500/20'
        }`}
      >
        Continue to Dashboard
      </button>
    </div>
  );
}
