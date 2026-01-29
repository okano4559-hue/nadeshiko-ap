"use client";

import { useState, useEffect, useRef } from "react";
import { getDailyMenu, TrainingItem } from "@/lib/menuGenerator";
import { Registration } from "@/components/Registration";
import { BottomNavigation } from "@/components/BottomNavigation";
import { TrainingTab } from "@/components/TrainingTab";
import { RecordTab } from "@/components/RecordTab";
import { RankingTab } from "@/components/RankingTab";
import { ResultModal } from "@/components/ResultModal"; // New Import
import { getRank } from "@/lib/utils"; // New Import
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { supabase } from "@/lib/supabase";
import { TrainingRecord, StampType } from "@/lib/types";
import { StampAnimation } from "@/components/StampAnimation";
import { Toast } from "@/components/Toast";

// Use Shared Type
type Record = TrainingRecord;

type Tab = "training" | "record" | "ranking";

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const [menu, setMenu] = useState<TrainingItem[] | null>(null);
  const [inputScore, setInputScore] = useState<number>(0);
  const [records, setRecords] = useState<Record[]>([]);
  const [streak, setStreak] = useState(0);
  const [userId, setUserId] = useState<string>("");

  // Feedback State
  const [lastStamp, setLastStamp] = useState<StampType>(null);
  const [showStampAnim, setShowStampAnim] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>("training");

  // Record Editing State
  const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(null);
  const [editScoreValue, setEditScoreValue] = useState<number>(0);

  const [showResultModal, setShowResultModal] = useState(false); // New State
  const [latestRecordScore, setLatestRecordScore] = useState(0); // New State

  const [loading, setLoading] = useState(true);

  // Timer State
  const [timerPhase, setTimerPhase] = useState<"IDLE" | "PREP" | "WORK" | "FINISHED">("IDLE");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Load data
    // Load User ID or Create one
    let currentUserId = localStorage.getItem("nadeshiko_user_id");
    if (!currentUserId) {
      currentUserId = crypto.randomUUID();
      localStorage.setItem("nadeshiko_user_id", currentUserId);
    }
    setUserId(currentUserId);

    // Initial Data Load (Hybrid: LocalStorage first, then Supabase)
    const storedName = localStorage.getItem("nadeshiko_user_name");
    let storedRecords = JSON.parse(localStorage.getItem("nadeshiko_records") || "[]");

    // FETCH SUPABASE DATA
    const fetchSupabaseData = async () => {
      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .eq('user_name', storedName) // Corrected to use user_name
        .order('date', { ascending: true }); // We sort ascending for streak calc usually, but UI might reverse

      if (data && !error && data.length > 0) {
        setRecords(data as Record[]);
      } else {
        // Fallback to LocalStorage if Supabase is empty
        setRecords(storedRecords);
      }
    };
    fetchSupabaseData();

    // DATA MIGRATION: Convert "Jan 5" to "2024-01-05"
    let hasChanges = false;
    const currentYear = new Date().getFullYear();
    // (We keep the rest of existing useEffect logic roughly same but adapted)
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


    // Subscribe to Realtime
    const channel = supabase
      .channel('player_channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'training_records', filter: `user_name=eq.${storedName}` },
        (payload) => {
          const newRecord = payload.new as Record;
          // Check if stamp changed
          if (newRecord.stamp_type) {
            // Trigger Confetti
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#fb7185', '#f472b6', '#fbbf24', '#ffffff'] // Nadeshiko pinks/golds
            });

            setLastStamp(newRecord.stamp_type);
            setShowStampAnim(true);
            setToastMsg(`パパからスタンプが届いたよ！ ${getStampEmoji(newRecord.stamp_type)}`);
            setShowToast(true);
          }
          // Update Local State
          setRecords(prev => prev.map(r => r.id === newRecord.id ? newRecord : r));
        }
      )
      .subscribe();

    setStreak(0); // Recalculated later or from DB
    // ... logic to calc streak from 'records' state whenever it changes ...

    setUserName(storedName);
    setMenu(getDailyMenu());
    setLoading(false);

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Effect to recalculate Streak when records change
  useEffect(() => {
    if (records.length === 0) { setStreak(0); return; }

    const dates = Array.from(new Set(records.map(r => r.date))).sort().reverse();
    // ... (Existing Streak Logic reused) ...
    // Simplified implementation for brevity in replacement:
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let s = 0;
    if (dates.includes(today)) {
      s = 1;
      let d = new Date();
      while (true) {
        d.setDate(d.getDate() - 1);
        if (dates.includes(d.toISOString().split('T')[0])) s++;
        else break;
      }
    } else if (dates.includes(yesterday)) {
      s = 1;
      let d = new Date(Date.now() - 86400000);
      while (true) {
        d.setDate(d.getDate() - 1);
        if (dates.includes(d.toISOString().split('T')[0])) s++;
        else break;
      }
    }
    setStreak(s);
  }, [records]);

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

  const playTripleBeep = () => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      [0, 0.15, 0.3].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(880, now + offset);
        gain.gain.setValueAtTime(0.1, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch (e) { console.error(e); }
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

    if (isPaused) return;

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
          const nextTime = prev - 1;

          // 1. Every 1 min chime (except start, end, and last min)
          // Range: 540(9m), 480(8m) ... 120(2m).
          if (nextTime > 60 && nextTime < 600 && nextTime % 60 === 0) {
            playBeep(440, 0.2); // "Pon"
          }

          // 2. Last 1 minute Warning (60s)
          if (nextTime === 60) {
            playTripleBeep(); // "Pi-pi-pi!"
          }

          // 3. Last 10 seconds (Existing & Refined)
          // Original: if (prev <= 6 && prev > 1) -> plays at 5,4,3,2
          if (nextTime <= 5 && nextTime > 0) {
            playBeep(880, 0.1);
          }
          // Long beep at finish
          if (nextTime === 0) {
            playBeep(880, 0.6);
          }

          return nextTime;
        });
      }, 1000);
    } else if (timerPhase === "WORK" && timeLeft === 0) {
      setTimerPhase("FINISHED");
    }

    return () => clearInterval(interval);
  }, [timerPhase, timeLeft, isPaused]);

  const handleStartTimer = () => {
    initAudio(); // Initialize audio context on user gesture
    setIsPaused(false);
    setTimerPhase("PREP");
    setTimeLeft(3); // 3 seconds prep
  };

  const togglePause = () => {
    if (timerPhase === "WORK") {
      setIsPaused(prev => !prev);
    }
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

    const newRecord: Record = {
      user_name: userName!, // Use userName (assert non-null as guards exist)
      date: dateStr,
      score: inputScore,
      streak: streak, // Ideally calculated accurately
    };

    // Save to Supabase
    supabase.from('training_records').insert([newRecord]).select().then(({ data }) => {
      if (data && data[0]) {
        const saved = data[0] as Record;
        setRecords(prev => [...prev, saved]);
      } else {
        // Offline fallback
        setRecords(prev => [...prev, newRecord]);
      }
    });

    // Keep LocalStorage as backup
    const updatedRecords = [...records, newRecord];
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

    setShowResultModal(true); // Updated to show new modal
    setLatestRecordScore(inputScore);
    setInputScore(0);
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

  // Calculate Total Score & Rank
  const totalScore = records.reduce((acc, r) => acc + r.score, 0);
  const totalStamps = records.filter(r => r.stamp_type).length;
  const currentRank = getRank(totalScore);


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
                rank={currentRank} // Pass calculated rank
                timerPhase={timerPhase}
                timeLeft={timeLeft}
                formatTime={formatTime}
                handleStartTimer={handleStartTimer}
                setTimerPhase={setTimerPhase}
                isPaused={isPaused}
                togglePause={togglePause}
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
                streak={streak}
                totalScore={totalScore}
                totalStamps={totalStamps}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Result Celebration Modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        score={latestRecordScore}
        streak={streak}
        rank={currentRank}
      />
      <StampAnimation
        stamp={lastStamp}
        isVisible={showStampAnim}
        onComplete={() => setShowStampAnim(false)}
      />
      <Toast
        message={toastMsg}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </main>
  );
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
