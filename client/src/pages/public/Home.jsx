import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <div className="text-center py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          🌾 Trusted by rural India
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-5 leading-tight">
          Your parcel waits at
          <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
            your local kirana store.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          No more waiting home all day. No more missed deliveries.
          Your online orders go to a trusted nearby shop — you collect whenever you want.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-3">
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'shopkeeper' ? '/shopkeeper/dashboard' : '/customer/dashboard'}
              className="btn-primary px-8 py-3 text-base">
              Go to My Dashboard →
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">Get started free</Link>
            <Link to="/login"    className="btn-secondary px-8 py-3 text-base">Sign in</Link>
          </div>
        )}
      </div>

      {/* How it works — 3 steps */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-10 text-center">
          3 simple steps
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {[
            { n:'01', icon:'📦', title:'Order as usual',        desc:'Shop anywhere online. When asked for a delivery address, use your nearby GramPickup store.' },
            { n:'02', icon:'🔔', title:'Get notified on arrival', desc:'We let you know the moment your parcel reaches the shop. Track everything from the app.' },
            { n:'03', icon:'🤝', title:'Collect at your convenience', desc:'Show your private pickup code at the shop and walk out with your parcel. Any time. Any day.' },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <div className="text-3xl font-black text-indigo-100 dark:text-indigo-900 mb-3 select-none">{s.n}</div>
              <div className="text-2xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-10 text-center">
          Why GramPickup
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon:'😌', title:'No more waiting at home',    desc:"Your parcel is safe at the shop. You never have to rearrange your day for a delivery again." },
            { icon:'💸', title:'No re-delivery charges',     desc:"One successful delivery every time. No failed attempts, no extra fees, no return headache." },
            { icon:'🔒', title:'Only you can collect',       desc:"A unique pickup code is generated for each parcel. No code, no parcel — it is that simple." },
            { icon:'📍', title:'Always know where it is',    desc:"Real-time status updates. See exactly when your parcel arrives, and when it is ready." },
            { icon:'⭐', title:'Trusted local shops',        desc:"Every pickup shop is reviewed and approved. You always know your parcel is in good hands." },
            { icon:'💰', title:'Small, transparent fee',     desc:"You only pay storage — ₹10 when it arrives, ₹2 per extra day. That is all. No surprises." },
          ].map((f) => (
            <div key={f.title} className="card p-5 flex gap-4 hover:shadow-md transition-all duration-200">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For shopkeepers */}
      {!user && (
        <div className="py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="card p-8 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-indigo-200 dark:border-indigo-800 max-w-2xl mx-auto text-center">
            <div className="text-3xl mb-3">🏪</div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Own a shop? Earn from every parcel.</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-md mx-auto">
              Join as a shopkeeper. Accept parcels for your neighbours, earn a storage fee, and build your community reputation.
            </p>
            <Link to="/register" className="btn-primary px-8">Register your shop</Link>
          </div>
        </div>
      )}

      {/* CTA */}
      {!user && (
        <div className="py-16 border-t border-gray-200 dark:border-gray-800 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Ready to stop missing deliveries?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Free to join. Takes 2 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary px-8 py-3">Create free account</Link>
            <Link to="/about"    className="btn-secondary px-8 py-3">Learn more</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
