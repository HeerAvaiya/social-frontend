import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(res.data.user);
            } catch (err) {
                console.error("Failed to fetch user:", err.response?.data || err.message);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-pink-600">Instagram</div>

                <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-100 px-4 py-1.5 rounded-md text-sm focus:outline-none w-1/3"
                />

                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-600">
                            Logout
                        </button>
                    </Link>

                    {user?.profileImageUrl && (
                        <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                    )}
                </div>
            </header>

            <main className="mt-10 text-center">
                <h1 className="text-3xl font-semibold text-gray-800">Welcome to Home Page</h1>
            </main>
        </>
    );
};

export default Header;