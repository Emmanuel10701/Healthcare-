"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const PatientProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(true);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    email: session?.user?.email || '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    aboutMe: '',
    image: session?.user?.image || '/images/default.png',
  });

  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = 'http://localhost:3000/api/profile';

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && session.user?.email) {
      fetchPatientDetails(session.user.email);
    }
  }, [status, session, router]);

  const fetchPatientDetails = async (email) => {
    try {
      const response = await axios.get(`${apiUrl}/email/${email}`);
      setPatientDetails(response.data);
    } catch (error) {
      toast.error(`Error fetching patient: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(patientDetails).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      await axios.put(`${apiUrl}/${patientDetails.email}`, formData);
      toast.success('Profile updated successfully');
      setIsDataSubmitted(true);
    } catch (error) {
      toast.error(`Error saving profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <ToastContainer />
      <div className="fixed top-0 left-0 w-full mb-10 bg-white border-b border-blue-300 bg-transparent py-4 z-50 flex items-center justify-between">
        <div className="container mx-auto flex items-center px-4 md:px-8">
          <div className="w-44 cursor-pointer flex items-center">
            <Image src="/assets/assets_frontend/logo.svg" alt="Logo" width={176} height={50} />
            <span className="ml-3 bg-white rounded-full text-blue-600 px-4 py-1 shadow-md">Profile</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col overflow-y-hidden justify-center items-center mt-20 h-screen">
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl flex flex-col items-center">
          <div className="flex-none mb-6">
            <label className="cursor-pointer bg-slate-500 rounded-full">
              <Image
                src={patientDetails.image}
                alt="Patient"
                width={100}
                height={100}
                className="h-36 w-36 bg-slate-300 rounded-full object-cover mx-auto"
              />
              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    setPatientDetails((prev) => ({ ...prev, image: URL.createObjectURL(files[0]) }));
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex w-full">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold mb-2">Patient Information</h3>
              {['name', 'email', 'phone'].map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-bold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={patientDetails[key]}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>

            <div className="flex-1 pl-4">
              <h4 className="text-md font-semibold mb-2">Additional Information</h4>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={patientDetails.birthDate}
                  onChange={handleChange}
                  max={today}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold">Gender</label>
                <select
                  name="gender"
                  value={patientDetails.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {['address', 'aboutMe'].map((key) => (
                <div key={key} className="mb-4">
                  <label className="block text-gray-700 font-bold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={patientDetails[key]}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-around items-center mt-6 w-full">
            {!isDataSubmitted && !isSubmitting && (
              <button 
                onClick={handleSave} 
                className="bg-transparent text-blue-500 border border-blue-500 px-4 py-2 rounded-full"
              >
                Submit
              </button>
            )}
            {isSubmitting && (
              <div className="flex rounded-full px-4 py-3 border items-center">
                <CircularProgress size={24} className="mr-2" />
                <span>Submitting...</span>
              </div>
            )}
            {isDataSubmitted && !isSubmitting && (
              <div className="px-4 py-3 bg-green-500 text-white rounded-full">
                Profile submitted successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
