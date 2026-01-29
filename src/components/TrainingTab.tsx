import { TrainingItem } from "@/lib/menuGenerator";
import { DynamicIcon } from "@/components/DynamicIcon";
import { Award, Calendar, CheckCircle, Clock, Pencil, Play, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRankColor } from "@/lib/utils";

interface TrainingTabProps {
    userName: string | null;
    isEditingName: boolean;
    tempName: string;
    setTempName: (name: string) => void;
    setIsEditingName: (isEditing: boolean) => void;
    handleNameSave: () => void;
    handleNameEditStart: () => void;
    rank: string;

    timerPhase: "IDLE" | "PREP" | "WORK" | "FINISHED";
    timeLeft: number;
    formatTime: (seconds: number) => string;
    handleStartTimer: () => void;
    setTimerPhase: (phase: "IDLE" | "PREP" | "WORK" | "FINISHED") => void;

    isPaused: boolean;
    togglePause: () => void;
    menu: TrainingItem[] | null;
}

export function TrainingTab({
    userName, isEditingName, tempName, setTempName, setIsEditingName, handleNameSave, handleNameEditStart, rank,
    timerPhase, timeLeft, formatTime, handleStartTimer, setTimerPhase, isPaused, togglePause,
    menu
}: TrainingTabProps) {
    return (
        <div className="space-y-6 pb-24 px-4 w-full max-w-md mx-auto">
            {/* Header / User Info */}
            <header className="flex justify-between items-center py-2">
                <h1 className="text-2xl font-black italic tracking-tighter text-secondary">
                    NADESIKO<span className="text-primary">.APP</span>
                </h1>
                <div className="flex flex-col items-end gap-1">
                    {/* Rank Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border bg-white/50 backdrop-blur-sm ${getRankColor(rank)}`}>
                        <Award size={12} className="stroke-[3]" />
                        <span className="text-[10px] font-black tracking-wider uppercase">
                            {rank}
                        </span>
                    </div>
                    <div className="relative group">
                        {isEditingName ? (
                            <div className="flex items-center bg-white shadow-sm ring-2 ring-primary/20 rounded-full px-3 py-1 animate-in fade-in zoom-in duration-200">
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="bg-transparent text-secondary font-bold outline-none w-24 text-sm"
                                    autoFocus
                                />
                                <button onClick={handleNameSave} className="ml-1 text-green-600 hover:text-green-700 p-1">
                                    <CheckCircle size={18} />
                                </button>
                                <button onClick={() => setIsEditingName(false)} className="ml-1 text-slate-400 hover:text-slate-600 p-1">
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <motion.button
                                layout
                                onClick={handleNameEditStart}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-100 active:scale-95 transition-transform"
                            >
                                <span className="text-sm font-bold text-slate-700">{userName} 選手</span>
                                <Pencil size={14} className="text-slate-400" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </header>

            {/* Today's Mission (Hero) */}
            {menu && (
                <section className="relative overflow-hidden rounded-3xl shadow-xl bg-secondary text-white p-6">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-primary-foreground/80">
                            <Calendar size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">今日のメニュー</span>
                        </div>
                        <h2 className="text-2xl font-black italic mb-6 leading-none">神経系コーディネーション</h2>

                        <div className="space-y-3">
                            {menu.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                                        {item.emoji}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">{item.name}</h4>
                                        <p className="text-xs text-slate-400 mt-1">{item.instruction}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-lg font-black text-primary italic whitespace-nowrap">
                                            {item.value}<span className="text-xs ml-0.5">{item.type === 'duration' ? '秒' : '回'}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Timer Section */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-slate-100 rounded-lg text-secondary">
                        <Clock size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-secondary">トレーニング開始</h3>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    <AnimatePresence mode="wait">
                        {timerPhase === "IDLE" && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center w-full"
                            >
                                <div className="text-6xl font-black text-slate-200 mb-6 font-mono tracking-widest">10:00</div>
                                <button
                                    onClick={handleStartTimer}
                                    className="w-full bg-primary text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                >
                                    <Play fill="currentColor" size={20} />
                                    スタート
                                </button>
                            </motion.div>
                        )}

                        {timerPhase === "PREP" && (
                            <motion.div
                                key="prep"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                className="text-center"
                            >
                                <p className="text-xl font-bold text-primary mb-4 animate-pulse">準備せよ！</p>
                                <div className="text-9xl font-black text-secondary">
                                    {timeLeft}
                                </div>
                            </motion.div>
                        )}

                        {timerPhase === "WORK" && (
                            <motion.div
                                key="work"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center relative"
                            >
                                <p className="text-sm font-bold text-slate-400 mb-2">残り時間</p>

                                <div className="relative">
                                    {timeLeft <= 5 ? (
                                        <div className="text-[100px] leading-none font-black text-primary animate-pulse tabular-nums">
                                            {timeLeft}
                                        </div>
                                    ) : (
                                        <div className={`text-7xl font-black font-mono tracking-tight tabular-nums transition-opacity ${isPaused ? "text-slate-300" : "text-secondary"}`}>
                                            {formatTime(timeLeft)}
                                        </div>
                                    )}

                                    {/* Pause Status Overlay */}
                                    {isPaused && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="bg-secondary text-white text-lg font-bold px-4 py-1 rounded-full shadow-lg animate-pulse">
                                                TIMEOUT
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Pause Button */}
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={togglePause}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 ${isPaused
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {isPaused ? <Play fill="currentColor" size={20} /> : <div className="w-4 h-4 border-l-4 border-r-4 border-current h-4 w-4" />}
                                        {/* Using CSS shapes or Lucide icons for Pause. Lucide 'Pause' is safer if imported, but I missed importing it in the Replace. 
                                            Checking imports: 'Play' is there. 'X' is there. 
                                            I should probably use standard Lucide Pause if available or just CSS. 
                                            Let's check imports in original file. 
                                            Line 3: Award, Calendar, CheckCircle, Clock, Pencil, Play, RotateCcw, X 
                                            'Pause' is NOT imported. I should stick to 'Play' and maybe an icon for pause or just text/shape.
                                            Actually I will add Pause to imports in a separate Edit if needed, but I can't do multiple edits easily in one go.
                                            I'll use a CSS-based pause icon or just text for now to be safe, or assume I can modify imports too. 
                                            Let's use a simple SVG inline or text.
                                         */}
                                        <span>{isPaused ? "再開する" : "一時停止"}</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {timerPhase === "FINISHED" && (
                            <motion.div
                                key="finished"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center w-full"
                            >
                                <h3 className="text-3xl font-black text-primary italic mb-2">FINISH!!</h3>
                                <p className="text-slate-500 mb-8 font-bold">おつかれさま！記録を入力しよう。</p>
                                <button
                                    onClick={() => setTimerPhase("IDLE")}
                                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    <RotateCcw size={18} />
                                    リセット
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
