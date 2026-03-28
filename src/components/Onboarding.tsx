'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

type LangKey = "en" | "am" | "or" | "ti";

// ── Translations ─────────────────────────────────────────────────────────────
const i18n: Record<LangKey, {
  brand: string;
  tagline: string;
  slides: { title: string; description: string; feature: string }[];
  next: string;
  skip: string;
  getStarted: string;
  back: string;
  step: string;
  of: string;
}> = {
  en: {
    brand: "LEGA-AI",
    tagline: "Escrow Smart-Vault",
    slides: [
      {
        title: "SECURE\nESCROW",
        description:
          "Your M-PESA is locked in our AI-powered vault until you personally confirm receipt of your goods. No chargebacks. No disputes.",
        feature: "Secure Escrow",
      },
      {
        title: "AI\nVERIFICATION",
        description:
          "Our AI auditor scans Lega receipts and inspects item quality before funds move. Scammers don't get a second chance.",
        feature: "AI Verification",
      },
      {
        title: "ONE-CLICK\nTRADE",
        description:
          "Trusted by traders across Dire Dawa, Harar, and Addis Ababa. List, verify, and close deals in minutes.",
        feature: "One-Click Trade",
      },
    ],
    next: "NEXT",
    skip: "Skip",
    getStarted: "GET STARTED",
    back: "Back",
    step: "Step",
    of: "of",
  },

  am: {
    brand: "ሌጋ-AI",
    tagline: "ኤስክሮ ስማርት-ቫልት",
    slides: [
      {
        title: "ደህንነቱ\nየተጠበቀ ኤስክሮ",
        description:
          "ሸቀጦቹ መደረሳቸውን እስኪያረጋግጡ ድረስ ኤምፔሳዎ በ AI ቫልታችን ውስጥ ተቆልፏል። ምንም ሙግት፣ ምንም ክርክር የለም።",
        feature: "ደህንነቱ የተጠበቀ ኤስክሮ",
      },
      {
        title: "AI\nማረጋገጫ",
        description:
          "AI ኦዲተራችን ሌጋ ደረሰኞችን ይቃኛል። ሸቀጦቹ ጥራት ያላቸው ስለሆኑ ያረጋግጣል። ተቀናቃኞች ሁለተኛ ዕድል አያገኙም።",
        feature: "AI ማረጋገጫ",
      },
      {
        title: "በአንድ ጠቅታ\nንግድ",
        description:
          "በድሬዳዋ፣ ሀረርና አዲስ አበባ ነጋዴዎች ዘንድ ታዋቂ። ዝርዝር ያስቀምጡ፣ ያረጋግጡ፣ ሰዓታት ውስጥ ንግዱን ይዝጉ።",
        feature: "አንድ ጠቅታ ንግድ",
      },
    ],
    next: "ቀጣይ",
    skip: "ዝለል",
    getStarted: "ጀምር",
    back: "ተመለስ",
    step: "ደረጃ",
    of: "ከ",
  },

  or: {
    brand: "LEGA-AI",
    tagline: "Vault Eeskiroow Smaart",
    slides: [
      {
        title: "EESKIROOW\nNAGAHAA",
        description:
          "Maallaqqin kee M-PESA Vault AI keenyaa keessatti goolaa mirkaneessitutti qabama. Mormiis, walitti bu'iinsis hin jiru.",
        feature: "Eeskiroow Nagahaa",
      },
      {
        title: "AI\nMIRKANEESSA",
        description:
          "AI keenya billetii Lega sakatta'a, qulqullina meeshaalee mirkaneessa. Gowwoomsitooti carraa lammaffaa hin argatani.",
        feature: "Mirkaneessa AI",
      },
      {
        title: "DALDALAA\nCLICK TOKKOON",
        description:
          "Daldaltoota Dirre Dawaa, Harar fi Finfinnee biratti beekama. Tarreessi, mirkaneessi, daqiiqaadhaan gurguraa cufii.",
        feature: "Daldalaa Click Tokkoon",
      },
    ],
    next: "ITA AANAA",
    skip: "Irra Daarbii",
    getStarted: "JALQABI",
    back: "Duubatti",
    step: "Tarree",
    of: "kan",
  },

  ti: {
    brand: "LEGA-AI",
    tagline: "ኤስክሮ ስማርት-ቫልት",
    slides: [
      {
        title: "ውሑስ\nኤስክሮ",
        description:
          "M-PESA ናትካ ኣብ ቫልት AI ናትና ዝቆለፈ ኣሎ ክሳዕ ዕቃኻ ምርካብካ ምርግጋጽ ትገብር። ምንም ዛዕባ የሎን።",
        feature: "ውሑስ ኤስክሮ",
      },
      {
        title: "AI\nምርግጋጽ",
        description:
          "Auditor AI ናትና ደረሰኛታት Lega ይምርምር፣ ጒሌታቶ ዕድል ካልኣይ ኣይወሃቦምን። ዕቃ ጥራዩ ዝተረጋገጸ ጥራሕ ክሓልፍ ይፍቀድ።",
        feature: "AI ምርግጋጽ",
      },
      {
        title: "ብሓደ ጠዊቕ\nንግዲ",
        description:
          "ኣብ ድሬዳዋ፣ ሓረርን ኣዲስ ኣበባን ዝፍለጥ ንግዲ። ዝርዝር ኣቕርቡ፣ ኣረጋግጹ፣ ብደቓይቕ ዕዳጋ ዕጸፉ።",
        feature: "ብሓደ ጠዊቕ ንግዲ",
      },
    ],
    next: "ቀጺሉ",
    skip: "ዝለል",
    getStarted: "ጀምር",
    back: "ተመለስ",
    step: "ስጉምቲ",
    of: "ካብ",
  },
};

