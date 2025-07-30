import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setMessage(' Logged out successfully');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Instagram</h1>

                <Link to="/discover" className="text-sm text-gray-700 hover:underline">Discover</Link>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-lg px-2 py-1 text-sm"
                    />

                    {!user ? (
                        <>
                            <Link to="/register" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Signup</Link>
                            <Link to="/login" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Login</Link>
                        </>
                    ) : (
                        <Link to="/profile">
                            <img
                                src={user?.profileImageUrl || 'https://via.placeholder.com/150?text=Avatar'}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                        </Link>
                    )}
                </div>
            </header>

            <main className="p-4 text-center">
                <h2 className="text-2xl font-semibold mt-4">Home Page</h2>
                {message && (
                    <p
                        className={`text-sm mt-2 ${message.includes('') ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </main>
        </div>
    );
}

export default Home;
