"use client";

import { Trophy, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

interface RankingBoardProps {
    userName: string;
    userScore: number;
}

export function RankingBoard({ userName, userScore }: RankingBoardProps) {
    // Base mock data
    const baseRankings = [
        { id: 'npc1', name: "TSUBASA", score: 120, badge: "🏆" },
        { id: 'npc2', name: "HYUGA", score: 115, badge: "🥈" },
        { id: 'npc3', name: "MISAKI", score: 95, badge: "🥉" },
        { id: 'npc4', name: "WAKABAYASHI", score: 92 },
        { id: 'npc5', name: "ISHIZAKI", score: 60 },
    ];

    // Combine user with base rankings
    const allPlayers = [
        ...baseRankings,
        { id: 'user', name: userName || "YOU", score: userScore, badge: "YOU" }
    ];

    // Sort by score descending
    const sortedRankings = allPlayers.sort((a, b) => b.score - a.score);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-secondary uppercase tracking-wider text-sm flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" />
                    Top Players
                </h3>
            </div>

            <div className="divide-y divide-slate-100">
                {sortedRankings.slice(0, 5).map((player, index) => {
                    const rank = index + 1;
                    const isUser = player.id === 'user';

                    let rankIcon;
                    if (rank === 1) rankIcon = <Trophy size={20} className="text-yellow-500 fill-yellow-500" />;
                    else if (rank === 2) rankIcon = <Medal size={20} className="text-slate-400 fill-slate-300" />;
                    else if (rank === 3) rankIcon = <Medal size={20} className="text-orange-400 fill-orange-300" />;
                    else rankIcon = <span className="font-black text-slate-300 text-lg w-5 text-center">{rank}</span>;

                    return (
                        <motion.div
                            layout
                            key={player.id}
                            className={`flex items-center justify-between p-4 transition-colors ${isUser ? "bg-red-50" : "hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 flex justify-center">
                                    {rankIcon}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-black uppercase italic ${isUser ? "text-primary" : "text-secondary"}`}>
                                        {player.name}
                                    </span>
                                    {isUser && <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-red-100 rounded self-start">YOU</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <span className={`text-2xl font-black italic tabular-nums ${isUser ? "text-primary" : "text-slate-700"}`}>
                                    {player.score}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">reps</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
