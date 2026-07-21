import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('grampickup_dark');
    if (stored !== null) return stored === 'true';
    return true; // Dark mode by default
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('grampickup_dark', String(dark));
  }, [dark]);

  return [dark, setDark];
};
