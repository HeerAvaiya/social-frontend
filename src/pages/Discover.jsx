// src/pages/Discover.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Discover() {
    const navigate = useNavigate();
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [me, setMe] = useState(null);
    const [users, setUsers] = useState([]);        
    const [followingIds, setFollowingIds] = useState(new Set());
    const [pendingIds, setPendingIds] = useState(new Set());   
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                // who am I?
                const meRes = await api.get("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const meData = meRes.data?.data || meRes.data?.user;
                setMe(meData);

                // who do I follow (accepted)?
                const fRes = await api.get(`/users/${meData.id}/following`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fSet = new Set((fRes.data?.following || []).map(u => u.id));
                setFollowingIds(fSet);

                // discover list
                const listRes = await api.get("/users/discover", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(listRes.data?.users || []);
            } catch (e) {
                if (e?.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    setErr(e?.response?.data?.message || "Failed to load discover.");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [navigate, token]);

    const filtered = users.filter(u =>
        u.username?.toLowerCase().includes(q.trim().toLowerCase())
    );

    const handleFollow = async (userId) => {
        try {
            await api.post(`/users/${userId}/follow`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
           
            const target = users.find(u => u.id === userId);
            if (target?.isPrivate) {
                setPendingIds(prev => new Set(prev).add(userId));
            } else {
                setFollowingIds(prev => new Set(prev).add(userId));
            }
        } catch (e) {
            alert(e?.response?.data?.message || "Follow failed");
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await api.delete(`/users/${userId}/unfollow`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFollowingIds(prev => {
                const copy = new Set(prev);
                copy.delete(userId);
                return copy;
            });
            setPendingIds(prev => {
                const copy = new Set(prev);
                copy.delete(userId);
                return copy;
            });
        } catch (e) {
            alert(e?.response?.data?.message || "Unfollow failed");
        }
    };

    if (loading) return <div className="p-6">Loading…</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple header */}
            <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
                <Link to="/home" className="text-pink-600 font-bold text-xl">Instagram</Link>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search users…"
                    className="border rounded px-3 py-1 text-sm w-64"
                />
                <Link to="/profile">
                    <img
                        src={me?.profileImageUrl || "https://via.placeholder.com/80?text=Me"}
                        alt="me"
                        className="w-9 h-9 rounded-full object-cover border"
                    />
                </Link>
            </header>

            <main className="max-w-xl mx-auto p-4">
                {err && <p className="text-red-600 text-sm mb-4">{err}</p>}

                {filtered.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8">No users found.</p>
                ) : (
                    <ul className="space-y-3 mt-4">
                        {filtered.map((u) => {
                            const isFollowing = followingIds.has(u.id);
                            const isPending = pendingIds.has(u.id);

                            return (
                                <li key={u.id} className="bg-white border rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={u.profileImageUrl || "https://via.placeholder.com/80?text=U"}
                                            alt={u.username}
                                            className="w-10 h-10 rounded-full object-cover border"
                                        />
                                        <div>
                                            <div className="font-medium">{u.username}</div>
                                            <div className="text-xs text-gray-500">
                                                {u.isPrivate ? "Private account" : "Public account"}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {!isFollowing && !isPending && (
                                            <button
                                                onClick={() => handleFollow(u.id)}
                                                className="px-3 py-1 text-sm rounded bg-pink-600 text-white hover:bg-pink-700"
                                            >
                                                Follow
                                            </button>
                                        )}

                                        {isPending && (
                                            <button
                                                onClick={() => handleUnfollow(u.id)}
                                                className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400"
                                                title="Cancel request"
                                            >
                                                Requested
                                            </button>
                                        )}

                                        {isFollowing && (
                                            <button
                                                onClick={() => handleUnfollow(u.id)}
                                                className="px-3 py-1 text-sm rounded border hover:bg-gray-100"
                                            >
                                                Following
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
}
