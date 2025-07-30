import React, { useState } from 'react';
import api from '../api/axios';

export default function EditProfileModal({ initial, onClose, onSaved, onLogout }) {
    const [username, setUsername] = useState(initial.username || '');
    const [bio, setBio] = useState(initial.bio || '');
    const [saving, setSaving] = useState(false);
    const token = localStorage.getItem('token');

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put('/users/me', { username, bio }, { headers: { Authorization: `Bearer ${token}` } });
            onSaved && (await onSaved());
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const stop = (e) => e.stopPropagation();

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-5" onClick={stop}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Settings</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
                </div>

                <label className="block text-sm font-medium">Username</label>
                <input
                    className="w-full border rounded px-3 py-2 mt-1 mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="block text-sm font-medium">Bio</label>
                <textarea
                    className="w-full border rounded px-3 py-2 mt-1 mb-4"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <div className="flex items-center justify-between">
                    <button onClick={onLogout} className="px-4 py-2 rounded border bg-red-500 text-white hover:bg-red-600">Logout</button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
                        <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-60">
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}