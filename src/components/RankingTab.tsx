import { RankingBoard } from "@/components/RankingBoard";
import { MedalCollection } from "@/components/MedalCollection";
import { Trophy, Crown } from "lucide-react";

interface RankingTabProps {
    userName: string | null;
    userScore: number;
    streak: number;
    totalScore: number;
    totalStamps: number;
}

import { NadeshikoRoadmap } from "@/components/NadeshikoRoadmap";

export function RankingTab({ userName, userScore, streak, totalScore, totalStamps }: RankingTabProps) {
    return (
        <div className="space-y-6 pb-24 px-4 w-full max-w-md mx-auto pt-6">

            {/* Header Area */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-lg relative overflow-hidden text-center text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 rotate-12" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm shadow-sm ring-2 ring-white/30">
                        <Crown size={32} className="text-white fill-current" />
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                        Daily Ranking
                    </h2>
                    <p className="text-sm font-bold opacity-90">ライバルと競い合え！</p>
                </div>
            </div>

            {/* Medal Collection */}
            <MedalCollection streak={streak} />

            {/* Nadeshiko Roadmap */}
            <NadeshikoRoadmap totalScore={totalScore} streak={streak} totalStamps={totalStamps} />

            {/* Ranking List */}
            <RankingBoard userName={userName || "Unknown"} userScore={userScore} />

            {/* Motivation Card */}
            <div className="bg-secondary rounded-3xl p-6 shadow-sm border border-slate-800 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="font-black text-primary text-lg italic mb-2 uppercase">Be the Champion!</h4>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">
                        ランキングは毎日リセット。<br />
                        日々の積み重ねが、未来のなでしこを作る。<br />
                        昨日の自分を超えていけ。
                    </p>
                </div>
            </div>
        </div>
    );
}
