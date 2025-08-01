import axios from 'axios';
const API_URL = 'http://localhost:8001/api/users';

const getProfile = async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

const updateProfile = async (profileData, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const res = await axios.put(`${API_URL}/me`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

const userService = { getProfile, updateProfile };
export default userService;
