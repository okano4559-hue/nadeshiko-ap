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
  const [inputScore, setInputScore] = useState<number>(0); // Changed to number for stepper
  const [records, setRecords] = useState<Record[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data
    const storedName = localStorage.getItem("nadeshiko_user_name");
    const storedRecords = JSON.parse(localStorage.getItem("nadeshiko_records") || "[]");

    setUserName(storedName);
    setRecords(storedRecords);
    setMenu(getDailyMenu());
    setLoading(false);
  }, []);

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

  const handleIncrement = () => setInputScore(prev => prev + 1);
  const handleDecrement = () => setInputScore(prev => Math.max(0, prev - 1));


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
