"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// I'll make it self-contained style
interface ProgressProps {
    data: { date: string; score: number }[];
}

export function ProgressChart({ data }: ProgressProps) {
    return (
        <div className="w-full bg-white p-4 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-nadeshiko-blue mb-4">トレーニングのきろく</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#666' }}
                            stroke="#ccc"
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#666' }}
                            stroke="#ccc"
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#000555"
                            strokeWidth={3}
                            dot={{ fill: '#B11F24', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#B11F24' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
