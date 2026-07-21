import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-6 animate-fade-in">
      <div>
        <p className="text-8xl font-black text-gray-100 dark:text-gray-800 mb-2 select-none">404</p>
        <div className="text-4xl mb-4">🗺️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary">← Go Back</button>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
