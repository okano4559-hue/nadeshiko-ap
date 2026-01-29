"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrainingRecord, StampType } from "@/lib/types";
import { Calendar, CheckCircle2, Trophy, Clock } from "lucide-react";

export default function CoachDashboard() {
    const [records, setRecords] = useState<TrainingRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('public:trainings')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'trainings' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchRecords();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("trainings")
            .select("*")
            .order("date", { ascending: false })
            .limit(20);

        if (error) {
            console.error("Error fetching records:", error);
        } else {
            setRecords(data || []);
        }
        setLoading(false);
    };

    const handleStamp = async (recordId: string, stamp: StampType) => {
        const { error } = await supabase
            .from("trainings")
            .update({ stamp_type: stamp })
            .eq("id", recordId);

        if (error) {
            console.error("Error updating stamp:", error);
            alert("スタンプの送信に失敗しました");
        } else {
            // Optimistic update
            setRecords(prev => prev.map(r => r.id === recordId ? { ...r, stamp_type: stamp } : r));
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans pb-20">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    COACH DASHBOARD
                </h1>
                <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400">
                    Updated: {new Date().toLocaleTimeString()}
                </div>
            </header>

            <div className="space-y-4 max-w-md mx-auto">
                {records.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        <p>まだ記録がありません</p>
                    </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-700 relative overflow-hidden">
                            {/* Header: Date & Score */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold">{record.date}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-white">{record.score}</span>
                                    <span className="text-xs text-slate-400 ml-1">回</span>
                                </div>
                            </div>

                            {/* Stamp Interaction Area */}
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wider">スタンプを送る</p>
                                <div className="flex justify-between gap-2">
                                    <StampButton
                                        active={record.stamp_type === 'soccer_ball'}
                                        onClick={() => handleStamp(record.id!, 'soccer_ball')}
                                        emoji="⚽️"
                                        label="ナイス"
                                    />
                                    <StampButton
                                        active={record.stamp_type === 'fire'}
                                        onClick={() => handleStamp(record.id!, 'fire')}
                                        emoji="🔥"
                                        label="熱い！"
                                    />
                                    <StampButton
                                        active={record.stamp_type === 'star'}
                                        onClick={() => handleStamp(record.id!, 'star')}
                                        emoji="⭐️"
                                        label="完璧"
                                    />
                                    <StampButton
                                        active={record.stamp_type === 'thumbs_up'}
                                        onClick={() => handleStamp(record.id!, 'thumbs_up')}
                                        emoji="👍"
                                        label="最高"
                                    />
                                </div>
                            </div>

                            {/* Active Stamp Indicator */}
                            {record.stamp_type && (
                                <div className="absolute top-2 left-2 pointer-events-none opacity-20">
                                    <span className="text-6xl grayscale">{getStampEmoji(record.stamp_type)}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

function StampButton({ active, onClick, emoji, label }: { active: boolean, onClick: () => void, emoji: string, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all active:scale-95 ${active
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'
                }`}
        >
            <span className="text-xl mb-1 filter drop-shadow-md">{emoji}</span>
            <span className="text-[10px] font-bold">{label}</span>
        </button>
    )
}

function getStampEmoji(type: StampType): string {
    switch (type) {
        case 'soccer_ball': return '⚽️';
        case 'fire': return '🔥';
        case 'star': return '⭐️';
        case 'thumbs_up': return '👍';
        default: return '';
    }
}
