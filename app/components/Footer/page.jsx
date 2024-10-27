"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/subs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        toast.success('Subscription successful!');
      } else if (response.status === 409) { // Assuming 409 indicates email already exists
        toast.error('Email already exists. Please use a different email.');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      toast.error('Subscription failed. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-100 w-full h-[59%] text-slate-600 py-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Image and Description */}
        <div className="flex flex-col flex-1 items-center md:items-start mb-6">
          <Image
            src="/assets/assets_frontend/logo.svg"
            alt="Logo"
            width={200}
            height={200}
          />
          <p className="text-sm text-slate-500 mt-10 font-semibold text-center md:text-left w-[70%] ">
            Your trusted healthcare partner. Empowering you to make informed decisions. Together, we navigate your health journey. Committed to your well-being every step of the way. Dedicated to building a healthier future for you.
          </p>
        </div>
        
        {/* Newsletter Subscription */}
        <div className="flex flex-col items-center md:mr-[10%] justify-center mb-6 md:mb-0 w-full md:w-1/3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent text-center">
            Subscribe to our newsletter for the latest updates
          </h2>
          <div className="flex items-center mt-2 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mr-2 p-2 rounded border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-[150%] transition-all duration-200"
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`bg-green-600 text-white font-bold py-2 px-4 rounded transition-opacity duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center ">
                  <CircularProgress size={20} className="mr-2 text-white font-bold" />
                  Processing...
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
          {success && <p className="mt-2 text-green-400">Subscription successful!</p>}
          <h1 className='text-center mt-10 font-bold text-slate-700'>Follow us:</h1>

          <div className="flex space-x-6 mt-4">
            <Link href="#" aria-label="Facebook">
              <FaFacebookF size={24} className="text-blue-600 hover:text-blue-700 transition-colors" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <FaTwitter size={24} className="text-blue-400 hover:text-blue-500 transition-colors" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <FaInstagram size={24} className="text-pink-600 hover:text-pink-700 transition-colors" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <FaLinkedinIn size={24} className="text-blue-800 hover:text-blue-900 transition-colors" />
            </Link>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="flex flex-col items-start mt-6 space-y-5 md:mt-0 text-sm">
          <h1 className='text-center mb-10 font-bold text-slate-500'>Contact us:</h1>
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt size={24} className="mr-2 text-slate-500" />
            <p className='text-blue-700 text-center font-bold'>123 Healthcare St, City, Country</p>
          </div>
          <div className="flex items-center mb-2">
            <FaPhone size={24} className="mr-2 text-orange-900" />
            <Link href="tel:+1234567890" className="hover:text-blue-400">(+123) 456-7890</Link>
          </div>
          <div className="flex items-center mb-2">
            <FaEnvelope size={24} className="mr-2 text-blue-600" />
            <Link href="mailto:info@healthcare.com" className="hover:text-blue-400">info@healthcare.com</Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-sm">
        <hr className='w-full ' />
        <p>© {new Date().getFullYear()} Healthcare. All Rights Reserved.</p>
      </div>
      <ToastContainer />
    </footer>
  );
};

export default Footer;
