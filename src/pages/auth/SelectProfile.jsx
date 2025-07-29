import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 

const SelectProfile = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!image) return alert("Please select an image to upload.");

        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            const res = await api.post('/users/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            console.log("Profile image uploaded:", res.data);
            navigate('/');
        } catch (error) {
            console.error("Upload failed:", error?.response?.data || error.message);
            alert("Upload failed: " + (error?.response?.data?.message || error.message));
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Upload Your Profile Picture</h2>

                {preview && (
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                    />
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4"
                />

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Upload
                    </button>
                    <button
                        onClick={handleSkip}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectProfile;

