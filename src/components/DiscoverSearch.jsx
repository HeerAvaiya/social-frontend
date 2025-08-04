import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { discoverUsers, clearDiscover } from '../features/discover/discoverSlice';
import { Link } from 'react-router-dom';

function DiscoverSearch() {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const { users, loading } = useSelector((state) => state.discover);

    useEffect(() => {
        if (query.trim()) {
            const delay = setTimeout(() => {
                dispatch(discoverUsers(query));
            }, 500);
            return () => clearTimeout(delay);
        } else {
            dispatch(clearDiscover());
        }
    }, [query, dispatch]);

    useEffect(() => {
        console.log("users from redux", users);
    }, [users]);


    return (
        <div className="relative w-full max-w-sm">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users..."
                className="border border-gray-300 rounded px-3 py-1 w-full"
            />
            {loading && <p className="text-sm mt-1">Searching...</p>}


            {!loading && Array.isArray(users) && users.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border mt-1 rounded shadow z-10 max-h-64 overflow-y-auto">
                    {users.map((user) => (
                        <Link
                            to={`/user/${user.id}`}
                            key={user.id}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 border-b"
                        >
                            <img
                                src={user.profileImageUrl || 'https://via.placeholder.com/40'}
                                alt="avatar"
                                className="w-8 h-8 rounded-full mr-3 object-cover"
                            />
                            <span className="text-sm">{user.username}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DiscoverSearch;