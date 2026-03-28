'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { PremiumBackground } from "@/components/PremiumBackground";

type Tab = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "signup") {
      if (!firstName.trim()) { setError("Name is required."); return; }
      if (!phone.trim() && !email.trim()) { setError("Phone or email is required."); return; }
    } else {
      if (!phone.trim() && !email.trim()) { setError("Phone or email is required."); return; }
    }
    if (!password.trim() || password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    // Simulated auth — replace with Supabase Auth call when backend is wired
    await new Promise(r => setTimeout(r, 900));

    localStorage.setItem("lega_authed", "true");
    if (tab === "signup" && firstName) {
      localStorage.setItem("lega_first_name", firstName);
    }

    router.push("/");
  };

  return (
    <>
      <PremiumBackground />

      <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col items-center gap-2"
        >
          <div className="flex items-center justify-center rounded-[28px] border border-orange-500/20 bg-orange-500/10 p-4">
            <ShieldCheck size={40} className="text-orange-500" />
          </div>
          <div className="mt-2 flex flex-col items-center">
            <span className="text-3xl font-black italic tracking-tighter text-white">LEGA-AI</span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Escrow Smart-Vault
            </span>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md overflow-hidden rounded-[40px] border border-white/5 bg-zinc-950/80 shadow-2xl backdrop-blur-xl"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {(["signup", "login"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  tab === t
                    ? "text-white border-b-2 border-orange-500 -mb-px"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {t === "signup" ? "Create Account" : "Sign In"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
            <AnimatePresence mode="wait">
              {tab === "signup" && (
                <motion.div
                  key="signup-name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 pb-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="e.g. Biruk Alemu"
                      autoComplete="name"
                      className="w-full rounded-2xl border border-zinc-900 bg-black px-5 py-4 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-700 focus:border-orange-500/50"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phone or Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Phone or Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  {phone.startsWith("0") || phone.startsWith("+") ? (
                    <Phone size={15} className="text-zinc-600" />
                  ) : (
                    <Mail size={15} className="text-zinc-600" />
                  )}
                </div>
                <input
                  type="text"
                  value={phone || email}
                  onChange={e => {
                    const v = e.target.value;
                    if (v.startsWith("0") || v.startsWith("+") || /^\d/.test(v)) {
                      setPhone(v); setEmail("");
                    } else {
                      setEmail(v); setPhone("");
                    }
                  }}
                  placeholder="07XX XXX XXX or email@..."
                  autoComplete="username"
                  className="w-full rounded-2xl border border-zinc-900 bg-black py-4 pl-11 pr-5 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-700 focus:border-orange-500/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  <Lock size={15} className="text-zinc-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  className="w-full rounded-2xl border border-zinc-900 bg-black py-4 pl-11 pr-14 text-sm font-bold text-white outline-none transition-all placeholder:text-zinc-700 focus:border-orange-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute inset-y-0 right-4 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-black uppercase tracking-widest text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-orange-500 font-black uppercase tracking-widest text-black shadow-xl shadow-orange-500/20 transition-all hover:shadow-orange-500/30 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-black border-t-transparent"
                />
              ) : (
                <>
                  <Zap size={17} />
                  <span className="relative text-sm">
                    {tab === "signup" ? "Create Account" : "Sign In"}
                  </span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            {/* Switch tab link */}
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
              {tab === "signup" ? "Already have an account?" : "New to Lega-AI?"}{" "}
              <button
                type="button"
                onClick={() => { setTab(tab === "signup" ? "login" : "signup"); setError(""); }}
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                {tab === "signup" ? "Sign In" : "Create Account"}
              </button>
            </p>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700"
        >
          Secured by AI · M-PESA Escrow · Ethiopia
        </motion.p>
      </div>
    </>
  );
}
