import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import EditProfileModal from "../../components/EditProfileModal";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const isFetchingRef = useRef(false);

    const token = useMemo(() => localStorage.getItem("token"), []);

    const fetchProfile = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        try {
            const res = await api.get("/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data?.data || res.data?.user || null);
        } catch (e) {
            if (e?.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                console.error("Fetch profile failed:", e?.message || e);
            }
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }, [navigate, token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (!user?.id || !token) return;
        let cancelled = false;
        (async () => {
            try {
                const [followersRes, followingRes] = await Promise.all([
                    api.get(`/users/${user.id}/followers`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    api.get(`/users/${user.id}/following`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                if (!cancelled) {
                    setFollowersCount(followersRes.data?.followers?.length || 0);
                    setFollowingCount(followingRes.data?.following?.length || 0);
                }
            } catch (e) {
                console.error("Fetch counts failed:", e?.message || e);
            }
        })();
        return () => { cancelled = true; };
    }, [user?.id, token]);

    const handleUploadAvatar = async (file) => {
        if (!file) return;
        try {
            const fd = new FormData();
            fd.append("image", file);
            const res = await api.post("/users/profile/image", fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser((u) => ({
                ...(u || {}),
                profileImageUrl:
                    res.data?.profileImageUrl || res.data?.user?.profileImageUrl || u?.profileImageUrl,
                cloudinaryPublicId:
                    res.data?.user?.cloudinaryPublicId || u?.cloudinaryPublicId,
            }));
        } catch (e) {
            console.error("Avatar upload failed:", e?.response?.data || e.message);
            alert(e?.response?.data?.message || "Upload failed");
        }
    };

    const onFilePick = (e) => {
        const f = e.target.files?.[0];
        handleUploadAvatar(f);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
                <div className="text-2xl font-bold text-pink-600">Instagram</div>
                <input type="text" placeholder="Search..." className="border rounded px-3 py-1 text-sm" />
                <img
                    src={user.profileImageUrl || "https://via.placeholder.com/80?text=Avatar"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border"
                />
            </header>

            <section className="max-w-4xl mx-auto px-4 py-6 border-b">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <img
                            src={user.profileImageUrl || "https://via.placeholder.com/150?text=Avatar"}
                            alt="profile"
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                        <label className="absolute -bottom-1 -right-1 bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                            +
                            <input type="file" accept="image/*" className="hidden" onChange={onFilePick} />
                        </label>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold truncate max-w-[180px]">{user.username}</h2>
                            <button onClick={() => setOpenEdit(true)} className="border rounded px-2 py-1 text-sm">
                                ☰
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-3 text-sm">
                            <span><b>{posts.length}</b> posts</span>
                            <span><b>{followersCount}</b> followers</span>
                            <span><b>{followingCount}</b> following</span>
                        </div>

                        {user.bio && <p className="mt-2 text-gray-700 text-sm">{user.bio}</p>}
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 py-6">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts yet.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {posts.map((p) => (
                            <img key={p.id} src={p.imageUrl} alt="" className="w-full aspect-square object-cover" />
                        ))}
                    </div>
                )}
            </section>

            {openEdit && (
                <EditProfileModal
                    user={user}
                    onClose={() => setOpenEdit(false)}
                    onSaved={(updated) => setUser(updated)}
                />
            )}
        </div>
    );
}
