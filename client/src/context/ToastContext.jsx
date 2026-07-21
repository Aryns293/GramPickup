import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in max-w-sm border ${
              t.type === 'success' ? 'bg-green-50  dark:bg-green-900/80  text-green-800  dark:text-green-200  border-green-200  dark:border-green-700' :
              t.type === 'error'   ? 'bg-red-50    dark:bg-red-900/80    text-red-800    dark:text-red-200    border-red-200    dark:border-red-700'   :
              t.type === 'warning' ? 'bg-amber-50  dark:bg-amber-900/80  text-amber-800  dark:text-amber-200  border-amber-200  dark:border-amber-700' :
                                     'bg-indigo-50 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700'
            }`}>
            <span className="text-base flex-shrink-0">
              {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100 flex-shrink-0 ml-1">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
