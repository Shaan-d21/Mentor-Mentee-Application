import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-${iconColor}/10`}>
          <Icon className={`w-6 h-6 text-${iconColor}`} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span
          className={`flex items-center text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-1" />
          )}
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;