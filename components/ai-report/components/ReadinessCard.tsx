import { ReactNode } from 'react';

interface ReadinessCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  description: string;
}

export function ReadinessCard({ icon, title, value, description }: ReadinessCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <div className="font-medium text-gray-800 text-sm px-2">{title}</div>
      <div className="text-sm font-bold text-gray-900 my-1 ">{value}</div>
      <div className="text-xs text-blue-500/70">{description}</div>
    </div>
  );
} 