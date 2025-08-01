import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthMessages } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, token, successMessage } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        dispatch(clearAuthMessages());
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            setTimeout(() => navigate('/select-profile'), 1500);
        }
    }, [token, navigate]);


    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
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
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    />

                    <div className="text-right text-sm mt-1">
                        <span
                            onClick={() => {
                                if (!formData.email.trim()) {
                                    alert("Please enter your email before proceeding.");
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

                    {error && <p className="text-red-600 text-center text-sm">{error}</p>}
                    {successMessage && <p className="text-green-600 text-center text-sm">{successMessage}</p>}
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
