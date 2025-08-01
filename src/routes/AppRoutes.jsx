// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
// import Home from '../pages/auth/Home';
// import Register from '../pages/auth/Register';
// import Login from '../pages/auth/Login';
// import SelectProfile from '../pages/auth/SelectProfile';
// import ForgotPassword from '../pages/auth/ForgotPassword';
// import ResetPassword from '../pages/auth/ResetPassword';
// import Profile from '../pages/profile/Profile';
// import Discover from '../pages/Discover';


// const requireToken = () => !!localStorage.getItem('token');

// export default function AppRoutes() {
//     return (
//         <BrowserRouter>
//             <Routes>
// <Route path="/" element={requireToken() ? <Navigate to="/home" /> : <Login />} />
// <Route path="/home" element={<Home />} />
// <Route path="/profile" element={<Profile />} />
// <Route path="/register" element={<Register />} />
// <Route path="/login" element={<Login />} />
// <Route path="/select-profile" element={<SelectProfile />} />
// <Route path="/forgot-password" element={<ForgotPassword />} />
// <Route path="/reset-password/:token" element={<ResetPassword />} />
// <Route path="/discover" element={<Discover />} />
//             </Routes>
//         </BrowserRouter>
//     );
// }







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
        import React from 'react';
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
