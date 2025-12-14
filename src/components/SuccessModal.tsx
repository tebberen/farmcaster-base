import { X } from "lucide-react";
import { THEMES } from "@/config/theme";
import sdk from "@farcaster/miniapp-sdk";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  chainName: string; // e.g., "Base", "Monad"
  xpEarned: number;
}

export default function SuccessModal({
  isOpen,
  onClose,
  txHash,
  chainName,
  xpEarned,
}: SuccessModalProps) {
  if (!isOpen) return null;

  // Determine theme based on chainName
  const getThemeKey = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes("base")) return "base";
    if (normalized.includes("bnb") || normalized.includes("bsc")) return "bsc";
    if (normalized.includes("arbitrum")) return "arb";
    if (normalized.includes("celo")) return "celo";
    if (normalized.includes("eth")) return "eth";
    if (normalized.includes("monad")) return "monad";
    if (normalized.includes("hyper")) return "hyper";
    return "base"; // default
  };

  const themeKey = getThemeKey(chainName);
  const theme = THEMES[themeKey] || THEMES["base"];

  const handleShare = () => {
    const text = `Just planted a 🌱 in my onchain garden! 🚜\nNetwork: ${chainName}\nReward: +${xpEarned} XP ✨\nCome plant your seeds with me! 👇\n\n#FarmCaster #${chainName} @farmmcaster`;

    // 1. Normalize network parameter
    const netParam = themeKey; // Uses the validated themeKey from getThemeKey()

    // 2. Point to Vercel (Where metadata lives)
    // Use Static Route for correct metadata on GitHub Pages
    const embedUrl = `https://farmcaster-six.vercel.app/share/${netParam}`;

    const encodedText = encodeURIComponent(text);
    const encodedEmbed = encodeURIComponent(embedUrl);

    const shareUrl = `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedEmbed}`;

    // USE SDK ACTION FOR NATIVE HANDLING (Mobile Fix)
    // We check if sdk.actions exists to avoid errors, defaulting to window.open
    if (sdk && sdk.actions) {
        sdk.actions.openUrl(shareUrl);
    } else {
        window.open(shareUrl, "_blank");
    }
  };

  const getExplorerUrl = (txHash: string) => {
    switch(themeKey) {
        case 'base': return `https://basescan.org/tx/${txHash}`;
        case 'bsc': return `https://bscscan.com/tx/${txHash}`;
        case 'celo': return `https://celoscan.io/tx/${txHash}`;
        case 'arb': return `https://arbiscan.io/tx/${txHash}`;
        case 'eth': return `https://etherscan.io/tx/${txHash}`;
        case 'monad': return `https://testnet.monadexplorer.com/tx/${txHash}`;
        case 'hyper': return `https://explorer.hyperliquid.xyz/tx/${txHash}`;
        default: return `https://basescan.org/tx/${txHash}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-2xl border ${theme.border} shadow-2xl`}
        style={{
          background: theme.cardBg || "#1e293b",
          boxShadow: `0 0 40px ${theme.glow}40`
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center p-8 text-center">
          {/* Animated Success Icon */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 animate-ping rounded-full opacity-20 bg-${theme.primary?.split('-')[1]}-500`} />
            <div className={`relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${theme.bgGradient} border-2 ${theme.border} shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
              <span className="text-4xl animate-bounce">🌱</span>
            </div>
          </div>

          <h2 className={`text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${theme.text}`}>
            Planted!
          </h2>

          <p className="text-gray-400 mb-6">
            Your seed is now growing on <span className={theme.strongText}>{chainName}</span>.
          </p>

          {/* XP Reward Card */}
          <div className="w-full bg-black/20 rounded-xl p-4 mb-6 border border-white/5">
            <div className="text-sm text-gray-400 mb-1">XP Earned</div>
            <div className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              +{xpEarned} XP
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleShare}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${theme.primary}`}
            >
              Share on Warpcast 📢
            </button>

            <a
              href={getExplorerUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              View Transaction ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
