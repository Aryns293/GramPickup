import React from 'react';
import { STATUS_COLORS } from '../../utils/status';

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
    {status}
  </span>
);

export default StatusBadge;
