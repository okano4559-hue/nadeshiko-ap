import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Award, CheckCircle2, X } from "lucide-react";

interface ResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
    streak: number;
    rank?: string;
}

export function ResultModal({ isOpen, onClose, score, streak, rank }: ResultModalProps) {
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Fanfare Sound
    const playFanfare = () => {
        try {
            if (!audioCtxRef.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    audioCtxRef.current = new AudioContext();
                }
            }
            const ctx = audioCtxRef.current;
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C

            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, now + i * 0.1);

                gain.gain.setValueAtTime(0, now + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.5);
            });

        } catch (e) {
            console.error("Fanfare failed", e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Trigger Confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#E11D48', '#FFD700', '#FFFFFF']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#E11D48', '#FFD700', '#FFFFFF']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Play Sound
            playFanfare();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50, rotateX: 20 }}
                        animate={{ scale: 1, y: 0, rotateX: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="relative w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-1 shadow-2xl border border-white/10"
                    >
                        {/* Glowing Border Layout */}
                        <div className="bg-slate-900 rounded-[22px] overflow-hidden relative p-8 text-center">

                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]"></div>
                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-yellow-300 to-yellow-600 rounded-2xl mb-6 shadow-lg shadow-yellow-500/30 transform rotate-3">
                                    <Trophy className="text-white w-10 h-10 drop-shadow-md" />
                                </div>

                                <h2 className="text-4xl font-black italic text-white mb-2 tracking-tighter drop-shadow-lg">
                                    EXCELLENT!
                                </h2>
                                <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-sm">
                                    Nice Fight, Striker!
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Score</div>
                                        <div className="text-3xl font-black text-rose-500 italic">{score}</div>
                                        <div className="text-[10px] text-slate-500">reps</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Streak</div>
                                        <div className="text-3xl font-black text-yellow-500 italic">
                                            {streak}<span className="text-sm not-italic ml-1">Days</span>
                                        </div>
                                    </div>
                                </div>

                                {rank && (
                                    <div className="mb-8 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-800 border border-white/5 rounded-full py-2 px-4 w-fit mx-auto">
                                        <Award className="text-yellow-400 w-4 h-4" />
                                        <span className="text-sm font-bold text-slate-300">
                                            Rank: <span className="text-white">{rank}</span>
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full bg-white text-slate-900 font-black py-4 rounded-xl shadow-lg hover:bg-slate-200 transition-colors active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={20} className="text-rose-600" />
                                    <span>閉じる</span>
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
