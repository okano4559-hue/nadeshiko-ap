"use client";

import { motion } from "framer-motion";
import { Medal, Trophy, Star, Crown, Zap } from "lucide-react";
import { useState } from "react";

// Medal Data Definition
const MEDALS = [
    { days: 10, name: "フレッシュ・スター", condition: "10日連続達成！", icon: Star, color: "text-yellow-400" },
    { days: 20, name: "努力の天才", condition: "20日連続達成！", icon: Zap, color: "text-blue-400" },
    { days: 30, name: "なでしこの卵", condition: "30日連続達成！", icon: Medal, color: "text-rose-400" },
    { days: 50, name: "チームの柱", condition: "50日連続達成！", icon: Trophy, color: "text-emerald-400" },
    { days: 100, name: "伝説のファンタジスタ", condition: "100日連続達成！", icon: Crown, color: "text-purple-400" },
];

interface MedalCollectionProps {
    streak: number;
}

export function MedalCollection({ streak }: MedalCollectionProps) {
    const [selectedMedal, setSelectedMedal] = useState<string | null>(null);

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative">
            <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
                <Medal className="text-primary" size={20} />
                メダルコレクション
            </h3>

            <div className="grid grid-cols-3 gap-3">
                {MEDALS.map((medal, idx) => {
                    const isUnlocked = streak >= medal.days;
                    const Icon = medal.icon;
                    const isSelected = selectedMedal === medal.name;

                    return (
                        <div key={idx} className="relative flex flex-col items-center z-10">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                initial={false}
                                animate={{ scale: isUnlocked ? 1 : 0.95 }}
                                onClick={() => setSelectedMedal(isSelected ? null : medal.name)}
                                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all p-1 ${isUnlocked
                                        ? "bg-white border-slate-100 shadow-sm ring-1 ring-slate-50"
                                        : "bg-slate-50 border-slate-100 opacity-50 grayscale"
                                    } ${isSelected ? "ring-2 ring-primary border-primary" : ""}`}
                            >
                                <Icon size={28} className={isUnlocked ? medal.color : "text-slate-400"} />
                                <span className={`text-[9px] font-bold text-center leading-tight w-full truncate ${isUnlocked ? "text-secondary" : "text-slate-400"
                                    }`}>
                                    {medal.name}
                                </span>
                            </motion.button>

                            {/* Simple Tooltip */}
                            {isSelected && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[140px] bg-secondary text-white text-[10px] p-2 rounded-lg shadow-xl z-50 text-center animate-in fade-in zoom-in-95 duration-200">
                                    <p className="font-bold text-primary mb-0.5">{medal.days} days</p>
                                    <p>{medal.condition}</p>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-secondary rotate-45"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-slate-400 text-center mt-4 font-bold">
                現在の連続記録: <span className="text-primary text-base">{streak}日</span>
            </p>

            {/* Invisible overlay to close modal when clicking outside */}
            {selectedMedal && (
                <div className="fixed inset-0 z-0 bg-transparent" onClick={() => setSelectedMedal(null)} />
            )}
        </div>
    );
}
