'use client';

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full" />
        <div className="relative p-8 rounded-full bg-zinc-950 border border-zinc-800 shadow-2xl">
          <ShieldCheck size={80} className="text-orange-500" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-2"
      >
        <h1 className="text-4xl font-black italic tracking-tighter text-white">
          LEGA-AI
        </h1>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em]">
          Secure Social Commerce
        </p>
      </motion.div>

      <div className="absolute bottom-20 left-8 right-8">
        <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-orange-500 shadow-[0_0_12px_#f97316]"
          />
        </div>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-3 text-center">
          Initializing Escrow Vault...
        </p>
      </div>
    </motion.div>
  );
}
