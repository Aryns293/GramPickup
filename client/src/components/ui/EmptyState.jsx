import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon = '📭', title, description, action, actionTo, onAction }) => (
  <div className="text-center py-20 px-6">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 mb-6">{description}</p>}
    {action && actionTo && <Link to={actionTo} className="btn-primary">{action}</Link>}
    {action && onAction && <button onClick={onAction} className="btn-primary">{action}</button>}
  </div>
);

export default EmptyState;
