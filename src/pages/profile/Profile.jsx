import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import EditProfileModal from '../../components/EditProfileModal';

const AVATAR_FALLBACK = 'https://via.placeholder.com/150?text=Avatar';

export default function Profile() {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const token = localStorage.getItem('token');
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const loadMe = useCallback(async () => {
        try {
            const res = await api.get('/users/me', { headers: authHeader });
            const user = res.data?.data || res.data?.user || res.data;
            setMe(user);

            try {
                const [fRes, gRes] = await Promise.all([
                    api.get(`/users/${user.id}/followers`, { headers: authHeader }),
                    api.get(`/users/${user.id}/following`, { headers: authHeader }),
                ]);
                setFollowersCount(fRes.data?.followers?.length || 0);
                setFollowingCount(gRes.data?.following?.length || 0);
            } catch { }

            // TODO: replace with your real posts endpoint and setter
            setPosts([]);
        } catch (err) {
            const status = err?.response?.status;
            if (status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error('Fetch profile failed:', err?.response?.data || err?.message);
            }
        }
    }, [authHeader, navigate]);

    useEffect(() => {
        loadMe();
    }, [loadMe]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append('image', file);

        try {
            await api.post('/users/profile/image', form, {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeader },
            });
            await loadMe();
        } catch (err) {
            alert(err?.response?.data?.message || 'Avatar update failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!me) {
        return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="text-2xl font-bold text-pink-600">Instagram</div>
                <div className="flex items-center gap-3">
                    <input placeholder="Search…" className="border rounded-md px-3 py-1 text-sm w-48 sm:w-64" />
                    <img
                        src={me.profileImageUrl || AVATAR_FALLBACK}
                        alt="me"
                        className="w-9 h-9 rounded-full object-cover border cursor-pointer"
                        title="Profile"
                        onClick={() => setShowSettings((s) => !s)}
                    />
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4">
                <section className="flex gap-6 sm:gap-10 items-center">
                    <div className="relative">
                        <img
                            src={me.profileImageUrl || AVATAR_FALLBACK}
                            alt="avatar"
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border"
                        />
                        <label
                            htmlFor="avatar-file"
                            className="absolute -bottom-2 -right-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl cursor-pointer"
                            title="Change profile photo"
                        >
                            +
                        </label>
                        <input id="avatar-file" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl sm:text-2xl font-semibold">{me.username}</h2>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="ml-2 px-3 py-1 border rounded hover:bg-gray-100"
                                title="Settings"
                            >
                                ☰
                            </button>
                        </div>
                        <div className="flex gap-6 mt-3 text-sm sm:text-base">
                            <span><strong>{posts.length}</strong> posts</span>
                            <span><strong>{followersCount}</strong> followers</span>
                            <span><strong>{followingCount}</strong> following</span>
                        </div>
                        {me.bio && <p className="mt-3 text-gray-700">{me.bio}</p>}
                    </div>
                </section>

                <div className="border-t my-6" />

                <section>
                    {posts.length === 0 ? (
                        <p className="text-center text-gray-500">No posts yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                            {posts.map((p) => (
                                <img key={p.id} src={p.imageUrl} alt={p.caption || 'post'} className="aspect-square object-cover rounded" />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {showSettings && (
                <EditProfileModal
                    initial={{ username: me.username, bio: me.bio || '' }}
                    onClose={() => setShowSettings(false)}
                    onSaved={async () => { await loadMe(); setShowSettings(false); }}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}