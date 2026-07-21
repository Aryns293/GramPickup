import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'', role:'customer' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const data = await register(formData.name, formData.email, formData.phone, formData.password, formData.role);
      navigate(data.role === 'shopkeeper' ? '/shopkeeper/dashboard' : '/customer/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true); setError('');
      try {
        const API = import.meta.env.VITE_API_URL || '/api';
        const res = await fetch(`${API}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem('grampickup_user', JSON.stringify(data));
        window.location.href = '/customer/dashboard';
      } catch (err) {
        setError(err.message || 'Google sign-in failed.');
      } finally { setGoogleLoading(false); }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 animate-fade-in px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join GramPickup — it's free</p>
        </div>

        <div className="card p-8 shadow-xl shadow-gray-100 dark:shadow-none">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-5 flex gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <button onClick={() => handleGoogle()} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 font-medium text-sm text-gray-700 dark:text-gray-200 shadow-sm mb-5 disabled:opacity-50">
            <GoogleIcon />
            {googleLoading ? 'Signing up…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
            <span className="text-xs text-gray-400 font-medium">or register with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"/>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-5 p-1 bg-gray-50 dark:bg-gray-800 gap-1">
            {['customer','shopkeeper'].map(r => (
              <button key={r} type="button" onClick={() => setFormData({...formData, role:r})}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${
                  formData.role === r ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {r === 'customer' ? '📦 Customer' : '🏪 Shopkeeper'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {[
              {id:'name',  label:'Full Name',   type:'text',  ph:'Ramesh Singh'},
              {id:'email', label:'Email',        type:'email', ph:'you@example.com'},
              {id:'phone', label:'Phone',        type:'tel',   ph:'9876543210'},
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                <input type={f.type} name={f.id} required value={formData[f.id]} onChange={onChange} className="input-field" placeholder={f.ph} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Password</label>
              <input type="password" name="password" required minLength={6} value={formData.password} onChange={onChange} className="input-field" placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={onChange} className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1 text-base disabled:opacity-50">
              {loading ? 'Creating account…' : `Register as ${formData.role === 'customer' ? 'Customer' : 'Shopkeeper'}`}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
