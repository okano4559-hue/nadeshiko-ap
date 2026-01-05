"use client";

import { useState, useEffect } from "react";
import { getDailyMenu, DailyMenu } from "@/lib/menuGenerator";
import { Registration } from "@/components/Registration";
import { ProgressChart } from "@/components/ProgressChart";
import { RankingBoard } from "@/components/RankingBoard";
import { CheckCircle, Activity, Calendar, Trophy, Minus, Plus } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";

type Record = {
  date: string;
  score: number;
};

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [inputScore, setInputScore] = useState<number>(0);
  const [records, setRecords] = useState<Record[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer State
  const [timerPhase, setTimerPhase] = useState<"IDLE" | "PREP" | "WORK" | "FINISHED">("IDLE");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Load data
    const storedName = localStorage.getItem("nadeshiko_user_name");
    const storedRecords = JSON.parse(localStorage.getItem("nadeshiko_records") || "[]");

    setUserName(storedName);
    setRecords(storedRecords);
    setMenu(getDailyMenu());
    setLoading(false);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerPhase === "PREP" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerPhase === "PREP" && timeLeft === 0) {
      // Switch to Main Work Phase (10 minutes = 600 seconds)
      setTimerPhase("WORK");
      setTimeLeft(600);
      playBeep(440, 0.1); // Start beep
    } else if (timerPhase === "WORK" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Last 5 seconds sound effect
          if (prev <= 6 && prev > 1) { // beep at 5, 4, 3, 2, 1 (prev is current, will become prev-1)
            playBeep(880, 0.1);
          }
          // Long beep at finish
          if (prev === 1) {
            playBeep(880, 0.6);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerPhase === "WORK" && timeLeft === 0) {
      setTimerPhase("FINISHED");
    }

    return () => clearInterval(interval);
  }, [timerPhase, timeLeft]);

  // Sound Effect Helper
  const playBeep = (freq: number, duration: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleStartTimer = () => {
    setTimerPhase("PREP");
    setTimeLeft(3); // 3 seconds prep
  };

  const handleRegister = (name: string) => {
    setUserName(name);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputScore <= 0) return;

    const newRecord = {
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: inputScore,
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    localStorage.setItem("nadeshiko_records", JSON.stringify(updatedRecords));

    setShowFeedback(true);
    setInputScore(0);

    // Hide feedback after 3s
    setTimeout(() => setShowFeedback(false), 3000);
  };

  // Fixed Increment/Decrement Logic
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission or bubbling
    setInputScore((prev) => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    setInputScore((prev) => Math.max(0, prev - 1));
  };

  // Timer Formatting
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };


  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-nadeshiko-blue">読み込み中...</div>;

  if (!userName) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Registration onRegister={handleRegister} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-nadeshiko-blue text-white p-6 sticky top-0 z-10 shadow-md">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold italic tracking-wider">目指せ日本代表！！</h1>
          <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">こんにちは、{userName} 選手</span>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">

        {/* Timer Section */}
        <section className="bg-gradient-to-br from-indigo-900 to-nadeshiko-blue rounded-xl p-5 shadow-lg text-white text-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Activity size={200} className="absolute -right-10 -bottom-10" />
          </div>

          {timerPhase === "IDLE" && (
            <div className="py-4">
              <h2 className="text-xl font-bold mb-4">トレーニングをはじめよう！</h2>
              <button
                onClick={handleStartTimer}
                className="bg-nadeshiko-red hover:bg-red-500 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 animate-pulse"
              >
                スタート (10分)
              </button>
            </div>
          )}

          {timerPhase === "PREP" && (
            <div className="py-2">
              <p className="text-lg font-bold opacity-80 mb-2">じゅんびしてね！</p>
              <div className="text-8xl font-black text-white animate-bounce">
                {timeLeft}
              </div>
            </div>
          )}

          {timerPhase === "WORK" && (
            <div className="py-2">
              <p className="text-sm font-bold opacity-80 mb-1">トレーニング中！</p>
              {timeLeft <= 5 ? (
                // Last 5 seconds huge display
                <div className="text-[120px] leading-none font-black text-nadeshiko-red animate-pulse scale-110 duration-75">
                  {timeLeft}
                </div>
              ) : (
                <div className="text-7xl font-black font-mono tracking-wider">
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>
          )}

          {timerPhase === "FINISHED" && (
            <div className="py-4">
              <h2 className="text-3xl font-bold mb-2">しゅうりょう！！</h2>
              <p className="mb-4">おつかれさま！回数を入力してね。</p>
              <button
                onClick={() => setTimerPhase("IDLE")}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2 px-6 rounded-full"
              >
                リセット
              </button>
            </div>
          )}
        </section>

        {/* Today's Menu */}
        {menu && (
          <section className={`bg-white rounded-xl shadow-lg border-l-8 ${menu.color} overflow-hidden`}>
            <div className="bg-gray-100 p-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={18} />
                <span className="font-bold">{menu.day}</span>
              </div>
              <span className="text-xs font-bold bg-nadeshiko-red text-white px-2 py-0.5 rounded uppercase">きょうのメニュー</span>
            </div>

            <div className="p-5">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{menu.theme}</h2>
              <p className="text-gray-500 text-sm mb-4">{menu.description}</p>

              <div className="space-y-4">
                {menu.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg text-nadeshiko-blue">
                      <DynamicIcon name={item.iconName} size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-nadeshiko-red font-semibold">{item.reps}</p>
                      {item.tips && <p className="text-xs text-gray-400 mt-1 italic">コツ: {item.tips}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recording Area */}
        <section className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Activity className="text-nadeshiko-blue" size={20} />
            結果をきろくする
          </h3>

          <p className="text-sm text-gray-500 mb-2">10分間で何回できたか入力してね</p>

          <form onSubmit={handleRecordSubmit} className="flex flex-col gap-4">

            <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-16 h-16 flex items-center justify-center bg-white border-2 border-nadeshiko-blue text-nadeshiko-blue rounded-full shadow hover:bg-blue-50 active:scale-95 transition"
              >
                <Minus size={32} />
              </button>

              <div className="flex-1 text-center">
                <span className="text-4xl font-bold text-gray-800">{inputScore}</span>
                <span className="text-sm text-gray-500 block">回</span>
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-16 h-16 flex items-center justify-center bg-nadeshiko-red text-white rounded-full shadow hover:bg-pink-500 active:scale-95 transition"
              >
                <Plus size={32} />
              </button>
            </div>

            <button
              type="submit"
              disabled={inputScore <= 0}
              className="w-full bg-nadeshiko-blue text-white font-bold px-6 py-4 rounded-xl shadow-lg hover:bg-blue-900 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
            >
              かんりょう！
            </button>
          </form>
        </section>

        {/* Charts */}
        <ProgressChart data={records} />

        {/* Ranking */}
        <RankingBoard />

      </div>

      {/* Feedback Modal / Overlay */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform scale-110 animate-out fade-out zoom-out duration-300">
            <Trophy className="mx-auto text-yellow-400 mb-4 h-16 w-16 animate-bounce" />
            <h2 className="text-3xl font-bold text-nadeshiko-blue mb-2">よくがんばったね！</h2>
            <p className="text-gray-600">毎日つづけて強くなろう！</p>
          </div>
        </div>
      )}
    </main>
  );
}
