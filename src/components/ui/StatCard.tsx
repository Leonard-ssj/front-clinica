import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="text-blue-600 w-12 h-12">
                {icon}
            </div>
            <div>
                <h5 className="text-2xl font-semibold text-gray-900">{value}</h5>
                <p className="font-semibold text-gray-900">{title}</p>
            </div>
        </div>
    );
}
