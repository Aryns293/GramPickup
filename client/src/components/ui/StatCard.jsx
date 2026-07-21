import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color = 'bg-indigo-50 dark:bg-indigo-900/30', to, trend }) => {
  const content = (
    <div className={`card p-6 h-full transition-all duration-200 ${to ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 truncate">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>{icon}</div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

export default StatCard;
