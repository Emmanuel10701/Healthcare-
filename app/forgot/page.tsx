"use client";
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Image from 'next/image';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [gmailEnabled, setGmailEnabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setEmail('');
        setGmailEnabled(true); // Enable Gmail button after processing
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send reset link');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailClick = () => {
    // Open Gmail app using the mailto URL scheme
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 mb-10 w-full bg-white border-b border-blue-300 bg-transparent py-4 z-50 flex items-center justify-between">
        <div className="container mx-auto flex items-center px-4 md:px-8">
          <div className="w-44 cursor-pointer flex items-center">
            <Image src="/assets/assets_frontend/logo.svg" alt="Logo" width={176} height={50} />
            <span className="ml-3 bg-white rounded-full text-blue-600 px-4 py-1 shadow-md">forgot </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center min-h-screen p-4 bg-slate-100">
        <form onSubmit={handleSubmit} className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-lg"> {/* Enlarged form */}
          <h2 className="text-4xl mt-10 text-slate-700 font-extrabold mb-6 text-center">🔓 Forgot Password</h2> {/* Larger heading */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-green-500 focus:outline-none transition-colors"
            required
          />
          <div className="flex justify-center mb-4 gap-2">
            <Button
              type="submit"
              variant="contained"
              className={`flex-1 text-white ${loading ? 'bg-green-500' : 'bg-indigo-600'} transition-all duration-300 rounded-full shadow-md`} // Added rounded and shadow
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <CircularProgress size={24} color="inherit" />
                  <span className="ml-1 text-sm">Processing...</span>
                </div>
              ) : (
                <span className="text-sm">Send Link</span>
              )}
            </Button>

            <Button
              variant="outlined"
              className={`flex-1 text-indigo-600 border-indigo-600 ${!gmailEnabled ? 'bg-gray-300' : 'hover:bg-indigo-600 hover:text-white'}`} // Enhanced button styling
              disabled={!gmailEnabled}
              onClick={handleGmailClick}
            >
              <span className="text-sm">{gmailEnabled ? 'Open Gmail' : 'Get The Link'}</span>
            </Button>
          </div>

          {/* Link to go back to the login page */}
          <div className="text-center mt-4">
            <p className="text-sm">
              Remembered your password?
              <Link href="/login" className="text-blue-500 hover:underline ml-1">Log in</Link>
            </p>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
