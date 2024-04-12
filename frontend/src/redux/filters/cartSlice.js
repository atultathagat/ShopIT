import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
 shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
};

export const cartSlice = createSlice({
    initialState,
    name: 'cartSlice',
    reducers: {
        setCartItem(state, action) {
            const item = action.payload;
            const isItemExists = state.cartItems.find(cartItem => cartItem.product === item.product);
            if(isItemExists) {
                state.cartItems = state.cartItems.map(cartItem => cartItem.product === item.product ? item : cartItem)
            } else {
                state.cartItems = [...state.cartItems, item]
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        }, 
         removeCartItem(state, action) {
            const id = action.payload;
            state.cartItems = state.cartItems.filter(cartItem => cartItem.product !== id);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },
        clearCartItems(state) {
             state.cartItems = [];
            localStorage.removeItem('cartItems')
        },
        saveShippingInfo(state, action) {
           state.shippingInfo = action.payload;
           localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo))
       }
    }
});

export default cartSlice.reducer;
export const {setCartItem, removeCartItem, saveShippingInfo, clearCartItems} = cartSlice.actions;
