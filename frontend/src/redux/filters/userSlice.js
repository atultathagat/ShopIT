import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isUserAuthenticated: false
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
        }
    }
});

export default userSlice.reducer;
export const {setUser, setUserAuthenticated} = userSlice.actions;
