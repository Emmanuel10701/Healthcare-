"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { doctorsData } from "../../components/data"; // Ensure this import is correct
import CircularProgress from '@mui/material/CircularProgress';

const AppointmentDetail = () => {
  const { id } = useParams();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      // Find the doctor by ID in the static doctorsData array
      const foundDoctor = doctorsData.find(doctor => doctor.id === parseInt(id));
      setDoctor(foundDoctor);
      setLoading(false);
    }
  }, [id]);

  const appointmentFee = 50;
  const times = ['6:00 AM', '8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const handleBookAppointment = () => {
    if (!session?.user) {
      setLoginModalOpen(true);
      return;
    }
    
    if (selectedDate && selectedTime) {
      setModalOpen(true);
    } else {
      alert('Please select both date and time.');
    }
  };

  const confirmAppointment = async () => {
    if (!session?.user || !doctor) return;

    setAppointmentConfirmed(true);
    setModalOpen(false);

    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: session.user.name,
          doctorName: doctor.name,  // Correctly retrieve doctor name here
          date: selectedDate?.toISOString(),
          time: selectedTime,
          fee: appointmentFee,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      console.log('Appointment booked successfully');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!doctor) {
    return <div>Doctor not found.</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row p-8 mt-32 mx-auto max-w-6xl">
        <div className="w-full md:w-2/6 mb-4 md:mb-0">
          <Image
            src={doctor.image}
            alt={doctor.name}
            width={300}
            height={300}
            className="object-cover bg-blue-500 rounded-md shadow-lg"
          />
        </div>

        <div className="w-full md:w-4/6 md:pl-4">
          <div className='border p-4 rounded-lg shadow-md bg-white'>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              {doctor.name}
              <Image
                src="/images/verify.png"
                alt="verify"
                width={24}
                height={24}
                className="object-cover bg-slate-50 ml-4 rounded-full"
              />
            </h1>
            <h2 className="text-xl font-semibold text-indigo-600 mb-4">{doctor.specialty}<span className='text-slate-500'>(2 years)</span></h2>
            <p className="text-md font-bold text-green-600 mb-1">
              Degree: <span className='font-semibold'>{doctor.degree}</span> 
            </p>
            <h3 className='text-center my-2 text-orange-600 text-lg font-bold'>About 🤵</h3>
            <p className="text-sm text-slate-500 mb-4">{doctor.description}</p>
            <h3 className='text-start my-2 text-indigo-600 text-lg font-bold'>Appointment fee <span className='font-extrabold text-green-700'>${appointmentFee}</span></h3>
          </div>

          <h3 className="text-lg font-semibold mb-2 mt-4">Select Date:</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="border border-indigo-600 rounded p-2 mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dateFormat="MMMM d, yyyy"
            placeholderText='select date'
          />

          <h3 className="text-lg font-semibold mb-2">Select Time:</h3>
          <div className="flex flex-wrap mb-4">
            {times.map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`m-1 py-2 px-4 rounded transition duration-200 
                  ${selectedTime === time ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <button onClick={handleBookAppointment} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 rounded shadow-lg hover:shadow-xl transition duration-200">
              Book Appointment
            </button>
          </div>

          {appointmentConfirmed && (
            <div className="mt-4 text-green-600">
              <p>Appointment booked successfully for {doctor.name}!</p>
              <p>Date: {selectedDate?.toLocaleDateString()}</p>
              <p>Time: {selectedTime}</p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => router.push('/Appointment')}
                  className="bg-transparent border border-blue-500 text-blue-500 py-2 px-6 rounded-full shadow hover:bg-blue-500 hover:text-white transition duration-200"
                >
                  View Appointments
                </button>
              </div>
            </div>
          )}

          {/* Booking Confirmation Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div ref={modalRef} className="bg-white p-12 rounded-lg shadow-lg w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-indigo-600">Confirm Appointment</h3>
                <p className="mt-4 text-lg">Doctor: <span className="font-semibold text-blue-600">{doctor.name}</span></p>
                <p className="mt-2 text-lg">Date: <span className="font-semibold text-blue-600">{selectedDate?.toLocaleDateString()}</span></p>
                <p className="mt-2 text-lg">Time: <span className="font-semibold text-blue-600">{selectedTime}</span></p>
                <p className="mt-2 text-lg">Appointment Fee: <span className='font-extrabold text-green-700'>${appointmentFee}</span></p>
                <div className="flex justify-between mt-6">
                  <button onClick={confirmAppointment} className="bg-green-500 text-white py-3 px-6 rounded-full shadow hover:bg-green-600 transition duration-200">
                    Confirm
                  </button>
                  <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white py-3 px-6 rounded-full shadow hover:bg-red-600 transition duration-200">
                    Cancel
                  </button>
                </div>
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
                  <button onClick={() => router.push("/login")} className="bg-transparent border border-blue-500 text-blue-500 py-3 px-6 rounded-full shadow hover:bg-blue-500 hover:text-white transition duration-200">
                    Login
                  </button>
                  <button onClick={() => setLoginModalOpen(false)} className="bg-transparent border border-red-500 text-red-500 py-3 px-6 rounded-full shadow hover:bg-red-500 hover:text-white transition duration-200 ml-2">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AppointmentDetail;
