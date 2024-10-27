"use client"; // This component must be a client component

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaUserMd, FaCalendarCheck, FaBars } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DoctorProfile from '../components/doctorprofile/page';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointment');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      const doctorEmail = session?.user?.email;

      if (doctorEmail) {
        const filteredAppointments = data.filter(app => app.patientEmail === doctorEmail);
        setAppointments(filteredAppointments);
        setEarnings(filteredAppointments.reduce((total, app) => total + app.fee, 0));
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAppointments();
    } else if (status === 'unauthenticated') {
      setShowLoginModal(true);
    }
  }, [status, fetchAppointments]);

  const handleTabChange = (tab) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
      setSidebarOpen(false);
    }, 1000);
  };

  const handleCancelAppointment = (id) => {
    setConfirmCancelId(id);
  };

  const loginNavigation = () => {
    router.push('/login');
  };

  const confirmCancellation = async () => {
    if (confirmButtonDisabled) return;

    setConfirmButtonDisabled(true);
    try {
      const appointment = appointments.find(app => app.id === confirmCancelId);
      if (appointment) {
        await fetch(`/api/appointments/${confirmCancelId}`, { method: 'DELETE' });
        await fetch('/api/sendEmail', {
          method: 'POST',
          body: JSON.stringify({ email: appointment.patientEmail, message: 'Your appointment has been canceled.' }),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Cancelled appointment:', confirmCancelId);
        setAppointments(appointments.filter(app => app.id !== confirmCancelId));
        setEarnings(prev => prev - (appointment.fee || 0));
        setConfirmCancelId(null);
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
    } finally {
      setConfirmButtonDisabled(false);
    }
  };

  const completeAppointment = async (fee) => {
    const appointmentId = appointments.find(app => app.fee === fee)?.id;
    if (appointmentId) {
      await fetch(`/api/appointments/${appointmentId}/confirm`, { method: 'POST' });
      setEarnings(prev => prev + fee);
    }
  };

  const closeModal = () => {
    setConfirmCancelId(null);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full overflow-y-scroll scrollbar-hide bg-white border-b border-blue-300 py-4 z-50 flex items-center justify-between">
        <div className="container mx-auto flex items-center px-4 md:px-8">
          <div className="w-44 cursor-pointer flex items-center">
            <Image src="/assets/assets_frontend/logo.svg" alt="Logo" width={176} height={50} />
            <span className="ml-3 bg-white rounded-full text-blue-600 px-4 py-1 shadow-md">Doctor</span>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex h-screen bg-slate-100">
        <aside className={`fixed top-20 left-0 h-full w-64 border bg-slate-200 shadow-lg z-20 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="flex flex-col gap-6 p-4">
            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
              Doctor Dashboard
            </h1>
            <button onClick={() => handleTabChange('appointments')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'appointments' ? 'font-bold text-indigo-600' : ''}`}>
              <FaCalendarCheck className="mr-2 text-indigo-600" /> Appointments
            </button>
            <button onClick={() => handleTabChange('profile')} className={`flex items-center p-2 text-gray-600 hover:bg-gray-200 rounded ${activeTab === 'profile' ? 'font-bold text-indigo-600' : ''}`}>
              <FaUserMd className="mr-2 text-indigo-600" /> Profile
            </button>
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={() => setSidebarOpen(false)}></div>
        )}

        <main className="flex-1 md:ml-[20%] ml-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-20 mb-4">
              Doctor's Dashboard       
            </h1>
            <div className="flex flex-wrap gap-4 my-5 justify-center">
              <div className="w-full sm:w-1/3 lg:w-1/4 p-4 hover:shadow-lg bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
                <h3 className="text-md text-center text-slate-600 font-bold">💰 Earnings</h3>
                <p className="text-2xl font-bold text-center text-purple-700">${earnings}</p>
              </div>
              <div className="w-full sm:w-1/3 lg:w-1/4 p-4 hover:shadow-lg bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
                <h3 className="text-md text-center text-slate-600 font-bold">📅 Appointments</h3>
                <p className="text-2xl font-bold text-center text-blue-700">{appointments.length}</p>
              </div>
              <div className="w-full sm:w-1/3 lg:w-1/4 p-4 hover:shadow-lg bg-white rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105">
                <h3 className="text-md text-center text-slate-600 font-bold">🧑‍🍼 Patients</h3>
                <p className="text-2xl text-center font-bold text-green-700">{appointments.length}</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center mt-20 justify-center h-full">
              <CircularProgress size={32} />
            </div>
          ) : (
            <>
              {activeTab === 'appointments' && (
                <>
                  <h2 className="text-3xl font-bold my-6 text-gray-800 shadow-lg shadow-gray-300">
                    Appointments
                  </h2>
                  <table className="min-w-full bg-white border border-gray-300 shadow-lg">
                    <thead>
                      <tr className="bg-gray-100 text-purple-700 font-semibold shadow-md shadow-gray-200">
                        <th className="py-3 px-4 border-b">Doctor</th>
                        <th className="py-3 px-4 border-b">Appointment Date</th>
                        <th className="py-3 px-4 border-b">Status</th>
                        <th className="py-3 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment, index) => (
                        <tr key={appointment.id} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-green-50'}>
                          <td className="py-3 px-4 border-b text-gray-700 font-medium">{appointment.doctor}</td>
                          <td className="py-3 px-4 border-b text-gray-700 font-medium">{appointment.date}</td>
                          <td className={`py-3 px-4 border-b font-semibold ${appointment.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                            {appointment.status}
                          </td>
                          <td className="py-3 px-4 border-b flex justify-around">
                            {appointment.status === 'Confirmed' && (
                              <button onClick={() => completeAppointment(appointment.fee)} className="text-sm text-green-600 font-bold hover:underline">
                                Complete
                              </button>
                            )}
                            {appointment.status === 'Pending' && (
                              <button onClick={() => handleCancelAppointment(appointment.id)} className="text-sm text-red-600 font-bold hover:underline">
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {activeTab === 'profile' && (
                <DoctorProfile />
              )}
            </>
          )}
        </main>
      </div>

      {confirmCancelId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Confirm Cancellation</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to cancel this appointment?</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={confirmCancellation} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200" 
                disabled={confirmButtonDisabled}
              >
                {confirmButtonDisabled ? 'Cancelling...' : 'Confirm'}
              </button>
              <button 
                onClick={closeModal} 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-700 mb-6">You need to be logged in to access this dashboard. Please log in to continue please.</p>
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
  );
};

export default Dashboard;
