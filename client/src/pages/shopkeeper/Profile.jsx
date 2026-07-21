import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ShopkeeperProfile = () => {
  const { user, apiFetch, updateProfile, syncShopContext } = useAuth();
  const [userForm, setUserForm] = useState({ name:'', phone:'', password:'', confirmPassword:'' });
  const [shopForm, setShopForm] = useState({ shopName:'', address:'', city:'', phone:'' });
  const [shop, setShop]         = useState(null);
  const [userMsg, setUserMsg]   = useState({ text:'', ok:true });
  const [shopMsg, setShopMsg]   = useState({ text:'', ok:true });
  const [userLoading, setUserLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);

  useEffect(() => {
    if (user) setUserForm(f => ({ ...f, name: user.name, phone: user.phone }));
    apiFetch('/shops/mine').then(s => {
      setShop(s);
      if (s) setShopForm({ shopName: s.shopName, address: s.address, city: s.city, phone: s.phone || '' });
    }).catch(() => setShop(null));
  }, [user]);

  const handleUserSubmit = async (e) => {
    e.preventDefault(); setUserMsg({ text:'', ok:true });
    if (userForm.password && userForm.password !== userForm.confirmPassword)
      return setUserMsg({ text:'Passwords do not match.', ok:false });
    setUserLoading(true);
    try {
      const payload = { name: userForm.name, phone: userForm.phone };
      if (userForm.password) payload.password = userForm.password;
      await updateProfile(payload);
      setUserMsg({ text:'Profile updated!', ok:true });
      setUserForm(f => ({ ...f, password:'', confirmPassword:'' }));
    } catch(e) { setUserMsg({ text: e.message, ok:false }); }
    finally { setUserLoading(false); }
  };

  const handleShopSubmit = async (e) => {
    e.preventDefault(); setShopMsg({ text:'', ok:true });
    setShopLoading(true);
    try {
      let s;
      if (shop) s = await apiFetch('/shops/mine', { method:'PUT', body: JSON.stringify(shopForm) });
      else       s = await apiFetch('/shops', { method:'POST', body: JSON.stringify(shopForm) });
      setShop(s); syncShopContext(s);
      setShopMsg({ text: shop ? 'Shop updated!' : 'Shop registered! Awaiting admin approval.', ok:true });
    } catch(e) { setShopMsg({ text: e.message, ok:false }); }
    finally { setShopLoading(false); }
  };

  const statusColors = {
    approved: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    pending:  'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="animate-fade-in max-w-lg space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Shop</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account and shop details</p>
      </div>

      {/* User card */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {shop && <span className={`badge mt-1 ${statusColors[shop.verificationStatus]}`}>{shop.verificationStatus}</span>}
        </div>
      </div>

      {/* Profile form */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Account Details</h2>
        {userMsg.text && <div className={`px-4 py-3 rounded-xl text-sm mb-4 ${userMsg.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>{userMsg.text}</div>}
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div><label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
            <input type="text" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="input-field"/></div>
          <div><label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Phone</label>
            <input type="tel" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="input-field"/></div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Change Password</p>
            <div className="space-y-3">
              <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="input-field" placeholder="New password"/>
              <input type="password" value={userForm.confirmPassword} onChange={e => setUserForm({...userForm, confirmPassword: e.target.value})} className="input-field" placeholder="Confirm password"/>
            </div>
          </div>
          <button type="submit" disabled={userLoading} className="btn-primary w-full disabled:opacity-50">{userLoading ? 'Saving…' : 'Save Profile'}</button>
        </form>
      </div>

      {/* Shop form */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">{shop ? 'Shop Details' : 'Register Your Shop'}</h2>
        {shopMsg.text && <div className={`px-4 py-3 rounded-xl text-sm mb-4 ${shopMsg.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>{shopMsg.text}</div>}
        <form onSubmit={handleShopSubmit} className="space-y-4">
          {[
            { id:'shopName', label:'Shop Name',   ph:'Patel Kirana & General Store' },
            { id:'city',     label:'City',         ph:'Korai' },
            { id:'address',  label:'Full Address', ph:'Shop No. 5, Main Chowk…' },
            { id:'phone',    label:'Shop Phone',   ph:'9876543210' },
          ].map(f => (
            <div key={f.id}>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{f.label}</label>
              <input type="text" required value={shopForm[f.id]} onChange={e => setShopForm({...shopForm, [f.id]: e.target.value})} className="input-field" placeholder={f.ph}/>
            </div>
          ))}
          <button type="submit" disabled={shopLoading} className="btn-primary w-full disabled:opacity-50">
            {shopLoading ? 'Saving…' : shop ? 'Update Shop' : 'Register Shop'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ShopkeeperProfile;
