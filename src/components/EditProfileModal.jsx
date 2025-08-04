import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProfile, togglePrivacy, logout } from "../features/user/userSlice";

export default function EditProfileModal({ user, onClose, onSaved }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const initial = useMemo(() => ({
    username: user?.username || "",
    bio: user?.bio || "",
  }), [user]);

  const [form, setForm] = useState(initial);
  const [info, setInfo] = useState("");

  const isPrivate = user?.isPrivate;

  const isDirty =
    form.username.trim() !== initial.username.trim() ||
    form.bio.trim() !== initial.bio.trim();

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setInfo("");
  };

  const handleSave = async () => {
    if (!isDirty) {
      setInfo("No changes to save.");
      return;
    }

    const result = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(result)) {
      onSaved?.(result.payload);
      onClose?.();
    }
  };


  const handlePrivacyToggle = async () => {
    const result = await dispatch(togglePrivacy());
    if (togglePrivacy.fulfilled.match(result)) {
      onSaved?.({ ...user, isPrivate: result.payload });
    }
  };


  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white w-full max-w-md rounded-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit profile</h3>
          <button onClick={onClose} className="text-xl leading-none">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between border rounded px-3 py-2">
            <div>
              <div className="text-sm font-medium">Private account</div>
              <div className="text-xs text-gray-500">
                When private, follow requests must be approved.
              </div>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={handlePrivacyToggle}
              className={
                "w-12 h-6 rounded-full relative transition " +
                (isPrivate ? "bg-pink-600" : "bg-gray-300")
              }
              title="Toggle privacy"
            >
              <span
                className={
                  "absolute top-0.5 transition h-5 w-5 rounded-full bg-white " +
                  (isPrivate ? "right-0.5" : "left-0.5")
                }
              />
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {info && !error && <p className="text-gray-600 text-sm">{info}</p>}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded border border-red-500 text-red-600 hover:bg-red-50"
              disabled={loading}
            >
              Logout
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded border"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
