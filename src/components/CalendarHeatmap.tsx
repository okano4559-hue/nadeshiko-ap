import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Helper to determine if a date has a record
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
        <div className="mt-4">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-secondary flex items-center gap-2">
                    <span className="text-sm font-black uppercase tracking-widest">{currentDate.getFullYear()} . {currentDate.getMonth() + 1}</span>
                </h3>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-secondary transition">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-secondary transition">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="text-rose-400">Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div className="text-blue-400">Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;

                    const trained = hasRecord(date);
                    const today = isToday(date);

                    return (
                        <div
                            key={idx}
                            className={`
                        aspect-square rounded-md flex items-center justify-center relative transition-all duration-300
                        ${today ? 'ring-2 ring-primary ring-offset-2' : ''}
                        ${trained ? 'bg-secondary text-white shadow-md scale-105' : 'bg-slate-50 text-slate-300'}
                    `}
                        >
                            <span className={`text-xs font-bold ${trained ? 'text-white' : ''}`}>
                                {date.getDate()}
                            </span>
                            {trained && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-[10px] text-center text-slate-400 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Training Days</span>
            </div>
        </div>
    );
};
