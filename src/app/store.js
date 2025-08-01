import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import postReducer from '../features/post/postSlice';
import profileReducer from '../features/profile/profileSlice';
import resetPasswordReducer from "../features/auth/resetPasswordSlice";
import passwordReducer from '../features/auth/passwordSlice';
import countsReducer from "../features/user/userCountsSlice";
import editProfileModalReducer from "../features/profile/editProfileModalSlice";
import followReducer from '../features/user/followSlice';
import discoverReducer from "../features/user/discoverSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        post: postReducer,
        profile: profileReducer,
        resetPassword: resetPasswordReducer,
        password: passwordReducer,
        user: userReducer,
        counts: countsReducer,
        editProfileModal: editProfileModalReducer,
        follow: followReducer,
        discover: discoverReducer,
    },
});

export default store;