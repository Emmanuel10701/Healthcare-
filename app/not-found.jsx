"use client";

import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Custom404 = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackHomeClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-10 border border-gray-300 text-center">
        <h1 className="text-8xl font-extrabold text-red-600">404</h1>
        <p className="mt-8 text-2xl font-semibold text-gray-700">
          Oops! Page not found.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          The page you are looking for might have been removed, or is temporarily unavailable.
        </p>

        <button
          onClick={handleBackHomeClick}
          className={`mt-8 w-full flex items-center justify-center px-6 py-4 text-lg font-bold text-gray-800 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300 ease-in-out ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} className="mr-2 text-white" />
              Processing...
            </>
          ) : (
            'Go back home'
          )}
        </button>
      </div>
    </div>
  );
};

export default Custom404;
