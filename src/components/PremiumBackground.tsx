'use client';

import { motion } from "framer-motion";

export function PremiumBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#0a0a0a] overflow-hidden">
      {/* Primary Radial Glow — Nike Orange */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-orange-500/8 rounded-full blur-[130px]" />
      
      {/* Secondary Accent — Deep Ember */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-700/8 rounded-full blur-[110px]" />
      
      {/* Animated Floating Orbs */}
      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-[20%] right-[15%] w-32 h-32 bg-orange-400/5 rounded-full blur-[40px]"
      />

      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-[25%] left-[10%] w-48 h-48 bg-red-600/4 rounded-full blur-[50px]"
      />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
