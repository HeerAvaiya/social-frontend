import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDiscoverData, setQuery, addFollow, removeFollow } from "../features/discover/discoverSlice";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Discover() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    me,
    users,
    followingIds,
    pendingIds,
    q,
    loading,
    error,
  } = useSelector((state) => state.discover);

  useEffect(() => {
    dispatch(fetchDiscoverData()).then((action) => {
      if (action.payload?.status === 401) {
        navigate("/login");
      }
    });
  }, [dispatch, navigate]);

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(q.trim().toLowerCase())
  );

  const handleFollow = async (user) => {
    try {
      await api.post(`/users/${user.id}/follow`);
      dispatch(addFollow({ userId: user.id, isPrivate: user.isPrivate }));
    } catch (err) {
      alert(err?.response?.data?.message || "Follow failed");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.delete(`/users/${userId}/unfollow`);
      dispatch(removeFollow(userId));
    } catch (err) {
      alert(err?.response?.data?.message || "Unfollow failed");
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="text-pink-600 font-bold text-xl">Instagram</Link>
        <input
          value={q}
          onChange={(e) => dispatch(setQuery(e.target.value))}
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
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No users found.</p>
        ) : (
          <ul className="space-y-3 mt-4">
            {filtered.map((u) => {
              const isFollowing = followingIds.includes(u.id);
              const isPending = pendingIds.includes(u.id);

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
                        onClick={() => handleFollow(u)}
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
