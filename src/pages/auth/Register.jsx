import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
                formData
            );

            if (res.data?.data?.user) {
                setMessage("Registered successfully");
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setMessage("Something went wrong");
            }

        } catch (err) {
            setMessage(err?.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 animate-fade-in border border-black/50">
                <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    Instagram
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Sign up to see photos and videos from your friends.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    />

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
                    >
                        Sign Up
                    </button>

                    {message && (
                        <p className="text-center text-sm text-green-600 mt-2">{message}</p>
                    )}
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Have an account?{' '}
                    <span
                        className="text-purple-600 font-medium cursor-pointer hover:underline"
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
