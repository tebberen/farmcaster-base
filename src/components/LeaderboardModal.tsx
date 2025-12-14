import React, { useMemo } from 'react';
import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { HUB_CONTRACTS, HUB_ABI } from '../config/contracts';
import { Theme } from '../config/theme';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    networkId: string;
    chainId: number;
    theme: Theme;
}

interface LeaderboardEntry {
    address: string;
    xp: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, networkId, chainId, theme }) => {
    const { address: connectedAddress } = useAccount();
    const hubAddress = HUB_CONTRACTS[networkId];

    // 1. Fetch All Users
    const { data: allUsers } = useReadContract({
        address: hubAddress,
        abi: HUB_ABI,
        functionName: 'getAllUsers',
        chainId: chainId,
    });

    // 2. Multicall for XP
    // prepare contracts array
    const contracts = useMemo(() => {
        if (!allUsers || !Array.isArray(allUsers)) return [];
        return (allUsers as string[]).map((userAddr) => ({
            address: hubAddress,
            abi: HUB_ABI,
            functionName: 'userXP',
            args: [userAddr],
            chainId: chainId
        }));
    }, [allUsers, hubAddress, chainId]);

    const { data: xpResults } = useReadContracts({
        contracts,
        query: {
            enabled: contracts.length > 0,
        }
    });

    // 3. Process & Sort
    const leaderboard = useMemo(() => {
        if (!allUsers || !xpResults) return [];

        const entries: LeaderboardEntry[] = [];

        (allUsers as string[]).forEach((addr, index) => {
            const xpResult = xpResults[index];
            if (xpResult.status === 'success') {
                entries.push({
                    address: addr,
                    xp: Number(xpResult.result)
                });
            }
        });

        return entries.sort((a, b) => b.xp - a.xp).slice(0, 100);
    }, [allUsers, xpResults]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={clsx("relative w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]", theme.cardBg, theme.border)}>

                {/* Header */}
                <div className={clsx("p-4 border-b flex justify-between items-center bg-black/20", theme.border)}>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">🏆</span> Top 100 Farmers
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            No farmers found yet.
                        </div>
                    ) : (
                        leaderboard.map((entry, index) => {
                            const isCurrentUser = connectedAddress && entry.address.toLowerCase() === connectedAddress.toLowerCase();

                            let rankIcon = <span className="font-mono text-slate-500 w-6 text-center font-bold">{index + 1}</span>;
                            if (index === 0) rankIcon = <span className="text-xl w-6 text-center">🥇</span>;
                            if (index === 1) rankIcon = <span className="text-xl w-6 text-center">🥈</span>;
                            if (index === 2) rankIcon = <span className="text-xl w-6 text-center">🥉</span>;

                            return (
                                <div
                                    key={entry.address}
                                    className={clsx(
                                        "flex items-center justify-between p-3 rounded-xl transition-colors border",
                                        isCurrentUser
                                            ? `${theme.bg} ${theme.border}`
                                            : "bg-transparent border-transparent hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {rankIcon}
                                        <div className="flex flex-col">
                                            <span className={clsx("font-bold font-mono", theme.text)}>
                                                {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                                            </span>
                                            {isCurrentUser && <span className={clsx("text-[10px] uppercase font-bold tracking-wider opacity-70", theme.text)}>You</span>}
                                        </div>
                                    </div>

                                    <div className={clsx("font-bold", theme.text)}>
                                        {entry.xp.toLocaleString()} XP
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
