import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Benefit = ({ icon, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-2xl flex-shrink-0">{icon}</div>
    <div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4">
        <span className="font-medium text-gray-900 dark:text-white text-sm">{q}</span>
        <span className={`text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <p className="text-sm text-gray-500 dark:text-gray-400 pb-4 leading-relaxed">{a}</p>}
    </div>
  );
};

const About = () => (
  <div className="animate-fade-in">

    {/* Hero */}
    <div className="text-center py-16 sm:py-20 mb-4">
      <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
        🌾 Built for rural India
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-5 leading-tight max-w-2xl mx-auto">
        Stop missing deliveries.
        <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
          Collect on your time.
        </span>
      </h1>
      <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
        GramPickup sends your online orders to a trusted local shop near you.
        Pick them up whenever you are free — morning, evening, whenever.
        No more waiting at home. No more failed deliveries.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/register" className="btn-primary px-8 py-3 text-base">Start for free</Link>
        <Link to="/login" className="btn-secondary px-8 py-3 text-base">Sign in</Link>
      </div>
    </div>

    {/* Stats strip */}
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16">
      {[
        { n: '₹0',  label: 'to join' },
        { n: '100%', label: 'verified shops' },
        { n: '24/7', label: 'track your parcel' },
      ].map(s => (
        <div key={s.label} className="card p-5 text-center">
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">{s.n}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
        </div>
      ))}
    </div>

    {/* The problem — relatable, plain language */}
    <div className="max-w-2xl mx-auto mb-16">
      <div className="card p-8">
        <div className="text-4xl mb-4">😤</div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3">Sound familiar?</h2>
        <div className="space-y-3">
          {[
            'You ordered something online and waited all day — but nobody showed up.',
            'The delivery app says "delivered" but you never got your package.',
            "You're away at work and can't be home when the courier comes.",
            'You had to make a long trip to a faraway courier office just to collect your own parcel.',
          ].map((t, i) => (
            <div key={i} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-400">
              <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">✗</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            GramPickup fixes this — without changing how you shop online.
          </p>
        </div>
      </div>
    </div>

    {/* How it works — plain language */}
    <div className="max-w-2xl mx-auto mb-16">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8 text-center">
        How GramPickup works
      </p>
      <div className="space-y-4">
        {[
          {
            step: '1',
            icon: '🛍️',
            title: 'Place your order as usual',
            desc: 'Shop on Amazon, Flipkart, Meesho — wherever you normally shop. When asked for a delivery address, use the address of your nearby GramPickup shop instead of your home.',
          },
          {
            step: '2',
            icon: '🏪',
            title: 'Your parcel goes to the shop',
            desc: 'The shopkeeper receives your parcel, keeps it safe, and lets you know it has arrived. You can pick it up any time — today, tomorrow, next week. The shop is always open and your parcel is always waiting.',
          },
          {
            step: '3',
            icon: '🤝',
            title: 'You collect it when ready',
            desc: 'Walk to the shop, show your pickup code from the app, and take your parcel. That\'s it. No waiting. No missed delivery. No extra trip to a courier office far away.',
          },
        ].map((s) => (
          <div key={s.step} className="card p-6 flex gap-5">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">{s.step}</div>
            </div>
            <div>
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Benefits for customers */}
    <div className="max-w-2xl mx-auto mb-16">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8 text-center">
        Why customers love it
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { icon:'😌', title:'No more waiting at home',     desc:"Your parcel is held safely at the shop. You don't have to be home at a specific time or rearrange your day for a delivery." },
          { icon:'💸', title:'Save money on re-deliveries', desc:"Couriers charge for second and third attempts. With GramPickup, there is only one delivery — and it always succeeds." },
          { icon:'📍', title:'Always know where it is',     desc:"Open the app anytime to see exactly where your parcel is and what its current status is. No guessing." },
          { icon:'🔒', title:'Only you can collect it',     desc:"We send you a unique pickup code when your parcel is ready. The shopkeeper will not hand it over to anyone without it." },
        ].map(b => <Benefit key={b.title} {...b} />)}
      </div>
    </div>

    {/* For shopkeepers */}
    <div className="max-w-2xl mx-auto mb-16">
      <div className="card p-8 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-indigo-200 dark:border-indigo-800">
        <div className="text-3xl mb-3">🏪</div>
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Own a shop? Earn extra.</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
          Join GramPickup as a pickup point. You receive parcels on behalf of customers,
          store them safely, and earn a small storage fee for each one. More foot traffic,
          more income — with no upfront cost to join.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { v: '₹10', l: 'per parcel received' },
            { v: '₹2',  l: 'extra per day stored' },
            { v: '⭐',  l: 'build your reputation' },
          ].map(s => (
            <div key={s.l} className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-indigo-100 dark:border-indigo-800">
              <p className="font-black text-indigo-600 dark:text-indigo-400 text-xl">{s.v}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{s.l}</p>
            </div>
          ))}
        </div>
        <Link to="/register" className="btn-primary w-full sm:w-auto text-center block sm:inline-block">
          Register your shop →
        </Link>
      </div>
    </div>

    {/* Trust — no jargon */}
    <div className="max-w-2xl mx-auto mb-16">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8 text-center">
        Your safety matters
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon:'🛡️', title:'Verified shops only',    desc:'Every shop on GramPickup has been reviewed and approved before going live. No unverified shops on our platform.' },
          { icon:'🔒', title:'Private pickup codes',    desc:'Your unique code is never shared publicly. Only you can see it in your account. No code, no parcel.' },
          { icon:'📲', title:'Instant alerts',          desc:'You get notified the moment your parcel arrives at the shop, and again when it is ready for pickup.' },
        ].map(t => (
          <div key={t.title} className="card p-5 text-center">
            <div className="text-3xl mb-3">{t.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{t.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* FAQ */}
    <div className="max-w-xl mx-auto mb-16">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 text-center">
        Common questions
      </p>
      <div className="card px-6">
        {[
          { q:"How much does GramPickup cost to use?", a:"Signing up is completely free. You only pay a small storage fee when you collect your parcel — ₹10 when it arrives, plus ₹2 for each day it stays at the shop. The sooner you pick it up, the less you pay." },
          { q:"What if I can't collect my parcel for a few days?", a:"No problem. Your parcel stays at the shop until you are ready. The shopkeeper will keep it safe. You can see the current storage fee in your account at any time." },
          { q:"How do I know my parcel is really safe at the shop?", a:"Every shop on GramPickup is manually verified before it can accept parcels. And when you collect, the shopkeeper checks your private pickup code before handing anything over." },
          { q:"Can anyone collect my parcel on my behalf?", a:"Only someone who has your unique pickup code can collect your parcel. We recommend keeping it private, but if you want to send a family member, just share the code with them." },
          { q:"I own a shop. How do I join?", a:"Register as a Shopkeeper and fill in your shop details. Our team reviews applications usually within 24 hours. Once approved, customers in your area will be able to route their parcels to you." },
        ].map((f, i) => <FAQ key={i} {...f} />)}
      </div>
    </div>

    {/* Final CTA */}
    <div className="text-center py-12 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Ready to try it?</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Free to join. No credit card. Works in minutes.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/register" className="btn-primary px-8 py-3">Create free account</Link>
        <Link to="/contact" className="btn-secondary px-8 py-3">Talk to us</Link>
      </div>
    </div>

  </div>
);

export default About;
