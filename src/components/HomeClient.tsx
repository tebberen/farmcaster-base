"use client";

import React, { useState, useEffect, useRef } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { useAccount, useReadContract, useWriteContract, useSwitchChain, useConnect, useDisconnect } from "wagmi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GARDEN_CONTRACTS, GARDEN_ABI } from "../config/contracts";
import { SEED_DATA, getEmojiById } from "../config/emojis";
import { OnboardingModal } from "./OnboardingModal";
import { LeaderboardModal } from "./LeaderboardModal";
import SuccessModal from "./SuccessModal";
import { FavoriteReminder } from "./FavoriteReminder";
import { THEMES, CHAIN_IDS } from "../config/theme";
import { BaseWallet } from "./BaseWallet";

// --- 1. ROBUST THEME MAP (Global Visuals) ---
const themeMap: Record<string, { primary: string; glow: string; border: string; text: string; bgGradient: string }> = {
  Base: {
    primary: "bg-blue-500",
    glow: "shadow-blue-500/20",
    border: "border-blue-500",
    text: "text-blue-400",
    bgGradient: "from-blue-500/20"
  },
  BSC: {
    primary: "bg-yellow-500",
    glow: "shadow-yellow-500/20",
    border: "border-yellow-500",
    text: "text-yellow-400",
    bgGradient: "from-yellow-500/20"
  },
  Celo: {
    primary: "bg-green-500",
    glow: "shadow-green-500/20",
    border: "border-green-500",
    text: "text-green-400",
    bgGradient: "from-green-500/20"
  },
  Monad: {
    primary: "bg-purple-500",
    glow: "shadow-purple-500/20",
    border: "border-purple-500",
    text: "text-purple-400",
    bgGradient: "from-purple-500/20"
  },
  Hyper: {
    primary: "bg-pink-500",
    glow: "shadow-pink-500/20",
    border: "border-pink-500",
    text: "text-pink-400",
    bgGradient: "from-pink-500/20"
  },
  Arbitrum: {
    primary: "bg-cyan-600",
    glow: "shadow-cyan-600/20",
    border: "border-cyan-600",
    text: "text-cyan-400",
    bgGradient: "from-cyan-600/20"
  },
  Ethereum: {
    primary: "bg-slate-500",
    glow: "shadow-slate-500/20",
    border: "border-slate-500",
    text: "text-slate-400",
    bgGradient: "from-slate-500/20"
  },
};

const defaultThemeVisuals = themeMap['Base'];

// Keep gradient definitions for the tabs if desired, or map them too.
// Using existing chainColors for tabs to maintain gradient fidelity, or could be replaced by themeMap
const chainColors: Record<string, string> = {
  Base: "from-blue-500 to-blue-600 shadow-blue-500/50",
  BSC: "from-yellow-400 to-yellow-500 shadow-yellow-500/50",
  Celo: "from-green-400 to-yellow-300 shadow-green-400/50",
  Monad: "from-purple-500 to-indigo-500 shadow-purple-500/50",
  Hyper: "from-cyan-400 to-pink-500 shadow-cyan-400/50",
  Arbitrum: "from-blue-600 to-cyan-600 shadow-blue-600/50",
  Ethereum: "from-slate-500 to-slate-700 shadow-slate-500/50",
};
const defaultColor = "from-gray-700 to-gray-800";

