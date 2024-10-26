"use client";

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, text: string) => Promise<void>;
}

const MailModal: React.FC<MailModalProps> = ({ isOpen, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    setLoading(true);
    try {
      await onSend(subject, text);
      toast.success('Emails sent successfully! 📧');
    } catch (error) {
      toast.error('Failed to send emails. Please try again. ❌');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center mx-4 md:mx-auto justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          <FaTimes className="text-gray-600 hover:text-red-500 transition" />
        </button>
        <h2 className="text-xl font-bold mb-4">Send Email</h2>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Email Content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
        />
        <button
          onClick={handleSend}
          className={`bg-transparent border border-blue-500 text-blue-500 p-2 rounded-full w-full transition duration-300 hover:bg-blue-500 hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress size={20} className="mr-2" />
              Sending...
            </div>
          ) : (
            'Send'
          )}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default MailModal;
