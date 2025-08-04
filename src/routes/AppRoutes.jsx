import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import SelectProfile from '../pages/SelectProfile';
import Profile from '../pages/profile/Profile';
import DiscoverPage from '../pages/Discover';



const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/select-profile" element={<SelectProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
);

export default AppRoutes;