export default function HomeClient() {
  const { address, chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { connect, connectors } = useConnect();

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'gm' | 'deploy' | 'launch' | 'donate'>('gm');
  const [viewDate, setViewDate] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFavoriteReminder, setShowFavoriteReminder] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [successData, setSuccessData] = useState<{ seedId: number, xp: number, hash: string } | null>(null);
  const [farcasterUser, setFarcasterUser] = useState<any>(null);

  const marketRef = useRef<HTMLElement>(null);

  // Derive Current Theme (Config + Visuals)
  const currentTheme = React.useMemo(() => {
    let themeConfig = THEMES.base;
    if (chain) {
      const themeId = Object.keys(CHAIN_IDS).find((k) => CHAIN_IDS[k] === chain.id);
      if (themeId && THEMES[themeId]) {
        themeConfig = THEMES[themeId];
      }
    }
    const visuals = themeMap[themeConfig.name] || defaultThemeVisuals;
    return { ...themeConfig, ...visuals };
  }, [chain]);

  // 1. Mount Logic
  useEffect(() => {
    setIsMounted(true);
    const hasSeen = localStorage.getItem('farmcaster_onboarding_v1');
    if (!hasSeen) setShowOnboarding(true);
  }, []);

  // 2. SDK Initialization & Auto-Connect
  useEffect(() => {
    const init = async () => {
      sdk.actions.ready();
      try {
        const context = await sdk.context;
        if (context?.user) {
          setFarcasterUser(context.user);
        }
        if (!isConnected && context?.client) {
          const connector = connectors.find((c) => c.id === 'farcaster');
          if (connector) {
            connect({ connector });
          }
        }
      } catch (error) {
        console.error("SDK Error:", error);
      }
    };
    init();
  }, [isConnected, connectors, connect]);

  const handleCloseOnboarding = () => {
      setShowOnboarding(false);
      localStorage.setItem('farmcaster_onboarding_v1', 'true');
  };

  // --- DATA FETCHING (V4) ---
  const gardenAddress = GARDEN_CONTRACTS[currentTheme.id] || GARDEN_CONTRACTS.base;
  const { data: historyData } = useReadContract({
    address: gardenAddress,
    abi: GARDEN_ABI,
    functionName: 'getUserHistory',
    args: [address!],
    query: { enabled: !!address }
  });

  const historyMap = React.useMemo(() => {
    if (!historyData) return {};
    const map: Record<string, number> = {};
    (historyData as any[]).forEach((item: any) => {
       const d = new Date(Number(item.timestamp) * 1000);
       const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
       const sid = Number(item.seedType);
       if (map[key] === undefined || sid > map[key]) map[key] = sid;
    });
    return Object.fromEntries(Object.entries(map).map(([k,v]) => [k, getEmojiById(v)?.icon || '']));
  }, [historyData]);

  // Derived empty state:
  // 1. Not connected (treat as empty/new user) -> Show CTA
  // 2. Connected AND History loaded AND History empty -> Show CTA
  // 3. Connected AND History loading -> Don't show (wait)
  const isEmpty = React.useMemo(() => {
     if (!isConnected) return true;
     if (!historyData) return false; // Loading
     return (historyData as any[]).length === 0;
  }, [isConnected, historyData]);

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    return { days, startDay, monthName: date.toLocaleString('default', { month: 'long' }), year };
  };

  const { days, startDay, monthName, year } = getDaysInMonth(viewDate);

  const handleConnect = () => {
    if (farcasterUser) {
        const fc = connectors.find(c => c.id === 'farcaster');
        if (fc) {
            connect({ connector: fc });
            return;
        }
    }
    const other = connectors.find(c => c.id !== 'farcaster');
    if (other) connect({ connector: other });
  };

  const handlePlant = async (id: number) => {
    if (!isConnected) {
      handleConnect();
      return;
    }
    const targetChainId = CHAIN_IDS[currentTheme.id];
    if (chain && chain.id !== targetChainId) {
        try {
            switchChain({ chainId: targetChainId });
        } catch (e) {
            console.error("Switch chain failed", e);
        }
        return;
    }

    let func: 'gm' | 'deploy' | 'launch' | 'donate' = 'gm';
    let val = 0n;
    if (id >= 10 && id < 20) { func = 'deploy'; val = 30000000000000n; }
    else if (id >= 20 && id < 30) { func = 'launch'; val = 45000000000000n; }
    else if (id >= 30) { func = 'donate'; val = 60000000000000n; }

    let xp = 1;
    if (id >= 10 && id < 20) xp = 2;
    else if (id >= 20 && id < 30) xp = 3;
    else if (id >= 30) xp = 5;

    try {
      let hash;
      if (func === 'gm') {
        hash = await writeContractAsync({
          address: gardenAddress,
          abi: GARDEN_ABI,
          functionName: 'gm',
          args: [id]
        });
      } else {
        hash = await writeContractAsync({
          address: gardenAddress,
          abi: GARDEN_ABI,
          functionName: func,
          args: [id],
          value: val
        });
      }
      setSuccessData({ seedId: id, xp, hash: hash || '' });
    } catch (e) {
      console.error("Planting failed:", e);
    }
  };

  const profileImage = farcasterUser?.pfpUrl ?? "/images/icon.png";
  const profileHandle = farcasterUser?.username ? `@${farcasterUser.username}` : (address ? `${address.slice(0, 6)}...` : "Connect");

  if (!isMounted) return null;

  return (
    <main className={`relative min-h-screen transition-colors duration-500 pb-20 ${currentTheme.pageBg} ${currentTheme.text} font-sans`}>
      {/* 2. BACKGROUND GLOW */}
      <div className={`fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] ${currentTheme.bgGradient} via-transparent to-transparent`} />

      <FavoriteReminder isOpen={showFavoriteReminder} onClose={() => setShowFavoriteReminder(false)} />
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        networkId={currentTheme.id}
        chainId={CHAIN_IDS[currentTheme.id]}
        theme={currentTheme}
      />
      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        txHash={successData ? successData.hash : ''}
        chainName={currentTheme.name}
        xpEarned={successData ? successData.xp : 0}
      />

      {/* 1. HEADER */}
      <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-slate-900/50 backdrop-blur-md sticky top-0 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <BaseWallet />
        </div>

        <div className="flex flex-col gap-1.5 items-end">
          <div className="flex gap-1.5">
             <button onClick={() => marketRef.current?.scrollIntoView({ behavior: 'smooth' })} className={`bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold py-1 px-3 rounded-md border border-amber-500 flex items-center gap-1.5 transition-all ${isEmpty ? 'animate-pulse' : ''}`}>
               <span>🛒</span> Market
             </button>
             <button onClick={() => setIsLeaderboardOpen(true)} className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold py-1 px-3 rounded-md border border-slate-600 flex items-center gap-1.5 transition-all">
               <span>🏆</span> Leaderboard
             </button>
          </div>

          <div className="flex items-center gap-1.5">
             <button onClick={() => handlePlant(0)} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold py-1 px-3 rounded-md shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all">
               <span>💧</span> WATER FARM
             </button>
          </div>
        </div>
      </header>

      {/* 2. NETWORK TABS */}
      <div className="relative z-10 max-w-lg mx-auto mt-6 px-4 flex flex-wrap justify-center gap-2 pb-2">
        {Object.values(THEMES).map((t: any) => {
           const isActive = currentTheme.id === t.id;
           const activeClass = isActive
             ? `bg-gradient-to-r ${chainColors[t.name] || defaultColor} text-white scale-105 border-transparent`
             : "bg-slate-800/50 text-gray-400 hover:bg-slate-700 border-slate-700";

           return (
             <button
               key={t.id}
               onClick={() => switchChain({ chainId: CHAIN_IDS[t.id] })}
               className={`px-3 py-1.5 text-xs rounded-full font-bold whitespace-nowrap transition-all shadow-lg ${activeClass}`}
             >
               {t.name}
             </button>
           );
        })}
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 space-y-6 mt-6">

        {/* 3. WALL CALENDAR */}
        <section className={`p-6 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.border} shadow-sm`}>
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">{monthName} {year}</h2>
              <div className="flex gap-2">
                <button onClick={() => setViewDate(new Date(year, viewDate.getMonth()-1, 1))} className={`p-1 rounded hover:bg-black/5`}><ChevronLeft /></button>
                <button onClick={() => setViewDate(new Date(year, viewDate.getMonth()+1, 1))} className={`p-1 rounded hover:bg-black/5`}><ChevronRight /></button>
              </div>
           </div>

           <div className={`grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold ${currentTheme.strongText}`}>
             {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
           </div>

           <div className="relative">
             {isEmpty && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl text-center p-4">
                  <p className="text-white text-xl font-bold mb-4 drop-shadow-md">Your garden is empty! 🌱</p>
                  <button
                    onClick={() => marketRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className={`px-6 py-3 rounded-full font-bold text-white shadow-lg ${currentTheme.primary} border-2 border-white/20 hover:scale-105 hover:brightness-110 transition-all`}
                  >
                    Get Your First Seed
                  </button>
                </div>
             )}
             <div className="grid grid-cols-7 gap-2">
                {[...Array(startDay)].map((_, i) => <div key={`empty-${i}`} />)}
                {[...Array(days)].map((_, i) => {
                   const dayNum = i + 1;
                   const currentDateStr = `${year}-${String(viewDate.getMonth()+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
                   const emoji = historyMap[currentDateStr];
                   const isToday = new Date().toDateString() === new Date(year, viewDate.getMonth(), dayNum).toDateString();

                   return (
                     <div key={dayNum} className={`relative aspect-square rounded-xl border flex items-center justify-center transition-all ${emoji ? currentTheme.activeBox : (isToday ? `${currentTheme.primary} text-white border-transparent` : 'bg-black/20 border-transparent')}`}>
                        <span className={`absolute top-0.5 right-1 text-[9px] font-bold ${isToday ? 'text-white' : currentTheme.strongText}`}>{dayNum}</span>
                        {emoji && <span className="text-xl">{emoji}</span>}
                     </div>
                   )
                })}
             </div>
           </div>
        </section>

        {/* 4. SEED MARKET */}
        <section ref={marketRef}>
           <h3 className="font-bold text-lg mb-3 opacity-80">Seed Market</h3>
           <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'gm', label: '🌱 Seed / Gm', price: 'Free', xp: '1 XP' },
                { id: 'deploy', label: '💐 Flower / Deploy', price: '$0.10', xp: '2 XP' },
                { id: 'launch', label: '🎄 Tree / Launch', price: '$0.15', xp: '3 XP' },
                { id: 'donate', label: '🍒 Fruit / Donate', price: '$0.20', xp: '5 XP' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id as any)}
                  className={`py-4 px-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all
                    ${activeTab === cat.id
                      ? `${currentTheme.accent} border-transparent scale-[1.02]`
                      : `bg-white/5 border-white/5 text-gray-400 hover:bg-white/10`}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{cat.label}</span>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs opacity-80 font-mono">{cat.price}</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-black/40 text-white border border-white/20`}>
                         +{cat.xp}
                       </span>
                    </div>
                  </div>
                </button>
              ))}
           </div>

           <div className={`grid grid-cols-4 sm:grid-cols-5 gap-3 p-4 rounded-3xl ${currentTheme.cardBg} border ${currentTheme.border}`}>
              {SEED_DATA[activeTab].map((seed) => (
                <button
                  key={seed.id}
                  onClick={() => handlePlant(seed.id)}
                  className="aspect-square bg-white/10 rounded-xl shadow-sm flex items-center justify-center text-3xl hover:scale-110 active:scale-90 transition-transform cursor-pointer hover:bg-white/20"
                >
                  {seed.icon}
                </button>
              ))}
           </div>
        </section>

      </div>
    </main>
  );
}
