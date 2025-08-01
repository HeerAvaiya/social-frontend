import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearResetMessages, resetPassword } from "../features/auth/resetPasswordSlice";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { loading, successMessage, errorMessage } = useSelector(
        (state) => state.resetPassword
    );

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            dispatch(clearResetMessages());
            alert("Passwords do not match");
            return;
        }

        dispatch(resetPassword({ token, newPassword }));
    };

    useEffect(() => {
        if (successMessage) {
            setTimeout(() => {
                navigate("/login");
                dispatch(clearResetMessages());
            }, 2000);
        }
    }, [successMessage, navigate, dispatch]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleReset}
                className="bg-white border border-black/50 p-8 rounded-xl shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                {errorMessage && (
                    <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                )}
                {successMessage && (
                    <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md hover:bg-pink-600"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
