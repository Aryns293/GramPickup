import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ContactItem = ({ icon, label, value, href }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      {href
        ? <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{value}</a>
        : <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{value}</p>}
    </div>
  </div>
);

const TOPICS = ['General Question', 'Register a Shop', 'Technical Issue', 'Partnership', 'Other'];

const Contact = () => {
  const { user } = useAuth();
  const [form, setForm]         = useState({ name:'', email:'', topic: TOPICS[0], message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
  }, [user]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedName(form.name.split(' ')[0]);
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in py-4">

      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          💬 We'd love to hear from you
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Get in touch</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
          Questions about the platform, want to register a shop, or just want to say hello — we're here.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Left: Info panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <ContactItem icon="📍" label="Location"    value="Delhi, India" />
            <ContactItem icon="✉️" label="Email"       value="arynshr293@gmail.com" href="mailto:arynshr293@gmail.com" />
            <ContactItem icon="💻" label="GitHub"      value="Aryns293/GramPickup"  href="https://github.com/Aryns293/GramPickup" />
            <ContactItem icon="🌐" label="Live Demo"   value="gram-pickup-one.vercel.app" href="https://gram-pickup-one.vercel.app" />
          </div>

          {/* Response time card */}
          <div className="card p-5 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-indigo-200 dark:border-indigo-800">
            <div className="text-2xl mb-2">⚡</div>
            <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">Usually reply within 24h</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">For urgent issues, email directly. For shop registration queries, include your city and shop name.</p>
          </div>

          {/* FAQ hints */}
          <div className="card p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Quick answers</p>
            <div className="space-y-3">
              {[
                { q:'How do I register my shop?', a:'Sign up as a Shopkeeper and fill in your shop details. Admin reviews within 24h.' },
                { q:'What is the storage fee?', a:'₹10 base when parcel arrives, then ₹2 per day. Visible in real time.' },
                { q:'Is the OTP required?', a:"Yes — it's how we ensure only the right person collects the parcel." },
              ].map((f, i) => (
                <div key={i} className="text-xs border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{f.q}</p>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-3">
          <div className="card p-8 h-full">
            {submitted ? (
              <div className="h-full flex items-center justify-center text-center py-12 animate-fade-in-scale">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mx-auto mb-5">✅</div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Thanks, {submittedName}!
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
                    Your message has been received. Our support team will get back to you shortly.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm(f => ({ ...f, message:'', topic: TOPICS[0] })); }}
                    className="btn-secondary text-sm">
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Send a message</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the form and we'll respond via email.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Your Name</label>
                    <input type="text" name="name" required value={form.name} onChange={onChange} className="input-field" placeholder="Ramesh Kumar" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                    <input type="email" name="email" required value={form.email} onChange={onChange} className="input-field" placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Topic</label>
                  <select name="topic" value={form.topic} onChange={onChange} className="input-field">
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea name="message" required rows={5} value={form.message} onChange={onChange}
                    className="input-field resize-none"
                    placeholder="Describe your question or request in detail. If you're registering a shop, please include your city and business name." />
                </div>

                <button type="submit" className="btn-primary w-full py-3 text-base">
                  Send Message →
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By submitting, you agree that we may reply to the email address provided above.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
