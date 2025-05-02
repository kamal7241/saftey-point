"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function BarChartComponent({ title }: { title: string }) {
    const data = [
        { month: 'Jan', Applied: 19, Left: 16 },
        { month: 'Feb', Applied: 15, Left: 8 },
        { month: 'Mar', Applied: 24, Left: 14 },
        { month: 'Apr', Applied: 9, Left: 8 },
        { month: 'May', Applied: 11, Left: 7 },
        { month: 'Jun', Applied: 10, Left: 7 },
        { month: 'Jul', Applied: 18, Left: 13 },
        { month: 'Aug', Applied: 17, Left: 12 },
        { month: 'Sep', Applied: 13, Left: 11 },
        { month: 'Oct', Applied: 12, Left: 10 },
        { month: 'Nov', Applied: 16, Left: 9 },
        { month: 'Dec', Applied: 23, Left: 14 },
    ];

    return (
        <div className="w-full h-[375px] bg-white rounded-2xl">
            <div className="border-b border-b-[#EEF0F6] p-6 flex justify-between items-center">
                <h3 className="text-gray-600 font-medium">{title}</h3>
                <ul className="flex gap-3">
                    <li><span className="size-2 rounded-full bg-[#6F52ED] inline-block mx-3" />Applied</li>
                    <li><span className="size-2 rounded-full bg-[#FF7A00] inline-block mx-3" />Left</li>
                </ul>
            </div>

            <div style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={750}
                        height={300}
                        data={data}
                        margin={{
                            top: 25,
                            bottom: 25,
                        }}
                    >
                        <CartesianGrid strokeDasharray="6" stroke="#EDEFF5" vertical={false} syncWithTicks={false} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#B7B9BB' }} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#B7B9BB' }} />
                        <Bar dataKey="Applied" fill="#6F52ED" name="Applied" barSize={5} radius={5} />
                        <Bar dataKey="Left" fill="#FF7A00" name="Left" barSize={5} radius={5} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};