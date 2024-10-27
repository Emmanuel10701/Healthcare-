"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const specialties = [
    { name: 'Dentist', image: '/assets/assets_frontend/Dermatologist.svg' },
    { name: 'General Physician', image: '/assets/assets_frontend/General_physician.svg' },
    { name: 'Dermatologist', image: '/assets/assets_frontend/Dermatologist.svg' },
    { name: 'Pediatrician', image: '/assets/assets_frontend/Pediatricians.svg' },
    { name: 'Gastroenterologist', image: '/assets/assets_frontend/Gastroenterologist.svg' },
    { name: 'Neurologist', image: '/assets/assets_frontend/Neurologist.svg' },
    { name: 'Gynecologist', image: '/assets/assets_frontend/Gynecologist.svg' },
  ];

  const doctors = [
    { id: 1, name: 'Dr. Smith', specialty: 'Dentist', image: '/assets/assets_frontend/doc1.png', available: true },
    { id: 2, name: 'Dr. Jones', specialty: 'General Physician', image: '/assets/assets_frontend/doc2.png', available: false },
    { id: 3, name: 'Dr. Brown', specialty: 'Dermatologist', image: '/assets/assets_frontend/doc3.png', available: true },
    { id: 4, name: 'Dr. Williams', specialty: 'Pediatrician', image: '/assets/assets_frontend/doc3.png', available: true },
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

  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [showAll, setShowAll] = useState(false);
  const route = useRouter();

  const handleShowMore = () => {
    setShowAll(!showAll);
  };
  
  const handleClick = () => {
    route.push("alldoctors");
  };
  
  const handleNavigation = () => {
    route.push("register");
  };

  const displayedDoctors = showAll ? filteredDoctors : filteredDoctors.slice(0, 10);

  return (
    <div>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-opacity-60 flex flex-col-reverse mt-20 md:flex-row bg-blue-100">
          <div className="hero-content text-neutral-content flex flex-col justify-center w-full md:w-1/2 p-8">
            <h1 className="mb-5 text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Book Appointment With Trusted Doctors
            </h1>
            <div className="flex items-center mb-4">
              <Image
                src="/assets/assets_frontend/group_profiles.png"
                alt="Group of healthcare professionals"
                width={100}
                height={100}
                className="object-cover"
              />
              <p className="mb-5 text-sm text-justify text-slate-500 ml-5">
                Get personalized care tailored to your needs with our dedicated team of experienced healthcare professionals.
                Your health is our priority, and we are here to support you every step of the way.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center font-bold py-3 px-4 rounded-full flex items-center w-1/2" onClick={handleClick}>
                Book Appointment <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
          <div className="flex flex-1 w-full md:w-1/2">
            <Image
              src="/assets/assets_frontend/header_img.png"
              alt="Doctor with patient"
              width={300}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Specialties Section */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-5">
            Find Your Specialty
          </h1>
          <p className="text-md text-slate-500 mb-8">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
          <div className="flex justify-center flex-wrap mb-10">
            {specialties.map((specialty, index) => (
              <div key={index} className="flex flex-col items-center mx-4 mb-6">
                <Image
                  src={specialty.image}
                  alt={specialty.name}
                  width={70}
                  height={70}
                  className="rounded-full object-cover hover:shadow-lg hover:bg-slate-200 cursor-pointer"
                  onClick={() => setFilteredDoctors(doctors.filter(doctor => doctor.specialty === specialty.name))}
                />
                <h2 className="mt-1 text-sm text-indigo-600 font-bold capitalize">{specialty.name}</h2>
              </div>
            ))}
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-5">
            Top Doctors
          </h1>
          <p className='text-center w-[70%] mx-auto text-slate-600'>
            Our Doctors provide personalized care tailored to your unique health needs, ensuring you receive the best treatment possible. With expertise across various specialties, they are committed to guiding you on your journey to better health.
          </p>
        </div>

        {/* Doctors Cards Section */}
        <div className="flex flex-wrap gap-8 mx-20">
          {displayedDoctors.map((doctor) => (
            <div key={doctor.id} className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={140}
                height={90}
                className="object-cover w-full h-40"
              />
              <div className="p-4">
                <span className={`text-sm font-bold ${doctor.available ? 'text-green-500' : 'text-red-500'}`}>
                  {doctor.available ? '. Available' : ' . Not Available'}
                </span>
                <h2 className="mt-2 text-lg font-semibold">{doctor.name}</h2>
                <p className="text-sm text-slate-500">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Show Less Button */}
        <div className="text-center my-10">
          <button 
            onClick={handleShowMore} 
            className="bg-indigo-200 hover:bg-indigo-300 text-slate-700 py-3 px-4 rounded-full"
          >
            {showAll ? 'Show Less' : 'Load More'}
          </button>
        </div>

        {/* Banner Section */}
        <div className="flex flex-col md:flex-row items-center mx-auto justify-center w-[78%] rounded-lg h-[88%] bg-blue-600 text-white p-10">
          <div className="w-full md:w-1/2 flex flex-col justify-center p-5">
            <h1 className="text-3xl font-bold mb-4">Create Your Account Today</h1>
            <p className="mb-4">
              Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
            </p>
            <button onClick={handleNavigation} className="bg-white text-blue-600 py-3 hover:outline-2 hover:border px-4 rounded-full font-bold">
              Sign Up Now
            </button>
          </div>
          <div className="w-full md:w-1/2">
            <Image
              src="/assets/assets_frontend/appointment_img.png"
              alt="Banner Image"
              width={400}
              height={300}
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
