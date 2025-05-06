/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({ title, value, data }: { title: string; value: string; data: any[] }) {
    return (
        <div className="w-full bg-white rounded-2xl p-6">
            <h3>{title}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>

            <div>
                <ResponsiveContainer width="100%" height={60}>
                    <AreaChart
                        width={300}
                        height={34}
                        data={data}
                    >
                        <defs>
                            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="50.74%" stopColor="rgba(0, 98, 255, 0.1)" stopOpacity="1" />
                                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0001)" stopOpacity="0.1" />
                            </linearGradient>
                        </defs>
                        <Area type="bump" dataKey="value" stroke="#3A70E2" strokeWidth={3} fillOpacity={0.8} fill="url(#gradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};