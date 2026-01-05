"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressProps {
    data: { date: string; score: number }[];
}

export function ProgressChart({ data }: ProgressProps) {
    return (
        <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                        stroke="#e2e8f0"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => {
                            const d = new Date(value);
                            return `${d.getMonth() + 1}/${d.getDate()}`;
                        }}
                        dy={10}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                        stroke="#e2e8f0"
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#0F172A',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#E11D48" // Rose 600
                        strokeWidth={3}
                        dot={{ fill: '#0F172A', strokeWidth: 2, r: 4, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#E11D48', stroke: '#fff', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
