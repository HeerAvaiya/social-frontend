import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearProfileState, uploadProfileImage } from '../features/profile/profileSlice';


const SelectProfile = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.profile);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = () => {
        if (!image) return alert("Please select an image to upload.");
        dispatch(uploadProfileImage(image));
    };

    const handleSkip = () => {
        navigate('/');
    };

    useEffect(() => {
        if (success) {
            dispatch(clearProfileState());
            navigate('/');
        }
    }, [success, navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center border border-black/50">
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

                {error && <p className="text-red-600 mb-2">{error}</p>}
                {loading && <p className="text-blue-600 mb-2">Uploading...</p>}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={loading}
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
