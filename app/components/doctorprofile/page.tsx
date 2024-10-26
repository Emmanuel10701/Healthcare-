"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";

interface DoctorProfileData {
    id: string;
    name: string;
    email: string;
    specialty: string;
    experience: string;
    fees: string;
    education: string;
    address1: string;
    address2: string;
    aboutMe: string;
    image: string;
}

const DoctorProfile = () => {
    const { data: session } = useSession();
    const [doctorData, setDoctorData] = useState<DoctorProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<DoctorProfileData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            if (session?.user?.email) {
                const response = await fetch(`/api/doctors?email=${session.user.email}`);
                const data = await response.json();

                if (data) {
                    setDoctorData(data);
                    setFormData(data);
                } else {
                    setIsModalOpen(true); // Open modal if no doctor data is found
                }
            }
            setLoading(false);
        };

        fetchDoctorProfile();
    }, [session]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (formData) {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleUpdateProfile = async () => {
        if (formData && doctorData) {
            const response = await fetch(`/api/doctors/${doctorData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedDoctor = await response.json();
                setDoctorData(updatedDoctor);
                setEditing(false);
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile.");
            }
        }
    };

    const handleConfirmEmail = async () => {
        if (session?.user?.email) {
            const response = await fetch('/api/doctors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: session.user.email }),
            });

            if (response.ok) {
                toast.success("Your email has been confirmed. You can now complete your doctor profile!");
                setIsModalOpen(false);
            } else {
                toast.error("Failed to confirm email. Please try again.");
            }
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="flex mt-[50%] items-center justify-center w-full h-screen bg-slate-100 p-4">
            <div className="w-full md:w-[90%] bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-center mb-6">
                    <Image
                        src={editing ? formData?.image || '/images/default.png' : doctorData?.image || '/images/default.png'}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full shadow-md border-2 border-indigo-500 object-cover"
                    />
                </div>
                <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    {editing ? 'Edit Doctor Profile' : 'Doctor Profile'}
                </h1>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className={`w-full md:w-[80%] ${editing ? 'mt-12' : ''}`}>
                    {doctorData ? (
                        <>
                            {[
                                { label: 'Name', name: 'name', type: 'text' },
                                { label: 'Email', name: 'email', type: 'email', disabled: true },
                                { label: 'Specialty', name: 'specialty', type: 'text' },
                                { label: 'Experience', name: 'experience', type: 'text' },
                                { label: 'Fees', name: 'fees', type: 'text' },
                                { label: 'Education', name: 'education', type: 'text' },
                                { label: 'Address 1', name: 'address1', type: 'text' },
                                { label: 'Address 2', name: 'address2', type: 'text' },
                                { label: 'About Me', name: 'aboutMe', type: 'text' },
                            ].map(({ label, name, type, disabled = false }) => (
                                <div className="mb-4" key={name}>
                                    <label className="block text-lg font-semibold text-indigo-600 mb-1">{label}</label>
                                    {name === 'aboutMe' ? (
                                        <textarea
                                            name={name}
                                            value={formData ? formData[name as keyof DoctorProfileData] : ''}
                                            onChange={handleInputChange}
                                            required
                                            disabled={!editing}
                                            className="p-3 border border-gray-300 rounded-lg shadow-inner w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                    ) : (
                                        <input
                                            type={type}
                                            name={name}
                                            value={formData ? formData[name as keyof DoctorProfileData] : ''}
                                            onChange={handleInputChange}
                                            required
                                            disabled={!editing || disabled}
                                            className="p-3 border border-gray-300 rounded-lg shadow-inner w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Profile Image URL */}
                            <div className="mb-4">
                                <label className="block text-lg font-semibold text-indigo-600 mb-1">Profile Image URL</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData ? formData.image : ''}
                                    onChange={handleInputChange}
                                    disabled={!editing}
                                    required
                                    className="p-3 border border-gray-300 rounded-lg shadow-inner w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>No doctor data available. Please check back later.</p>
                        </div>
                    )}

                    <div className="flex justify-between mb-4">
                        <button
                            type="submit"
                            className={`bg-transparent border border-blue-500 text-blue-500 w-3/5 py-3 rounded-full shadow transition duration-200 
                                        hover:bg-blue-500 hover:text-white focus:outline-none focus:ring focus:ring-blue-300`}
                        >
                            {editing ? 'Save Profile' : 'Edit Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(!editing)}
                            className={`w-full border border-${editing ? 'red' : 'green'}-600 text-${editing ? 'red' : 'green'}-600 py-2 rounded-full hover:bg-${editing ? 'red' : 'green'}-600 hover:text-white transition-all duration-200 ml-2`}
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </form>

                <ToastContainer />

                {/* Modal for confirming email */}
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <div className="flex items-center justify-center h-full">
                        <div className="bg-white rounded-lg p-6 shadow-lg w-80">
                            <h2 className="text-xl font-bold mb-2" id="modal-title">Confirm Your Email</h2>
                            <p className="mb-4" id="modal-description">
                                Your email {session?.user?.email} is not associated with any doctor profile. Would you like to create one?
                            </p>
                            <div className="flex justify-around">
                                <Button variant="outlined" color="primary" onClick={handleConfirmEmail}>Yes</Button>
                                <Button variant="outlined" color="secondary" onClick={() => setIsModalOpen(false)}>No</Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default DoctorProfile;
