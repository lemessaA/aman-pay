"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, QrCode, ShieldCheck, Wallet, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { clsx } from "clsx";

interface AppLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Vault", icon: Wallet, href: "/", exact: true },
  { label: "Orders", icon: Package, href: "/seller/list", exact: false },
  { label: "Driver", icon: QrCode, href: "/driver", exact: false },
  { label: "History", icon: CheckCircle2, href: "/history", exact: false },
  { label: "Security", icon: ShieldCheck, href: "/security", exact: false },
];

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-dvh bg-[#030303] text-zinc-100 selection:bg-orange-500/30 selection:text-white">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:w-72 xl:w-80 shrink-0 flex-col fixed inset-y-0 left-0 z-40 border-r border-zinc-900/40 bg-[#050505]/60 backdrop-blur-3xl">
        <div className="flex flex-col gap-1 px-8 py-10">
          <Link href="/" className="group flex flex-col">
            <span className="text-3xl font-black italic tracking-tighter text-white transition-all group-hover:text-orange-500">
              LEGA-AI
            </span>
            <div className="flex items-center gap-2">
              <span className="h-[1px] w-6 bg-orange-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Ethio-Vault
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1 px-4 py-4" aria-label="Sidebar">
          {NAV_ITEMS.map(({ label, icon: Icon, href, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-[12px] font-bold uppercase tracking-widest transition-all duration-300",
                  active
                    ? "bg-gradient-to-r from-orange-500/10 to-transparent text-orange-400"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/40"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-orange-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className={clsx("transition-transform group-hover:scale-110", active ? "text-orange-500" : "text-zinc-700 group-hover:text-zinc-400")} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="group flex items-center gap-4 rounded-[24px] bg-zinc-950/50 border border-zinc-900/50 p-4 transition-all hover:border-zinc-800 hover:bg-zinc-900/30">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-black text-white italic">
                {user?.first_name?.charAt(0) || "T"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black uppercase tracking-widest text-white truncate">
                {user?.first_name || "Guest User"}
              </span>
              <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest group-hover:text-orange-500/50 transition-colors">
                {user?.username ? `@${user.username}` : "Standard Web"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Canvas ── */}
      <div className="flex flex-1 flex-col lg:ml-72 xl:ml-80">
        {/* Responsive Header (Mobile/Tablet) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-900/40 bg-[#050505]/80 px-6 py-4 backdrop-blur-2xl lg:hidden">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-2xl font-black italic tracking-tighter text-white">LEGA-AI</span>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-600">Smart-Vault</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-950/50 px-3 py-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="max-w-[80px] truncate text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                {user?.first_name || "Guest"}
              </span>
            </div>
          </div>
        </header>

        {/* Global Action Bar (Optional - for high end feel) */}
        <div className="hidden lg:flex items-center justify-between px-10 py-6 border-b border-zinc-900/20">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
              Vault Active
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
              Chain: Ethio-Mainnet
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="h-10 px-6 rounded-full border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">Support</button>
            <button className="h-10 px-6 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-white/5 active:scale-95 transition-all">Deposit</button>
          </div>
        </div>

        <main className="flex-1 px-6 py-8 pb-32 sm:px-10 sm:py-10 lg:px-12 lg:py-12 lg:pb-12">
          {children}
        </main>

        {/* Mobile Navigation (Floating Pill Style for Web App) */}
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="pointer-events-auto flex items-center justify-around gap-2 rounded-[32px] border border-white/10 bg-black/80 px-4 py-3 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            {NAV_ITEMS.map(({ label, icon: Icon, href, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "relative flex h-12 w-16 flex-col items-center justify-center rounded-2xl transition-all",
                    active ? "text-orange-500" : "text-zinc-600 hover:text-white"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="mobile-active-bg"
                      className="absolute inset-0 bg-white/5 rounded-2xl -z-10"
                    />
                  )}
                  <Icon size={20} />
                  <span className="mt-1 text-[7px] font-black uppercase tracking-widest">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

// Ensure motion is imported
import { motion } from "framer-motion";
