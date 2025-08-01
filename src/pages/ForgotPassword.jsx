import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendResetEmail, clearPasswordState } from '../features/auth/passwordSlice';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    const { loading, message, error } = useSelector((state) => state.password);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        dispatch(sendResetEmail(email));
    };

    useEffect(() => {
        return () => {
            dispatch(clearPasswordState());
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white border border-black/50 p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-400 focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md hover:bg-pink-600"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    {(message || error) && (
                        <p
                            className={`text-center mt-2 ${error ? 'text-red-600' : 'text-green-600'
                                }`}
                        >
                            {error || message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
