/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';

const data = [
    { name: 'Groups of 20 students', value: 20, color: '#6F52ED' },
    { name: 'Groups of 10 students', value: 20, color: '#FFB800' },
    { name: 'Groups of 5 students', value: 15, color: '#FF4C61' },
    { name: 'Individual sessions', value: 7, color: '#33D69F' },
];

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
            </text>

            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export default function PieChartComponent() {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_:any, index:number) => {
        setActiveIndex(index);
    };

    return (
        <div className="w-full bg-white rounded-2xl p-6">
            <h3>Students by type of studying</h3>
            <div className="relative">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart width={300} height={300}>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            blendStroke
                            onMouseEnter={onPieEnter}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
            </div>

            <ul className="list-disc pl-5">
                {data.map((entry, index) => (
                    <li key={`list-${index}`} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </li>
                ))}
            </ul>
        </div>
    );
}