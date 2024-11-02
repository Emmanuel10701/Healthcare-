"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const doctorsData = [
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

const specialties = [
  'All',
  'Dentist',
  'General Physician',
  'Dermatologist',
  'Pediatrician',
  'Gastroenterologist',
  'Neurologist',
  'Gynecologist',
];

const DoctorsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const router = useRouter();

  const handleDoctorClick = (doctorId) => {
    router.push(`/alldoctors/${doctorId}`);
  };

  const filteredDoctors = selectedSpecialty === 'All' 
    ? doctorsData 
    : doctorsData.filter(doctor => doctor.specialty === selectedSpecialty);

  return (
    <div className="flex flex-col md:flex-row p-8 mt-20">
      {/* Sidebar */}
      <div className="flex-1 md:w-1/4">
        <h2 className="text-2xl font-bold mb-4">Filter by Specialty</h2>
        <div className="flex flex-col space-y-2">
          {specialties.map((specialty, index) => (
            <button
              key={index}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`p-2 rounded-full w-[70%] ${selectedSpecialty === specialty ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors List */}
      <div className="flex-1 md:w-3/4 ml-4">
        <h1 className="text-3xl font-bold mb-4">Doctors</h1>
        <p className='text-center text-slate-700 my-6 text-xl'>Browse through the doctors specialist.</p>
        
        {/* Grid Display for Doctors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDoctors.map(doctor => (
            <div 
              key={doctor.id} 
              className="border rounded-lg overflow-hidden shadow-md transition duration-200"
            >
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={200}
                height={150}
                className="object-cover w-full"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-green-700">
                  {doctor.name} 
                </h2>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className={`mt-2 text-sm font-bold ${doctor.available ? 'text-green-400' : 'text-red-400'}`}>
                  {doctor.available ? 'Available' : 'Not Available'}
                </p>
                <button 
                  onClick={() => handleDoctorClick(doctor.id)} 
                  className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                >
                  View Doctor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
