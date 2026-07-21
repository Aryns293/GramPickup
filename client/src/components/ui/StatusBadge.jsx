import React from 'react';
import { STATUS_COLORS, STATUS_ICONS } from '../../utils/status';

const StatusBadge = ({ status, showIcon = false }) => (
  <span className={`badge ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
    {showIcon && <span className="mr-1">{STATUS_ICONS[status]}</span>}
    {status}
  </span>
);

export default StatusBadge;
