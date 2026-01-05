"use client";

import { Trophy, Medal, Star } from "lucide-react";

interface RankingBoardProps {
    userName: string;
    userScore: number;
}

export function RankingBoard({ userName, userScore }: RankingBoardProps) {
    // Base mock data
    const baseRankings = [
        { id: 'npc1', name: "翼", score: 100, badge: "🏆" },
        { id: 'npc2', name: "日向", score: 98, badge: "🥈" },
        { id: 'npc3', name: "岬", score: 95, badge: "🥉" },
        { id: 'npc4', name: "若林", score: 92, badge: "" },
        { id: 'npc5', name: "石崎", score: 60, badge: "" },
    ];

    // Combine user with base rankings
    const allPlayers = [
        ...baseRankings,
        { id: 'user', name: userName || "あなた", score: userScore, badge: "YOU" }
    ];

    // Sort by score descending
    const sortedRankings = allPlayers.sort((a, b) => b.score - a.score);

    return (
        <div className="bg-gradient-to-br from-nadeshiko-blue to-blue-900 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-400" />
                <h3 className="text-xl font-bold">今日のランキング</h3>
            </div>

            <div className="space-y-3">
                {sortedRankings.slice(0, 5).map((player, index) => {
                    const rank = index + 1;
                    const isUser = player.id === 'user';

                    return (
                        <div
                            key={player.id}
                            className={`flex items-center justify-between p-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${isUser
                                ? "bg-nadeshiko-red/90 transform scale-105 shadow-xl border-2 border-yellow-300"
                                : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`font-bold w-6 text-center ${rank <= 3 ? 'text-yellow-400 text-xl' : 'text-gray-300'}`}>
                                    {rank}
                                </span>
                                <span className={`font-semibold text-lg ${isUser ? "text-white" : ""}`}>
                                    {player.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{player.score}</span>
                                <span className="text-sm border border-white/30 px-1 rounded text-xs opacity-70">回</span>
                                {player.badge && !isUser && <span className="text-sm">{player.badge}</span>}
                                {isUser && <Star className="text-yellow-300 w-5 h-5 animate-spin-slow" />}
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-blue-200 mt-4 opacity-70">トップ5選手 (合計回数)</p>
        </div>
    );
}
