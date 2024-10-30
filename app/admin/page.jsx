"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MailModal from '../components/Modal/page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut } from 'next-auth/react';
import { FaUserMd, FaCalendarCheck, FaListUl, FaPlus, FaBars, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import AddDoctorForm from '../components/adddoctor/page';
import AppointmentList from '../components/appoinements/page';
import { FaExclamationTriangle } from 'react-icons/fa';

const patients = [
  { id: 1, name: 'John Doe', age: 30, image: '/assets/assets_frontend/profile_pic.png' },
  { id: 2, name: 'Jane Smith', age: 25, image: '/assets/assets_frontend/doc14.png' },
  { id: 3, name: 'Alice Johnson', age: 40, image: '/assets/assets_frontend/doc7.png' },
  { id: 4, name: 'Bob Brown', age: 35, image: '/assets/assets_frontend/profile_pic.png' },
  { id: 5, name: 'Charlie Green', age: 28, image: '/assets/assets_frontend/doc12.png' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);




  useEffect(() => {
    if (status === 'authenticated') {
      fetchAppointments();
    } else if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status]);



  const handleTabChange = (tab) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
      setSidebarOpen(false);
    }, 1000);
  };

  const fetchSubscribers = async () => {
    try {
      const response = await axios.get('/api/subs');
      setSubscribers(response.data);
    } catch (err) {
      setError('Failed to fetch subscribers');
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSendEmail = async (subject, message) => {
    try {
      await axios.post('/api/mailing', { 
        subject, 
        message, 
        subscribers 
      });
      toast.success('Email sent successfully to all subscribers!');
      setSubject('');
      setText('');  
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const loginNavigation = () => {
    router.push('/login');
  };


  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const doctors = [
    { id: 1, name: 'Dr. Smith', specialty: 'Dentist', image: '/assets/assets_frontend/doc1.png', available: true },
    { id: 2, name: 'Dr. Jones', specialty: 'General Physician', image: '/assets/assets_frontend/doc2.png', available: false },
    { id: 3, name: 'Dr. Brown', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc3.png', available: true },
    { id: 4, name: 'Dr. Williams', specialty: 'Pediatrician', image: '/assets/assets_frontend/doc4.png', available: true },
    { id: 5, name: 'Dr. Johnson', specialty: 'Gastroenterologist', image: '/assets/assets_frontend/doc5.png', available: false },
    { id: 6, name: 'Dr. Lee', specialty: 'Neurologist', image: '/assets/assets_frontend/doc6.png', available: true },
    { id: 7, name: 'Dr. Kim', specialty: 'Gynecologist', image: '/assets/assets_frontend/doc7.png', available: true },
    { id: 8, name: 'Dr. Patel', specialty: 'Dentist', image: '/assets/assets_frontend/doc8.png', available: true },
    { id: 9, name: 'Dr. Garcia', specialty: 'Gastroenterologist', image: '/assets/assets_frontend/doc9.png', available: true },
    { id: 10, name: 'Dr. Martinez', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc10.png', available: false },
    { id: 11, name: 'Dr. Robert', specialty: 'Gynecologist', image: '/assets/assets_frontend/doc11.png', available: true },
    { id: 12, name: 'Dr. James', specialty: 'Gastroenterologist', image: '/assets/assets_frontend/doc12.png', available: true },
    { id: 13, name: 'Dr. Mercy', specialty: 'Dentist', image: '/assets/assets_frontend/doc15.png', available: true },
    { id: 14, name: 'Dr. John', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc13.png', available: true },
    { id: 15, name: 'Dr. Erick', specialty: 'Pediatrician', image: '/assets/assets_frontend/doc14.png', available: false },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <FaExclamationTriangle className="text-red-500 mb-4" style={{ fontSize: '48px' }} />
        <h2 className="text-xl font-semibold text-gray-800">Something went wrong!</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white border-b border-blue-300 py-4 z-50 flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
          <div className="w-44 cursor-pointer flex items-center">
            <Image src="/assets/assets_frontend/logo.svg" alt="Logo" width={176} height={50} />
            <span className="ml-3 bg-white rounded-full text-blue-600 px-4 py-1 shadow-md md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>Menu</span>
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="flex items-center text-gray-600 hover:bg-gray-200 rounded px-3 py-1 ml-auto"
        >
          <FaSignOutAlt className="mr-1" /> Logout
        </button>
      </div>

      <div className="flex h-screen ml-0 overflow-hidden bg-slate-100">
        <aside className={`fixed left-0 top-0 h-full mt-20 border bg-slate-200 shadow-lg transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 z-20`}>
          <nav className="flex flex-col gap-6 p-4">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
              Admin Dashboard
            </h1>
            <button onClick={() => handleTabChange('appointments')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'appointments' ? 'font-bold text-indigo-600' : ''}`}>
              <FaCalendarCheck className="mr-2 text-indigo-600" /> Appointments
            </button>
            <button onClick={() => handleTabChange('patients')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'patients' ? 'font-bold text-indigo-600' : ''}`}>
              <FaUserMd className="mr-2 text-indigo-600" /> Patients
            </button>
            <button onClick={() => handleTabChange('doctors')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'doctors' ? 'font-bold text-indigo-600' : ''}`}>
              <FaListUl className="mr-2 text-indigo-600" /> Doctors List
            </button>
            <button onClick={() => handleTabChange('addDoctor')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'addDoctor' ? 'font-bold text-indigo-600' : ''}`}>
              <FaPlus className="mr-2 text-indigo-600" /> Add Doctor
            </button>
            <button onClick={() => handleTabChange('subscribers')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'subscribers' ? 'font-bold text-indigo-600' : ''}`}>
              <FaEnvelope className="mr-2 text-indigo-600" /> Subscribers
            </button>
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>
        )}

        <main className="flex-1 md:ml-[20%] ml-1 p-6 overflow-y-auto">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden ml-10 text-black">
            <FaBars />
          </button>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
            Welcome to Dashboard       
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 mb-6">
            <div className="p-6 hover:shadow-lg bg-white rounded-lg shadow-md flex flex-col items-center justify-center w-full max-w-xs">
              <h3 className="text-md text-center text-slate-600 font-bold">📅 Appointments</h3>
              <p className="text-2xl font-bold text-center text-purple-700">{AppointmentList.length}</p>
            </div>
            <div className="p-6 hover:shadow-lg bg-white rounded-lg shadow-md flex flex-col items-center justify-center w-full max-w-xs">
              <h3 className="text-md text-center text-slate-600 font-bold">👨‍⚕️ Total Doctors</h3>
              <p className="text-2xl text-center font-bold text-blue-700">{doctors.length}</p>
            </div>
            <div className="p-6 hover:shadow-lg bg-white rounded-lg shadow-md flex flex-col items-center justify-center w-full max-w-xs">
              <h3 className="text-md text-center text-slate-600 font-bold">🧑‍🍼 Total Patients</h3>
              <p className="text-2xl text-center font-bold text-green-700">{patients.length}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center mt-20 justify-center h-full">
              <CircularProgress size={32} />
            </div>
          ) : (
            <>
              {activeTab === 'appointments' && <AppointmentList />}
              {activeTab === 'patients' && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">Patients</h2>
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 border-b text-xs sm:text-base">Image</th>
                        <th className="py-2 border-b text-xs sm:text-base">Name</th>
                        <th className="py-2 border-b text-xs sm:text-base">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="py-1 text-slate-600 shadow-lg bg-white font-extrabold">
                            <div className="flex gap-3 items-center">
                              <Image 
                                src={patient.image} 
                                alt="Patient Image" 
                                width={40} 
                                height={40} 
                                className="w-16 h-16 rounded-full"
                              />
                            </div>
                          </td>
                          <td>
                            <span className="text-sm sm:text-lg text-center font-bold">{patient.name}</span>
                          </td>
                          <td className="py-2 text-center text-blue-700 text-sm sm:text-base">{patient.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {activeTab === 'doctors' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {doctors.map(doctor => (
                    <div key={doctor.id} className="border rounded-lg overflow-hidden shadow-md transition duration-200 hover:outline-1 hover:shadow-lg">
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={200}
                        height={150}
                        className="object-cover w-full"
                      />
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-green-700">
                          {doctor.name} <span className="text-gray-600">({doctor.specialty})</span>
                        </h2>
                        <p className={`mt-2 text-sm font-bold ${doctor.available ? 'text-green-400' : 'text-red-400'}`}>
                          {doctor.available ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'addDoctor' && <AddDoctorForm />}
              {activeTab === 'subscribers' && (
                <div className='overflow-hidden'>
                  <h1 className="text-xl font-bold mb-4">Subscribers List</h1>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-transparent text-white font-bold py-2 px-4 rounded-full mb-4"
                  >
                    Mail All Subscribers
                  </button>
                  <MailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={handleSendEmail} />
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b text-slate-600 font-extrabold text-center">Email</th>
                        <th className="py-2 px-4 border-b text-slate-600 font-extrabold text-center">Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.email}>
                          <td className="py-2 px-4 border-b text-slate-500">{subscriber.email}</td>
                          <td className="py-2 px-4 border-b text-slate-500">{new Date(subscriber.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-700 mb-6">You need to be logged in to access this dashboard. Please log in to continue.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={loginNavigation}
                className="bg-blue-600 bg-opacity-80 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition duration-200"
              >
                Go to Login
              </button>
              <button
                onClick={closeLoginModal}
                className="bg-gray-300 bg-opacity-80 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
            </>
          )}
        </main>
        <ToastContainer />
      </div>
    </>
  );
};

export default Dashboard;
