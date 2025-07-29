// // correct code

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../api/axios';

// const Header = () => {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) return;

//                 const res = await api.get('/users/me', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setUser(res.data.user);
//             } catch (err) {
//                 console.error("Failed to fetch user:", err.response?.data || err.message);
//             }
//         };

//         fetchUser();
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         navigate("/login");
//     };

//     return (
//         <>
//             <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
//                 <div className="text-2xl font-bold text-pink-600">Instagram</div>

//                 <input
//                     type="text"
//                     placeholder="Search"
//                     className="bg-gray-100 px-4 py-1.5 rounded-md text-sm focus:outline-none w-1/3"
//                 />

//                 <div className="flex items-center gap-4">
//                     <Link to="/login">
//                         <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-600">
//                             Logout
//                         </button>
//                     </Link>

//                     {user?.profileImageUrl && (
//                         <img
//                             src={user.profileImageUrl}
//                             alt="Profile"
//                             className="w-10 h-10 rounded-full object-cover border border-gray-300"
//                         />
//                     )}
//                 </div>
//             </header>

//             <main className="mt-10 text-center">
//                 <h1 className="text-3xl font-semibold text-gray-800">Welcome to Home Page</h1>
//             </main>
//         </>
//     );
// };

// export default Header;





















// // only navbar with home page

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
        setMessage('✅ Logged out successfully');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Instagram</h1>

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
                        <>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                            <Link to={`/profile/${user?.id}`}>
                                <img
                                    src={
                                        user?.profileImageUrl
                                            ? user.profileImageUrl
                                            : "https://via.placeholder.com/150?text=Avatar"
                                    }
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <main className="p-4 text-center">
                <h2 className="text-2xl font-semibold mt-4">Home Page</h2>
                {message && (
                    <p
                        className={`text-sm mt-2 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'
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
