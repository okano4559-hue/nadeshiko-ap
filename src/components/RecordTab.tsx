import { ProgressChart } from "@/components/ProgressChart";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { Activity, Flame, Minus, Plus, Calendar, Save, Edit2, Trash2, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Record = {
    date: string;
    score: number;
};

interface RecordTabProps {
    records: Record[];
    streak: number;
    inputScore: number;
    setInputScore: (score: number) => void;
    onIncrement: (e: React.MouseEvent) => void;
    onDecrement: (e: React.MouseEvent) => void;
    onSubmit: (e: React.FormEvent) => void;
    onDelete: (index: number) => void;
    editingRecordIndex: number | null;
    setEditingRecordIndex: (index: number | null) => void;
    editScoreValue: number;
    setEditScoreValue: (val: number) => void;
    onEditStart: (index: number, score: number) => void;
    onEditSave: (index: number) => void;
}

export function RecordTab({
    records, streak, inputScore, setInputScore, onIncrement, onDecrement, onSubmit,
    onDelete, editingRecordIndex, setEditingRecordIndex, editScoreValue, setEditScoreValue, onEditStart, onEditSave
}: RecordTabProps) {
    return (
        <div className="space-y-6 pb-24 px-4 w-full max-w-md mx-auto pt-6">

            {/* Streak Hero Section - Card Style */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1 text-slate-400 text-sm font-bold uppercase tracking-wider">
                        <Flame size={16} className="text-primary animate-pulse" />
                        <span>Current Streak</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-black italic tracking-tighter">{streak}</span>
                        <span className="text-xl font-bold text-slate-400">Days</span>
                    </div>
                </div>
            </motion.div>

            {/* Input Section */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="flex items-center gap-2 text-lg font-black italic text-secondary mb-4">
                    <Activity size={20} className="text-primary" />
                    TODAY'S RESULT
                </h3>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={onDecrement}
                            className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 text-secondary rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            <Minus size={24} />
                        </motion.button>

                        <div className="flex-1 text-center">
                            <input
                                type="number"
                                value={inputScore}
                                onChange={(e) => setInputScore(Number(e.target.value))}
                                className="text-5xl font-black text-secondary bg-transparent text-center w-full outline-none p-0 m-0 tabular-nums leading-none"
                            />
                            <span className="text-xs font-bold text-slate-400 mt-1 block uppercase tracking-widest">Reps</span>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={onIncrement}
                            className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-rose-700 transition-colors"
                        >
                            <Plus size={24} />
                        </motion.button>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={inputScore <= 0}
                        className="w-full bg-secondary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        SAVE RECORD
                    </motion.button>
                </form>
            </section>

            {/* Stats Overview */}
            <div className="space-y-4">
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-primary" />
                        <h4 className="font-bold text-secondary">Progress Chart</h4>
                    </div>
                    <ProgressChart data={records} />
                </div>

                <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={20} className="text-primary" />
                        <h4 className="font-bold text-secondary">Activity Log</h4>
                    </div>
                    <CalendarHeatmap records={records} />
                </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="font-bold text-secondary text-sm uppercase tracking-wider">Recent History</h4>
                    <span className="text-xs font-bold text-slate-400">{records.length} Records</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {records.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm font-bold">No records yet.</p>
                            <p className="text-xs mt-1">Start your training today!</p>
                        </div>
                    ) : (
                        [...records].reverse().map((record, reverseIndex) => {
                            const originalIndex = records.length - 1 - reverseIndex;
                            const isEditing = editingRecordIndex === originalIndex;

                            return (
                                <motion.div
                                    layout
                                    key={originalIndex}
                                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</span>
                                            <span className="text-sm font-bold text-secondary">{record.date}</span>
                                        </div>

                                        <div className="w-px h-8 bg-slate-100 mx-2"></div>

                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Score</span>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    value={editScoreValue}
                                                    onChange={(e) => setEditScoreValue(Number(e.target.value))}
                                                    className="w-20 px-2 py-1 rounded bg-white border-2 border-primary outline-none font-bold text-lg text-secondary"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="text-lg font-black text-secondary italic">
                                                    {record.score} <span className="text-xs font-normal text-slate-400 not-italic">reps</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => onEditSave(originalIndex)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={() => setEditingRecordIndex(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => onEditStart(originalIndex, record.score)} className="p-2 text-slate-300 hover:text-primary hover:bg-rose-50 rounded-lg transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => onDelete(originalIndex)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
