import React from 'react';
import { Theme } from '../config/theme';
import clsx from 'clsx';
import { X, Share2 } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
    emoji: string | null;
    networkName: string;
    chainId: number;
    xp: number;
}

const CHAIN_IMAGES: Record<number, string> = {
    8453: 'base-cover.png',
    42220: 'celo-cover.png',
    56: 'bsc-cover.png',
    42161: 'arb-cover.png',
    143: 'monad-cover.png',
    999: 'hyper-cover.png',
    1: 'eth-cover.png',
};

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, theme, emoji, networkName, chainId, xp }) => {
    if (!isOpen) return null;

    const handleShare = () => {
        // Remove spaces for hashtag
        const networkHashtag = networkName.replace(/\s+/g, '');

        // Construct the text as requested
        const text = `Just planted a ${emoji || '🌱'} in my onchain garden! 🚜\nNetwork: ${networkName}\nReward: +${xp} XP ✨\nCome plant your seeds with me! 👇\n\n#FarmCaster #${networkHashtag} @farmmcaster`;

        // 2. THE FIX: Share the Vercel URL
        // Why: This URL hosts the metadata/images. 'farcaster.xyz' does not.
        const embedUrl = "https://farmcaster-six.vercel.app";

        const encodedText = encodeURIComponent(text);
        const encodedEmbed = encodeURIComponent(embedUrl);

        // 2. Build the Compose URL
        const shareUrl = `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodedEmbed}`;
        window.open(shareUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={clsx("relative w-full max-w-sm border rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-6", theme.cardBg, theme.border)}>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-2 mt-4">
                    <div className="text-6xl animate-bounce filter drop-shadow-md">
                        {emoji || "🌱"}
                    </div>
                    <h2 className="text-2xl font-bold text-white">Planted Successfully!</h2>
                    <p className={clsx("font-bold text-lg", theme.strongText)}>You earned +{xp} XP!</p>
                </div>

                <button
                    onClick={handleShare}
                    className={clsx(
                        "w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-white",
                        "bg-[#472a91] hover:bg-[#5b37b7] shadow-lg shadow-purple-900/20" // Warpcast brand colorish
                    )}
                >
                    <Share2 size={18} />
                    <span>Share on Warpcast</span>
                </button>

                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-white/10 transition-colors"
                >
                    Close
                </button>

            </div>
        </div>
    );
};
