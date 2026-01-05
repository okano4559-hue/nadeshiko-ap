"use client";

import { useState, useEffect, useRef } from "react";
import { getDailyMenu, DailyMenu } from "@/lib/menuGenerator";
import { Registration } from "@/components/Registration";
import { BottomNavigation } from "@/components/BottomNavigation";
import { TrainingTab } from "@/components/TrainingTab";
import { RecordTab } from "@/components/RecordTab";
import { RankingTab } from "@/components/RankingTab";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Record = {
  date: string;
  score: number;
};

type Tab = "training" | "record" | "ranking";

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [inputScore, setInputScore] = useState<number>(0);
  const [records, setRecords] = useState<Record[]>([]);
  const [streak, setStreak] = useState(0);

  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>("training");

  // Record Editing State
  const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(null);
  const [editScoreValue, setEditScoreValue] = useState<number>(0);

  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer State
  const [timerPhase, setTimerPhase] = useState<"IDLE" | "PREP" | "WORK" | "FINISHED">("IDLE");
  const [timeLeft, setTimeLeft] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Load data
    const storedName = localStorage.getItem("nadeshiko_user_name");
    let storedRecords = JSON.parse(localStorage.getItem("nadeshiko_records") || "[]");

    // DATA MIGRATION: Convert "Jan 5" to "2024-01-05"
    let hasChanges = false;
    const currentYear = new Date().getFullYear();
    storedRecords = storedRecords.map((r: Record) => {
      if (!r.date.includes("-")) {
        // Assume format is "MMM D" e.g. "Jan 5"
        const d = new Date(`${r.date} ${currentYear}`);
        if (!isNaN(d.getTime())) {
          hasChanges = true;
          return {
            ...r,
            date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          };
        }
      }
      return r;
    });

    if (hasChanges) {
      localStorage.setItem("nadeshiko_records", JSON.stringify(storedRecords));
    }

    // STREAK CALCULATION
    const dates = Array.from(new Set(storedRecords.map((r: Record) => r.date))).sort().reverse() as string[];
    let currentStreak = 0;
    if (dates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Check if the most recent record is today or yesterday
      if (dates[0] === today) {
        currentStreak = 1;
        // Check backwards
        let checkDate = new Date();
        for (let i = 1; i < dates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const expected = checkDate.toISOString().split('T')[0];
          if (dates.some(d => d === expected)) currentStreak++;
          else break;
        }
      } else if (dates[0] === yesterday) {
        currentStreak = 1;
        let checkDate = new Date(Date.now() - 86400000); // start from yesterday
        for (let i = 1; i < dates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1);
          const expected = checkDate.toISOString().split('T')[0];
          if (dates.some(d => d === expected)) currentStreak++;
          else break;
        }
      } else {
        currentStreak = 0;
      }

      // Retry strict logic if simplified check failed (kept for safety)
      // ... (omitted redundant retry logic for brevity as it was already complex)
    }

    setStreak(currentStreak);
    setUserName(storedName);
    setRecords(storedRecords);
    setMenu(getDailyMenu());
    setLoading(false);
  }, []);

  // Audio Context Logic
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playBeep = (freq: number, duration: number) => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;

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

  // Timer Sound Effect Monitor
  useEffect(() => {
    if (timerPhase === "PREP") {
      // Play beep on countdown: 3, 2, 1
      if (timeLeft > 0 && timeLeft <= 3) {
        playBeep(440, 0.1);
      }
    }
    // Note: Start beep (0/transition) is handled when switching to WORK or via this effect if we can catch it?
    // Actually, when switching to WORK, timeLeft becomes 600 immediately.
    // So we can check: if timerPhase becomes "WORK" and timeLeft is full (600), play start sound.
  }, [timerPhase, timeLeft]);

  // Handle WORK start sound specifically
  useEffect(() => {
    if (timerPhase === "WORK" && timeLeft === 600) {
      playBeep(880, 0.6); // High pitch for START
    }
  }, [timerPhase, timeLeft]);

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
      // playBeep call removed from here, handled by useEffect above
    } else if (timerPhase === "WORK" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Last 5 seconds sound effect
          if (prev <= 6 && prev > 1) {
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

  const handleStartTimer = () => {
    initAudio(); // Initialize audio context on user gesture
    setTimerPhase("PREP");
    setTimeLeft(3); // 3 seconds prep
  };

  const handleRegister = (name: string) => {
    setUserName(name);
    localStorage.setItem("nadeshiko_user_name", name);
  };

  const handleNameEditStart = () => {
    setTempName(userName || "");
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      localStorage.setItem("nadeshiko_user_name", tempName);
    }
    setIsEditingName(false);
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputScore <= 0) return;

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const newRecord = {
      date: dateStr,
      score: inputScore,
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    localStorage.setItem("nadeshiko_records", JSON.stringify(updatedRecords));

    // Update streak logic
    const alreadyRecordedToday = records.some(r => r.date === dateStr);
    if (!alreadyRecordedToday) {
      // Simple increment if yesterday exists
      const yesterday = new Date(Date.now() - 86400000);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      const hasYesterday = records.some(r => r.date === yesterdayStr);

      if (hasYesterday) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1);
      }
    }

    setShowFeedback(true);
    setInputScore(0);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  // Record Management (Delete)
  const handleDeleteRecord = (indexToDelete: number) => {
    if (confirm("本当にこの記録を削除しますか？")) {
      const updatedRecords = records.filter((_, idx) => idx !== indexToDelete);
      setRecords(updatedRecords);
      localStorage.setItem("nadeshiko_records", JSON.stringify(updatedRecords));

      if (editingRecordIndex === indexToDelete) {
        setEditingRecordIndex(null);
      }
    }
  };

  // Record Management (Edit Start)
  const handleEditRecordStart = (index: number, currentScore: number) => {
    setEditingRecordIndex(index);
    setEditScoreValue(currentScore);
  };

  // Record Management (Edit Save)
  const handleEditRecordSave = (index: number) => {
    if (editScoreValue < 0) return;

    const updatedRecords = [...records];
    updatedRecords[index] = { ...updatedRecords[index], score: editScoreValue };

    setRecords(updatedRecords);
    localStorage.setItem("nadeshiko_records", JSON.stringify(updatedRecords));
    setEditingRecordIndex(null);
  };

  // Fixed Increment/Decrement Logic
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
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

  // Calculated Stats for Ranking
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  // Get max score for today, default to 0
  const todayRecords = records.filter(r => r.date === todayStr);
  const todayScore = todayRecords.length > 0 ? Math.max(...todayRecords.map(r => r.score)) : 0;


  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
    </div>
  );

  if (!userName) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Registration onRegister={handleRegister} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 relative font-sans text-slate-900 selection:bg-rose-200">

      {/* Content Area with Animations */}
      <div className="max-w-md mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === "training" && (
            <motion.div
              key="training"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="pt-6"
            >
              <TrainingTab
                userName={userName}
                isEditingName={isEditingName}
                tempName={tempName}
                setTempName={setTempName}
                setIsEditingName={setIsEditingName}
                handleNameSave={handleNameSave}
                handleNameEditStart={handleNameEditStart}
                timerPhase={timerPhase}
                timeLeft={timeLeft}
                formatTime={formatTime}
                handleStartTimer={handleStartTimer}
                setTimerPhase={setTimerPhase}
                menu={menu}
              />
            </motion.div>
          )}

          {activeTab === "record" && (
            <motion.div
              key="record"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RecordTab
                records={records}
                streak={streak}
                inputScore={inputScore}
                setInputScore={setInputScore}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onSubmit={handleRecordSubmit}
                onDelete={handleDeleteRecord}
                editingRecordIndex={editingRecordIndex}
                setEditingRecordIndex={setEditingRecordIndex}
                editScoreValue={editScoreValue}
                setEditScoreValue={setEditScoreValue}
                onEditStart={handleEditRecordStart}
                onEditSave={handleEditRecordSave}
              />
            </motion.div>
          )}

          {activeTab === "ranking" && (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <RankingTab
                userName={userName}
                userScore={todayScore}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Feedback Modal / Overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white p-8 rounded-3xl shadow-2xl text-center w-full max-w-xs relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <Trophy className="mx-auto text-yellow-500 mb-4 h-20 w-20 drop-shadow-lg animate-bounce" />
              <h2 className="text-3xl font-black text-secondary mb-2 italic">GREAT JOB!</h2>
              <p className="text-slate-500 font-bold">その調子で強くなれ！</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
