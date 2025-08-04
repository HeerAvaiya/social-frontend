import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, logout } from '../features/auth/authSlice';
import DiscoverSearch from '../components/DiscoverSearch';

function Home() {
    const dispatch = useDispatch();
    const { user, message } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Instagram</h1>

                {user && (
                    <div className="w-64">
                        <DiscoverSearch />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {!user ? (
                        <>
                            <Link
                                to="/register"
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Signup
                            </Link>
                            <Link
                                to="/login"
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                                Login
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile">
                                <img
                                    src={user?.profileImageUrl || 'https://via.placeholder.com/150?text=Avatar'}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main className="p-4 text-center">
                <h2 className="text-2xl font-semibold mt-4">Home Page</h2>
                {message && (
                    <p
                        className={`text-sm mt-2 ${message.includes('successfully')
                            ? 'text-green-600'
                            : 'text-red-600'
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