const LANGUAGES: { key: LangKey; label: string }[] = [
  { key: "en", label: "ENGLISH" },
  { key: "am", label: "አማርኛ" },
  { key: "or", label: "AFAAN OROMOO" },
  { key: "ti", label: "ትግርኛ" },
];

const SLIDE_STYLES = [
  { accent: "text-orange-400", border: "border-orange-500/30", iconBg: "bg-orange-500", bg: "/onboarding/vault.png", icon: ShieldCheck },
  { accent: "text-amber-400",  border: "border-amber-500/30",  iconBg: "bg-amber-500",  bg: "/onboarding/receipt.png",  icon: Search },
  { accent: "text-emerald-400",border: "border-emerald-500/30",iconBg: "bg-emerald-500",bg: "/onboarding/merchant.png", icon: MapPin },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [lang, setLang] = useState<LangKey>("en");

  const t = i18n[lang];
  const slide = t.slides[current];
  const style = SLIDE_STYLES[current];
  const Icon = style.icon;
  const isLast = current === t.slides.length - 1;

  const goNext = () => {
    if (!isLast) {
      setCurrent(c => c + 1);
    } else {
      onComplete();
      router.push("/auth");
    }
  };
  const goPrev = () => { if (current > 0) setCurrent(c => c - 1); };

  return (
    <div className="fixed inset-0 z-[110] flex bg-black">

      {/* ── Left panel: photo (desktop only) ── */}
      <div className="relative hidden w-1/2 overflow-hidden md:flex xl:w-[55%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${style.bg})` }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

        {/* Brand */}
        <div className="absolute left-8 top-8 flex flex-col gap-0.5">
          <span className="text-2xl font-black italic tracking-tighter text-white drop-shadow-lg">
            {t.brand}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
            {t.tagline}
          </span>
        </div>

        {/* Vertical slide dots */}
        <div className="absolute bottom-8 left-8 flex flex-col gap-2">
          {t.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === current ? "w-10 bg-orange-500" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Feature badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${current}-${lang}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-8 right-8"
          >
            <div className={`flex items-center gap-3 rounded-2xl border ${style.border} bg-black/60 px-4 py-3 backdrop-blur-lg`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.iconBg} text-black`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${style.accent}`}>
                  {`${t.step} 0${current + 1}`}
                </span>
                <span className="max-w-[140px] text-[11px] font-black text-white leading-tight">
                  {slide.feature}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Right panel: content ── */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:w-1/2 xl:w-[45%]">

        {/* Mobile background */}
        <div className="absolute inset-0 md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-bg-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${style.bg})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/95" />
        </div>

        {/* Desktop dark panel */}
        <div className="absolute inset-0 hidden bg-[#0a0a0a] md:block" />

        {/* Content */}
        <div className="relative flex h-full flex-col px-6 pb-10 pt-8 sm:px-10 md:px-12 md:py-10 lg:px-16">

          {/* Language + counter row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {LANGUAGES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setLang(key)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[9px] font-black transition-all ${
                    lang === key
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-black/20 text-white/50 backdrop-blur-md hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="hidden shrink-0 items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 md:flex">
              <Zap size={11} className="text-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                {current + 1}/{t.slides.length}
              </span>
            </div>
          </div>

          {/* Mobile brand */}
          <div className="mt-5 md:hidden">
            <AnimatePresence mode="wait">
              <motion.div key={`mob-brand-${lang}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-500">{t.brand}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{t.tagline}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop step indicator */}
          <div className="mt-10 hidden md:block">
            <AnimatePresence mode="wait">
              <motion.span
                key={`step-${current}-${lang}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`text-[9px] font-black uppercase tracking-[0.3em] ${style.accent}`}
              >
                {t.step} 0{current + 1} {t.of} 0{t.slides.length}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Slide content */}
          <div className="mt-auto flex flex-col gap-8 md:mt-16 md:gap-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-${current}-${lang}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-5"
              >
                {/* Icon — mobile only */}
                <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${style.iconBg} text-black shadow-xl md:hidden`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>

                {/* Step counter — mobile */}
                <p className={`text-[9px] font-black uppercase tracking-[0.35em] ${style.accent} md:hidden`}>
                  0{current + 1} / 0{t.slides.length}
                </p>

                {/* Title */}
                <h2 className="whitespace-pre-line text-[2.2rem] font-black uppercase italic leading-none tracking-tighter text-white sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  {slide.title}
                </h2>

                {/* Description */}
                <p className="max-w-sm text-sm font-medium leading-relaxed text-white/60 md:text-[0.92rem] md:text-white/55">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex flex-col gap-5">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {t.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      i === current ? "w-10 bg-orange-500" : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3">
                {current > 0 && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={goPrev}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/20 hover:text-white"
                  >
                    <ChevronLeft size={22} />
                  </motion.button>
                )}

                <button
                  onClick={goNext}
                  className="group relative flex h-14 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-orange-500 font-black uppercase tracking-widest text-black shadow-xl shadow-orange-500/20 transition-all hover:shadow-orange-500/35 active:scale-[0.97]"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                  <span className="relative text-[11px] sm:text-xs">
                    {isLast ? t.getStarted : t.next}
                  </span>
                  {isLast
                    ? <ArrowRight size={16} className="relative" strokeWidth={2.5} />
                    : <ChevronRight size={16} className="relative" strokeWidth={2.5} />
                  }
                </button>
              </div>

              {!isLast && (
                <button
                  onClick={goNext}
                  className="self-start text-[9px] font-black uppercase tracking-widest text-white/25 transition-colors hover:text-white/50"
                >
                  {t.skip} →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
