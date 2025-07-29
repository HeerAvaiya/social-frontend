import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/auth/Home'
import Register from '../pages/auth/Register'
import Login from '../pages/auth/Login'
import SelectProfile from '../pages/auth/SelectProfile'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

const AppRoutes = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/select-profile' element={<SelectProfile />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/reset-password/:token' element={<ResetPassword />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default AppRoutes

