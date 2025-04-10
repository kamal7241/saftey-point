import { ReactNode } from "react";

interface StatsCardProps {
    icon: ReactNode;
    color: string;
    number: number;
    name: string;
}

const StatsCard = ({ icon, color, number, name }: StatsCardProps) => {
    return (
        <div className={`flex items-center gap-4 rounded-2xl bg-white px-2.5 py-3 text-${color}-700`}>
            <span className={`rounded-xl p-4 flex aspect-square bg-${color}-300`}>
                <span className="w-6 inline-block">{icon}</span>
            </span>
            <div>
                <p className="text-2xl font-bold">{number}</p>
                <p className="text-black-100 capitalize">{name}</p>
            </div>
        </div>
    );
};

export default StatsCard;