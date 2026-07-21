import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/ui';
import { formatDateTime } from '../utils/format';

const ICON_MAP = {
  'Fee':       '💰',
  'Ready':     '🔑',
  'Arrived':   '📦',
  'Delivered': '✅',
  'approved':  '🎉',
  'rejected':  '❌',
};

const getIcon = (title = '') => {
  for (const [k, v] of Object.entries(ICON_MAP)) {
    if (title.includes(k)) return v;
  }
  return '🔔';
};

const Notifications = () => {
  const { apiFetch }          = useAuth();
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = () => {
    setLoading(true);
    apiFetch('/notifications').then(setNotifs).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const markOne = async (id) => {
    try { await apiFetch(`/notifications/${id}/read`, { method:'PUT', body:'{}' }); load(); }
    catch(e) { console.error(e); }
  };

  const markAll = async () => {
    setMarking(true);
    try { await apiFetch('/notifications/read-all', { method:'PUT', body:'{}' }); load(); }
    catch(e) { console.error(e); }
    finally { setMarking(false); }
  };

  const unread = notifs.filter(n => !n.readStatus).length;

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm mt-0.5">
            {unread > 0
              ? <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{unread} unread</span>
              : <span className="text-gray-400 dark:text-gray-500">All caught up ✓</span>}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} disabled={marking} className="btn-secondary text-sm disabled:opacity-50">
            {marking ? '…' : 'Mark all as read'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="card p-5 animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0"/>
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2"/>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full"/>
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-2/3"/>
              </div>
            </div>
          ))}
        </div>
      ) : notifs.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🔔"
            title="No notifications yet"
            description="Updates about your parcels will appear here."
          />
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => (
            <div key={n._id}
              onClick={() => { if (!n.readStatus) markOne(n._id); }}
              className={`card p-4 sm:p-5 flex gap-4 cursor-pointer transition-all duration-150 hover:shadow-md ${
                !n.readStatus
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-900/10'
                  : 'opacity-75 hover:opacity-100'
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                !n.readStatus ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {getIcon(n.title)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className={`text-sm font-semibold leading-tight ${
                    !n.readStatus ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {n.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!n.readStatus && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"/>
                    )}
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
