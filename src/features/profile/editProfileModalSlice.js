import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
};

const editProfileModalSlice = createSlice({
    name: 'editProfileModal',
    initialState,
    reducers: {
        openModal: (state) => {
            state.isOpen = true;
        },
        closeModal: (state) => {
            state.isOpen = false;
        },
    },
});

export const { openModal, closeModal } = editProfileModalSlice.actions;
export default editProfileModalSlice.reducer;
