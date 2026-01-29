"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Lock, Star, Trophy, Footprints, Flame, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RoadmapProps {
    totalScore: number;
    streak: number;
    totalStamps: number;
}

interface Stage {
    id: string;
    title: string;
    description: string;
    nodes: Node[];
    isUnlocked: boolean;
}

interface Node {
    id: string;
    title: string;
    icon: React.ElementType;
    reqText: string;
    isCompleted: boolean;
    progress: number; // 0-100
    current: number;
    target: number;
    unit: string;
}

export function NadeshikoRoadmap({ totalScore, streak, totalStamps }: RoadmapProps) {
    const [finalFanfarePlayed, setFinalFanfarePlayed] = useState(false);

    // Define Logic
    const nodes = [
        // Stage 1
        {
            id: 'dribble',
            title: '爆速ドリブル',
            icon: Footprints,
            reqText: '累計100回',
            target: 100,
            current: totalScore,
            unit: '回',
            isCompleted: totalScore >= 100
        },
        {
            id: 'mind',
            title: 'あきらめない心',
            icon: Flame,
            reqText: '継続3日',
            target: 3,
            current: streak,
            unit: '日',
            isCompleted: streak >= 3
        },
        // Stage 2
        {
            id: 'speed',
            title: '異次元のスピード',
            icon: ZapIcon,
            reqText: '累計500回',
            target: 500,
            current: totalScore,
            unit: '回',
            isCompleted: totalScore >= 500
        },
        {
            id: 'body',
            title: '強靭なフィジカル',
            icon: DumbbellIcon,
            reqText: '継続7日',
            target: 7,
            current: streak,
            unit: '日',
            isCompleted: streak >= 7
        },
        // Stage 3
        {
            id: 'trust',
            title: 'パパの全幅の信頼',
            icon: Heart,
            reqText: 'スタンプ30個',
            target: 30,
            current: totalStamps,
            unit: '個',
            isCompleted: totalStamps >= 30
        },
        {
            id: 'skill',
            title: 'フィールドの支配者',
            icon: CrownIcon,
            reqText: '累計2000回',
            target: 2000,
            current: totalScore,
            unit: '回',
            isCompleted: totalScore >= 2000
        },
    ];

    const stage1Clear = nodes[0].isCompleted && nodes[1].isCompleted;
    const stage2Clear = stage1Clear && nodes[2].isCompleted && nodes[3].isCompleted;
    const stage3Clear = stage2Clear && nodes[4].isCompleted && nodes[5].isCompleted;
    const isNadeshiko = stage3Clear;

    // Effect for Final Unlock
    useEffect(() => {
        if (isNadeshiko && !finalFanfarePlayed) {
            setFinalFanfarePlayed(true);
            triggerFanfare();
        }
    }, [isNadeshiko, finalFanfarePlayed]);

    const triggerFanfare = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#EF4444', '#FFFFFF'] // Japan colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#EF4444', '#FFFFFF']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <div className="bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-6 shadow-xl border-4 border-blue-900/50 relative overflow-hidden text-white">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
            }}></div>

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                        ROAD TO NADESHIKO
                    </h2>
                    <p className="text-xs font-bold text-blue-200 mt-1">夢のなでしこジャパンへ</p>
                </div>

                <div className="space-y-12 relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 top-4 bottom-10 w-1 bg-blue-700/50 -translate-x-1/2"></div>

                    {/* Final Stage */}
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isNadeshiko ? 1.1 : 1, opacity: 1 }}
                            className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500",
                                isNadeshiko ? "bg-white border-yellow-400 shadow-yellow-500/50" : "bg-slate-800 border-slate-700 grayscale"
                            )}
                        >
                            {isNadeshiko ? (
                                <div className="text-center">
                                    <span className="text-4xl">🇯🇵</span>
                                </div>
                            ) : (
                                <Lock className="text-slate-500" />
                            )}
                        </motion.div>
                        <div className="mt-3 text-center">
                            <span className={cn("font-black text-lg italic uppercase", isNadeshiko ? "text-yellow-400" : "text-slate-500")}>
                                Nadeshiko Japan
                            </span>
                        </div>
                    </div>

                    {/* Stage 3 */}
                    <RoadmapStage
                        title="世代別代表候補"
                        isUnlocked={stage2Clear}
                        nodes={[nodes[4], nodes[5]]}
                        color="text-emerald-400"
                    />

                    {/* Stage 2 */}
                    <RoadmapStage
                        title="都道府県代表"
                        isUnlocked={stage1Clear}
                        nodes={[nodes[2], nodes[3]]}
                        color="text-cyan-400"
                    />

                    {/* Stage 1 */}
                    <RoadmapStage
                        title="地元のエース"
                        isUnlocked={true}
                        nodes={[nodes[0], nodes[1]]}
                        color="text-blue-400"
                    />
                </div>
            </div>
        </div>
    );
}

function RoadmapStage({ title, isUnlocked, nodes, color }: { title: string, isUnlocked: boolean, nodes: any[], color: string }) {
    return (
        <div className={cn("relative z-10 transition-opacity duration-500", isUnlocked ? "opacity-100" : "opacity-50 blur-[1px]")}>
            <div className="text-center mb-4">
                <span className={cn("text-xs font-bold uppercase tracking-widest bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700", color)}>
                    {title}
                </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {nodes.map(node => (
                    <NodeCard key={node.id} node={node} locked={!isUnlocked} />
                ))}
            </div>
        </div>
    )
}

function NodeCard({ node, locked }: { node: any, locked: boolean }) {
    const isCompleted = node.isCompleted;
    const Icon = node.icon;
    const [showHint, setShowHint] = useState(false);

    const progressPercent = Math.min(100, Math.max(0, (node.current / node.target) * 100));

    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHint(!showHint)}
            className={cn(
                "relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 border shadow-lg flex flex-col items-center gap-2 cursor-pointer overflow-hidden group",
                isCompleted ? "border-yellow-500/50 shadow-yellow-500/10" : "border-slate-700"
            )}
        >
            {isCompleted && (
                <div className="absolute top-0 right-0 p-1 bg-yellow-500 text-slate-900 rounded-bl-lg z-20">
                    <CheckCircle2 size={12} />
                </div>
            )}

            <div className={cn("p-2 rounded-full mb-1", isCompleted ? "bg-yellow-500 text-slate-900" : "bg-slate-700 text-slate-400")}>
                {locked ? <Lock size={16} /> : <Icon size={16} />}
            </div>

            <span className={cn("text-[10px] font-bold text-center leading-tight", isCompleted ? "text-white" : "text-slate-400")}>
                {node.title}
            </span>

            {/* Progress Bar (Only if unlocked and not completed) */}
            {!locked && !isCompleted && (
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
            )}

            {/* Hint Overlay */}
            {(!locked && !isCompleted) && (
                <div className="text-[9px] text-slate-400 font-mono">
                    {node.current} / {node.target} {node.unit}
                </div>
            )}

            {/* Locked Overlay */}
            {locked && (
                <div className="absolute inset-0 bg-slate-900/60 z-10 flex items-center justify-center">
                    <Lock size={12} className="text-slate-500" />
                </div>
            )}

            {isCompleted && (
                <div className="absolute inset-0 bg-yellow-500/10 pointer-events-none"></div>
            )}
        </motion.div>
    );
}

// Icons
function ZapIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
}
function DumbbellIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path></svg>
}
function CrownIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>
}
