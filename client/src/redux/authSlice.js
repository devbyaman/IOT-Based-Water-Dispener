import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const initialState = {
    token: token ? token : null,
    role: role ? role : null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
