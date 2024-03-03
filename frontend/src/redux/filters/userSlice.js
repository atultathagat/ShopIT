import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isUserAuthenticated: false,
    loading: true
};

export const userSlice = createSlice({
    initialState,
    name: 'userSlice',
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setUserAuthenticated(state, action) {
            state.isUserAuthenticated = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        }
    }
});

export default userSlice.reducer;
export const {setUser, setUserAuthenticated, setLoading} = userSlice.actions;
