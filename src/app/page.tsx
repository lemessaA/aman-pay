'use client';

import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/components/AuthProvider";
import { Onboarding } from "@/components/Onboarding";
import { PremiumBackground } from "@/components/PremiumBackground";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Wallet, 
  Package, 
  Truck, 
  QrCode, 
  ArrowRightLeft, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowUpRight,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user: telegramUser, isLoading } = useAuth();

  // null = not yet read from localStorage (hydrating)
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [storedName, setStoredName] = useState<string | null>(null);

  const user = storedName ? { ...telegramUser, first_name: storedName } : telegramUser;

  useEffect(() => {
    const onboarded = localStorage.getItem("lega_onboarded") === "true";
    const authed = localStorage.getItem("lega_authed") === "true";
    const name = localStorage.getItem("lega_first_name");

    setIsOnboarded(onboarded);
    setIsAuthed(authed);
    if (name) setStoredName(name);

    if (!onboarded) {
      // will render Onboarding below
    } else if (!authed) {
      router.replace("/auth");
    }
  }, [router]);

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    localStorage.setItem("lega_onboarded", "true");
  };

  const transactions = [
    {
      id: "TRX-9421",
      item: "Nike Air Jordan 1",
      status: "Locked",
      price: "4,500 ETB",
      icon: Package,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      step: "Awaiting Driver Handoff",
      progress: "66%",
      time: "2h ago"
    },
    {
      id: "TRX-8302",
      item: "Samsung S24 Ultra",
      status: "Verifying",
      price: "120,000 ETB",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      step: "AI Verification",
      progress: "33%",
      time: "5h ago"
    },
  ];

  // Still reading localStorage — show nothing to avoid flash
  if (isOnboarded === null) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="text-2xl font-black italic tracking-tighter text-white"
        >
          LEGA-AI
        </motion.div>
      </div>
    );
  }

  // New visitor — show onboarding
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Onboarded but not authed — redirect fires in useEffect, show blank
  if (!isAuthed || isLoading) {
    return <div className="min-h-dvh bg-black" />;
  }

  return (
    <>
      <PremiumBackground />

      <AppLayout>
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black uppercase italic tracking-tighter text-white sm:text-5xl lg:text-6xl"
              >
                Welcome, {user?.first_name?.toUpperCase() || "TRADER"}
              </motion.h1>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-orange-500" /> Account: Level 2 Verified</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> Last Login: 5m ago</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Total Volume</span>
                <span className="text-lg font-black text-white italic tracking-tighter">1.2M ETB</span>
              </div>
              <div className="h-10 w-[1px] bg-zinc-900" />
              <div className="flex flex-col items-end text-emerald-500">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Status</span>
                <span className="text-lg font-black italic tracking-tighter">Active</span>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            
            {/* Left Column: Vault + Quick Actions (7 Cols) */}
            <div className="flex flex-col gap-8 xl:col-span-8">
              
              {/* Vault Card */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-gradient-to-br from-zinc-900/40 to-black p-8 shadow-2xl transition-all hover:border-orange-500/20 md:p-12"
              >
                <div className="absolute -top-24 -right-24 h-64 w-64 bg-orange-500/10 blur-[100px] pointer-events-none group-hover:bg-orange-500/20 transition-all duration-700" />
                <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-all">
                  <Wallet size={300} strokeWidth={1} />
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-2">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Escrow Locked</span>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500">
                        {i}
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full border-2 border-zinc-950 bg-orange-500 flex items-center justify-center text-[10px] font-black text-black">
                      +12
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mb-12">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Total Vault Balance</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black italic tracking-tighter text-white sm:text-7xl lg:text-8xl">
                      2,450
                    </span>
                    <span className="text-xl font-black italic text-zinc-600">.00 ETB</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-emerald-500">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">+12.5% from last week</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <Link
                    href="/seller/list"
                    className="flex flex-col gap-4 rounded-3xl bg-white p-6 transition-all hover:bg-orange-50 active:scale-[0.97]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                      <Package size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase italic tracking-tight text-black">List New Item</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Fast Escrow Creation</span>
                    </div>
                  </Link>
                  <Link
                    href="/driver"
                    className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 active:scale-[0.97]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-500/20">
                      <QrCode size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase italic tracking-tight text-white">Release Funds</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Scan Driver OTP</span>
                    </div>
                  </Link>
                   <button
                    className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 active:scale-[0.97] opacity-60 grayscale cursor-not-allowed"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                      <ArrowUpRight size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase italic tracking-tight text-white">Withdraw</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">M-PESA Payout</span>
                    </div>
                  </button>
                </div>
              </motion.section>

              {/* Advanced Stats Section */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  { label: "Successful Handoffs", val: "142", icon: Truck, color: "text-blue-400" },
                  { label: "Trader Trust Score", val: "99.2", icon: ShieldCheck, color: "text-emerald-400" },
                  { label: "Network Peers", val: "1.4k", icon: Users, color: "text-indigo-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-[32px] border border-white/5 bg-white/5 p-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black italic text-white">{stat.val}</span>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Feed + Sidebar (4 Cols) */}
            <div className="flex flex-col gap-8 xl:col-span-4">
              
              {/* Active Shipments Feed */}
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    Active Shipments
                  </h2>
                  <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:underline">
                    Expand Feed
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {transactions.map((tx, idx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="group relative flex flex-col gap-4 rounded-[32px] border border-white/5 bg-zinc-950/50 p-6 transition-all hover:border-white/10 hover:bg-zinc-900/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 ${tx.color}`}>
                            <tx.icon size={22} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-orange-400 transition-colors">
                              {tx.item}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{tx.id}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-800" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{tx.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-white">{tx.price}</span>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${tx.color}`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-zinc-900">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: tx.progress }}
                            className={`h-full ${tx.color.replace("text", "bg")}`}
                          />
                        </div>
                        <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-zinc-600">
                          {tx.step}
                        </span>
                      </div>
                      
                      <button className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Help / Ad Card */}
              <div className="mt-auto relative overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Lega Protection</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-zinc-500">
                    Every transaction is protected by our AI Watchdog engine. If the driver doesn't hand off, your funds are returned instantly.
                  </p>
                  <button className="mt-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
                    Learn about AI Watchdog →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
