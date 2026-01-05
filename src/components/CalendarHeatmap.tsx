import { useRef, useEffect, useState } from "react";

// Checking package.json is safer, but native JS is zero-dep. I'll use native JS to be safe and avoid installation issues.
import { ChevronLeft, ChevronRight, Activity, Trophy } from "lucide-react";

type Record = {
    date: string; // YYYY-MM-DD
    score: number;
};

interface CalendarHeatmapProps {
    records: Record[];
}

export const CalendarHeatmap = ({ records }: CalendarHeatmapProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty slots for days before the first day of the month
        const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const days = getDaysInMonth(currentDate);

    const hasRecord = (date: Date) => {
        if (!date) return false;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return records.some(r => r.date === dateStr);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">{currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月</span>
                </h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-gray-400 font-bold">
                <div className="text-red-400">日</div>
                <div>月</div>
                <div>火</div>
                <div>水</div>
                <div>木</div>
                <div>金</div>
                <div className="text-blue-400">土</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;

                    const trained = hasRecord(date);
                    const today = isToday(date);

                    return (
                        <div
                            key={idx}
                            className={`
                        aspect-square rounded-lg flex items-center justify-center relative
                        ${today ? 'border-2 border-nadeshiko-blue' : ''}
                        ${trained ? 'bg-nadeshiko-blue text-white shadow-sm' : 'bg-gray-50 text-gray-400'}
                    `}
                        >
                            <span className={`text-sm font-bold ${trained ? 'text-white' : ''}`}>
                                {date.getDate()}
                            </span>
                            {trained && (
                                <div className="absolute bottom-1 right-1">
                                    {/* Small dot or icon to indicate training */}
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-xs text-center text-gray-400 flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-nadeshiko-blue rounded-sm"></div>
                <span>トレーニングした日</span>
            </div>
        </div>
    );
};
