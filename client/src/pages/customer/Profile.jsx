import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, apiFetch, updateProfile } = useAuth();
  const [form, setForm]   = useState({ name:'', phone:'', password:'', confirmPassword:'' });
  const [msg, setMsg]     = useState({ text:'', ok: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name, phone: user.phone }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg({ text:'', ok:true });
    if (form.password && form.password !== form.confirmPassword)
      return setMsg({ text:'Passwords do not match.', ok:false });
    if (form.password && form.password.length < 6)
      return setMsg({ text:'Password must be at least 6 characters.', ok:false });
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setMsg({ text:'Profile updated successfully!', ok:true });
      setForm(f => ({ ...f, password:'', confirmPassword:'' }));
    } catch(e) {
      setMsg({ text: e.message, ok: false });
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your account details</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 mt-1 capitalize">{user?.role}</span>
        </div>
      </div>

      <div className="card p-6">
        {msg.text && (
          <div className={`px-4 py-3 rounded-xl text-sm mb-5 ${msg.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" disabled value={user?.email || ''} className="input-field opacity-60 cursor-not-allowed"/>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field"/>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Change Password (optional)</p>
            <div className="space-y-3">
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="input-field" placeholder="New password (min. 6 chars)"/>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
                className="input-field" placeholder="Confirm new password"/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-50 mt-2">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Profile;
