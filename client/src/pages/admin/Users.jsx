import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { apiFetch } = useAuth();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [busy, setBusy]     = useState(null);

  const load = () => { setLoading(true); apiFetch('/analytics/users').then(setUsers).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This removes all their data permanently.`)) return;
    setBusy(id);
    try { await apiFetch(`/analytics/users/${id}`, { method:'DELETE' }); load(); }
    catch(e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const filtered = users.filter(u => {
    const matchRole   = filter === 'all' || u.role === filter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const roleColors = { customer:'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', shopkeeper:'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', admin:'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' };

  return (
    <div className="animate-fade-in">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{users.length} total users</p></div>

      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="input-field sm:max-w-xs"/>
        <div className="flex gap-2">
          {['all','customer','shopkeeper'].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter===r ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">{[1,2,3,4].map(i=><div key={i} className="p-5 animate-pulse"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"/><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><div className="text-4xl mb-3">👥</div><p className="font-medium text-gray-900 dark:text-white">No users found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="table-header">User</th>
                <th className="table-header hidden sm:table-cell">Phone</th>
                <th className="table-header">Role</th>
                <th className="table-header hidden md:table-cell">Joined</th>
                <th className="table-header text-right">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{u.name[0]?.toUpperCase()}</div>
                        <div><p className="font-medium text-gray-900 dark:text-white text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="table-cell hidden sm:table-cell text-gray-500 text-sm">{u.phone}</td>
                    <td className="table-cell"><span className={`badge ${roleColors[u.role]}`}>{u.role}</span></td>
                    <td className="table-cell hidden md:table-cell text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="table-cell text-right">
                      {u.role !== 'admin' && (
                        <button disabled={busy===u._id} onClick={() => handleDelete(u._id, u.name)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50 transition-colors">
                          {busy===u._id ? '…' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminUsers;
