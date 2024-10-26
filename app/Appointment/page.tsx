"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import { doctorsData } from '../components/data'; // Import your local doctor data

// Define types for appointment and doctor
interface Appointment {
  id: number;
  date: string;
  time: string;
  fee: number;
  patientName: string;
  doctorId: number;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  degree: string;
  description: string;
  image: string;
}

const AppointmentDetail: React.FC = () => {
  const { data: session } = useSession() as { data: { user: { name: string; id: string } } | null };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<{ [key: number]: Doctor }>({});
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session) return;

      try {
        // Fetch appointments for the logged-in user
        const response = await fetch(`/api/appointments?userId=${session.user.id}`);
        const data: Appointment[] = await response.json();
        
        // Filter appointments based on the user's name (case-insensitive)
        const userAppointments = data.filter((appt) => 
          appt.patientName.toLowerCase() === session.user.name.toLowerCase()
        );

        setAppointments(userAppointments);

        // Map doctor IDs to doctor details for quick access
        const doctorMap: { [key: number]: Doctor } = {};
        userAppointments.forEach((appt) => {
          const selectedDoctor = doctorsData.find(doctor => doctor.id === appt.doctorId);
          if (selectedDoctor) {
            doctorMap[appt.id] = selectedDoctor;
          }
        });
        setDoctors(doctorMap);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [session]);

  const handlePayment = async (method: 'stripe' | 'paypal', appointmentId: number, fee: number, cardDetails: any) => {
    const url = method === 'stripe' ? '/api/payments/stripe' : '/api/payments/paypal';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          fee,
          cardDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      console.log('Payment successful:', data);
      setPaymentStatus('paid');
      setPaymentModalOpen(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment.');
    }
  };

  return (
    <>
      <div className="flex flex-col p-8 mt-32 mx-auto max-w-6xl">
      <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 text-transparent bg-clip-text">
        Your Appointments
      </h2>
        {appointments.length === 0 ? (
          <p className="text-center text-slate-500 text-lg font-semibold">
  No appointments found for you.
</p>
        ) : (
          appointments.map((appointment) => {
            const doctor = doctors[appointment.id];
            return (
              <div key={appointment.id} className="border p-4 rounded-lg shadow-md bg-white mb-4">
                <div className="flex">
                  <div className="w-1/4">
                    {doctor ? (
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={100}
                        height={100}
                        className="object-cover bg-blue-500 rounded-md shadow-lg"
                      />
                    ) : (
                      <CircularProgress />
                    )}
                  </div>
                  <div className="w-3/4 pl-4">
                    <h3 className="text-lg font-bold">{doctor?.name || "Loading..."}</h3>
                    <p>Date: {appointment.date}</p>
                    <p>Time: {appointment.time}</p>
                    <p>Fee: <span className='font-extrabold text-green-700'>${appointment.fee}</span></p>
                    <button
                      onClick={() => {
                        if (session) {
                          handlePayment('stripe', appointment.id, appointment.fee, { cardNumber: '', expiryDate: '', cvc: '' });
                        } else {
                          setLoginModalOpen(true);
                        }
                      }}
                      className={`mt-2 ${paymentStatus === 'pending' ? 'bg-blue-500' : 'bg-green-500'} rounded-full text-white py-2 px-4`}
                    >
                      {paymentStatus === 'pending' ? 'Pay Appointment' : 'Paid'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl mb-4">Payment Details</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-1">Card Number</label>
                <input type="text" className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Expiry Date (MM/YY)</label>
                <input type="text" className="border p-2 rounded w-full" required />
              </div>
              <div className="mb-4">
                <label className="block mb-1">CVC</label>
                <input type="text" className="border p-2 rounded w-full" required />
              </div>
              <button
                type="button"
                onClick={() => handlePayment('stripe', 0, 0, { cardNumber: '', expiryDate: '', cvc: '' })} // Adjust as needed
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Pay Now
              </button>
            </form>
            <button onClick={() => setPaymentModalOpen(false)} className="mt-4 text-red-500">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-lg font-semibold">Login Required</h3>
            <p className="mt-2">Please log in to confirm your appointment.</p>
            <div className="flex justify-center mt-4">
              <button onClick={() => window.location.href = "http://localhost:3000/login"} className="bg-transparent border border-blue-500 text-blue-500 py-3 px-6 rounded-full shadow hover:bg-blue-500 hover:text-white transition duration-200">
                Login
              </button>
              <button onClick={() => setLoginModalOpen(false)} className="bg-transparent border border-red-500 text-red-500 py-3 px-6 rounded-full shadow hover:bg-red-500 hover:text-white transition duration-200 ml-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentDetail;
