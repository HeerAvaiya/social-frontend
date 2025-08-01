import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, uploadProfileImage, setUser } from "../../features/user/userSlice";
import { fetchUserCounts } from "../../features/user/userCountsSlice";
import EditProfileModal from "../../components/EditProfileModal";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading } = useSelector((state) => state.user);
    const { followers, following } = useSelector((state) => state.counts);
    const [openEdit, setOpenEdit] = useState(false);
    const [posts, setPosts] = useState([]);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        dispatch(fetchUserProfile())
            .unwrap()
            .then((user) => dispatch(fetchUserCounts(user.id)))
            .catch(() => navigate("/login"));
    }, [dispatch, navigate]);

    const onFilePick = (e) => {
        const file = e.target.files?.[0];
        if (file) dispatch(uploadProfileImage(file));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!profile) return null;

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
                <div className="text-2xl font-bold text-pink-600">Instagram</div>
                <input type="text" placeholder="Search..." className="border rounded px-3 py-1 text-sm" />
                <img
                    src={profile.profileImageUrl || "https://via.placeholder.com/80?text=Avatar"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border"
                />
            </header>

            <section className="max-w-4xl mx-auto px-4 py-6 border-b">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <img
                            src={profile.profileImageUrl || "https://via.placeholder.com/150?text=Avatar"}
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
                            <h2 className="text-xl font-semibold truncate max-w-[180px]">{profile.username}</h2>
                            <button onClick={() => setOpenEdit(true)} className="border rounded px-2 py-1 text-sm">
                                ☰
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-3 text-sm">
                            <span><b>{posts.length}</b> posts</span>
                            <span><b>{followers}</b> followers</span>
                            <span><b>{following}</b> following</span>
                        </div>

                        {profile.bio && <p className="mt-2 text-gray-700 text-sm">{profile.bio}</p>}
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
                    user={profile}
                    onClose={() => setOpenEdit(false)}
                    onSaved={(updated) => dispatch(setUser(updated))}
                />
            )}
        </div>
    );
}
