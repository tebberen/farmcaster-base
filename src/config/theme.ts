export interface Theme {
    id: string;
    name: string;
    pageBg: string;
    cardBg: string;
    accent: string;
    text: string;
    strongText: string;
    border: string;
    ring?: string;
    activeBox: string;
    bg?: string;
    glow?: string;
    primary?: string;
    bgGradient?: string;
  }

  export const THEMES: Record<string, Theme> = {
    base: {
      id: 'base',
      name: 'Base',
      pageBg: "bg-[#0F172A]", // Slate 900
      cardBg: "bg-[#1E293B]", // Slate 800
      accent: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 text-white shadow-blue-500/50 shadow-lg",
      text: "text-slate-200",
      strongText: "text-cyan-400",
      border: "border-blue-500/50",
      activeBox: "bg-blue-900/50 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      bg: "bg-blue-900/20",
      primary: "bg-blue-500",
      glow: "shadow-blue-500/20",
      bgGradient: "from-blue-500/20"
    },
    bsc: {
      id: 'bsc',
      name: 'BSC',
      pageBg: "bg-[#1C1917]", // Stone 900
      cardBg: "bg-[#292524]",
      accent: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:scale-105 text-black font-bold shadow-yellow-500/50 shadow-lg",
      text: "text-stone-200",
      strongText: "text-yellow-400",
      border: "border-yellow-500/50",
      activeBox: "bg-yellow-900/50 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]",
      bg: "bg-yellow-900/20",
      primary: "bg-yellow-500",
      glow: "shadow-yellow-500/20",
      bgGradient: "from-yellow-500/20"
    },
    celo: {
      id: 'celo',
      name: 'Celo',
      pageBg: "bg-[#022C22]", // Deep Forest Green
      cardBg: "bg-[#064E3B]",
      accent: "bg-gradient-to-r from-lime-400 to-green-500 hover:scale-105 text-black font-bold shadow-lime-500/50 shadow-lg",
      text: "text-lime-50",
      strongText: "text-lime-300",
      border: "border-lime-500/50",
      activeBox: "bg-lime-900/50 border-lime-400 shadow-[0_0_15px_rgba(132,204,22,0.5)]",
      bg: "bg-lime-900/20",
      primary: "bg-green-500",
      glow: "shadow-green-500/20",
      bgGradient: "from-green-500/20"
    },
    monad: {
      id: 'monad',
      name: 'Monad',
      pageBg: "bg-[#1E1B4B]", // Deep Indigo
      cardBg: "bg-[#312E81]",
      accent: "bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:scale-105 text-white shadow-violet-500/50 shadow-lg",
      text: "text-violet-100",
      strongText: "text-fuchsia-400",
      border: "border-violet-500/50",
      activeBox: "bg-violet-900/50 border-fuchsia-400 shadow-[0_0_15px_rgba(167,139,250,0.5)]",
      bg: "bg-violet-900/20",
      primary: "bg-purple-500",
      glow: "shadow-purple-500/20",
      bgGradient: "from-purple-500/20"
    },
    hyper: {
      id: 'hyper',
      name: 'Hyper',
      pageBg: "bg-[#4C0519]", // Deep Rose
      cardBg: "bg-[#881337]",
      accent: "bg-gradient-to-r from-pink-500 to-rose-400 hover:scale-105 text-white shadow-pink-500/50 shadow-lg",
      text: "text-pink-100",
      strongText: "text-pink-300",
      border: "border-pink-500/50",
      activeBox: "bg-pink-900/50 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]",
      bg: "bg-pink-900/20",
      primary: "bg-pink-500",
      glow: "shadow-pink-500/20",
      bgGradient: "from-pink-500/20"
    },
    arb: {
      id: 'arb',
      name: 'Arbitrum',
      pageBg: "bg-[#083344]",
      cardBg: "bg-[#164E63]",
      accent: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 text-white shadow-cyan-500/50 shadow-lg",
      text: "text-cyan-50",
      strongText: "text-cyan-300",
      border: "border-cyan-500/50",
      activeBox: "bg-cyan-900/50 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]",
      bg: "bg-cyan-900/20",
      primary: "bg-cyan-600",
      glow: "shadow-cyan-600/20",
      bgGradient: "from-cyan-600/20"
    },
    eth: {
      id: 'eth',
      name: 'Ethereum',
      pageBg: "bg-[#0A0A0A]",
      cardBg: "bg-[#171717]",
      accent: "bg-gradient-to-r from-slate-600 to-slate-400 hover:scale-105 text-white shadow-white/10 shadow-lg",
      text: "text-gray-300",
      strongText: "text-white",
      border: "border-gray-700",
      activeBox: "bg-gray-800 border-gray-500",
      bg: "bg-gray-800",
      primary: "bg-slate-500",
      glow: "shadow-slate-500/20",
      bgGradient: "from-slate-500/20"
    }
  };

  export const CHAIN_IDS: Record<string, number> = {
    base: 8453, bsc: 56, celo: 42220, arb: 42161, eth: 1, monad: 143, hyper: 999
  };
