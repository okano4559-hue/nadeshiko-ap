"use client";

import { Trophy, Medal } from "lucide-react";

export function RankingBoard() {
    // Mock data for initial version
    const rankings = [
        { rank: 1, name: "つばさ", score: 100, badge: "🏆" },
        { rank: 2, name: "ひゅうが", score: 98, badge: "🥈" },
        { rank: 3, name: "みさき", score: 95, badge: "🥉" },
        { rank: 4, name: "わかばやし", score: 92, badge: "" },
        { rank: 5, name: "あなた", score: 88, badge: "NEW!" }, // Placeholder for user
    ];

    return (
        <div className="bg-gradient-to-br from-nadeshiko-blue to-blue-900 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-400" />
                <h3 className="text-xl font-bold">きょうのランキング</h3>
            </div>

            <div className="space-y-3">
                {rankings.map((player) => (
                    <div
                        key={player.rank}
                        className="flex items-center justify-between bg-white/10 p-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-bold w-6 text-center ${player.rank <= 3 ? 'text-yellow-400 text-xl' : 'text-gray-300'}`}>
                                {player.rank}
                            </span>
                            <span className="font-semibold text-lg">{player.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{player.score}</span>
                            <span className="text-sm border border-white/30 px-1 rounded text-xs opacity-70">回</span>
                            {player.badge && <span className="text-sm">{player.badge}</span>}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-blue-200 mt-4 opacity-70">トップ5 プレイヤー (合計回数)</p>
        </div>
    );
}
