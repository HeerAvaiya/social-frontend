import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
                formData
            );

            console.log("✅ Login Response:", res.data);

            const accessToken = res.data?.data?.tokens?.accessToken;

            if (accessToken) {
                localStorage.setItem('token', accessToken);
                setMessage("Login successful ✅");

                setTimeout(() => navigate('/select-profile'), 1500);
            } else {
                setMessage("Login failed: No token");
            }

        } catch (err) {
            console.error("❌ Login error:", err);
            setMessage(err?.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md bg-white rounded-2xl border border-black/50 p-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    Instagram
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Welcome back! Log in to continue.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        onChange={handleChange}
                        value={formData.email}
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />

                    <div className="text-right text-sm mt-1">
                        <span
                            onClick={() => {
                                if (!formData.email || formData.email.trim() === "") {
                                    setMessage("Please enter your email before proceeding to reset.");
                                } else {
                                    navigate(`/forgot-password?email=${encodeURIComponent(formData.email)}`);
                                }
                            }}
                            className="text-purple-600 hover:underline cursor-pointer"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md font-semibold hover:opacity-90 transition disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    {message && (
                        <p className={`text-center text-sm mt-2 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <span
                        className="text-purple-600 font-medium cursor-pointer hover:underline"
                        onClick={() => navigate('/register')}
                    >
                        Sign up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
