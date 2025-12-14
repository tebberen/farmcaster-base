import React from 'react';
import sdk from "@farcaster/miniapp-sdk";
import { Star, X } from "lucide-react";

interface FavoriteReminderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoriteReminder({ isOpen, onClose }: FavoriteReminderProps) {
  if (!isOpen) return null;

  const handleAdd = async () => {
    try {
        await sdk.actions.addMiniApp();
    } catch (e) {
        console.error("Failed to add mini app:", e);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col gap-4">
        <div className="flex items-start gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
                <Star className="w-6 h-6 fill-yellow-400" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-white text-lg leading-tight">Add to Favorites</h3>
                <p className="text-slate-300 text-sm mt-1">Don't lose your farm! Add FarmCaster to favorites for easy access. ⭐</p>
            </div>
             <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="flex gap-3 mt-1">
            <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
                Later
            </button>
            <button
                onClick={handleAdd}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:opacity-90 transition-opacity shadow-lg shadow-yellow-500/20"
            >
                Add to Favorites
            </button>
        </div>
      </div>
    </div>
  );
}
