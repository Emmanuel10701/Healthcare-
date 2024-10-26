// components/AppointmentList.tsx

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

interface Appointment {
  id: string; // Updated to string to match API response
  patientName: string;
  doctorEmail: string;
  date: string;
  time: string;
  fee: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get<Appointment[]>('http://localhost:3000/api/appointment');
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
<h2 className="text-2xl my-14 font-semibold mb-4 text-center bg-gradient-to-r from-orange-500 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
  Appointments
</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-2 border-b text-slate-600 font-extrabold text-center text-xs sm:text-base">Patient</th>
            <th className="py-2 px-2 border-b text-slate-600 font-extrabold text-center text-xs sm:text-base">Appointment Date</th>
            <th className="py-2 px-2 border-b text-slate-600 font-extrabold text-center text-xs sm:text-base">Doctor Email</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="py-2 px-2 text-slate-600 font-extrabold">{appointment.patientName}</td>
              <td className="py-2 text-blue-700 text-center text-xs sm:text-base">{formatDate(appointment.date)}</td>
              <td className="py-2 text-center text-slate-600 text-xs sm:text-base">{appointment.doctorEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentList;
