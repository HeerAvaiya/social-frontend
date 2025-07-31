import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditProfileModal({ user, onClose, onSaved }) {
    const navigate = useNavigate();

    const initial = useMemo(
        () => ({
            username: user?.username || "",
            bio: user?.bio || "",
        }),
        [user]
    );

    const [form, setForm] = useState(initial);
    const [isPrivate, setIsPrivate] = useState(!!user?.isPrivate);
    const [saving, setSaving] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    useEffect(() => {
        setForm(initial);
        setIsPrivate(!!user?.isPrivate);
    }, [initial, user?.isPrivate]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const isDirty =
        form.username.trim() !== initial.username.trim() ||
        form.bio.trim() !== initial.bio.trim();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo("");
        setError("");
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSave = async () => {
        setError("");
        setInfo("");

        if (!isDirty) {
            setInfo("No changes to save.");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const res = await api.put("/users/me", form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated =
                res?.data?.data || res?.data?.user || { ...user, ...form, isPrivate };
            onSaved?.(updated);
            onClose?.();
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const togglePrivacy = async () => {
        try {
            setToggling(true);
            setError("");
            const token = localStorage.getItem("token");
            const res = await api.put(
                "/users/me/privacy",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const next = !!res?.data?.isPrivate;
            setIsPrivate(next);
            onSaved?.({ ...user, username: form.username, bio: form.bio, isPrivate: next });
        } catch (e) {
            setError(e?.response?.data?.message || e.message || "Failed to toggle privacy");
        } finally {
            setToggling(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
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
                    <button onClick={onClose} aria-label="Close" className="text-xl leading-none">
                        ✕
                    </button>
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
                            disabled={toggling}
                            onClick={togglePrivacy}
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
                            disabled={saving || toggling}
                        >
                            Logout
                        </button>

                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded border"
                                disabled={saving || toggling}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}