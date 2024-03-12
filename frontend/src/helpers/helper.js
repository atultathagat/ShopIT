export default (searchParams, key, value) => {
    const hasValueInParams = searchParams.has(key);
    if(hasValueInParams && value) {
        searchParams.set(key, value);
    } else if(value) {
        searchParams.append(key, value);
    } else if(hasValueInParams) {
        searchParams.delete(key);
    }
    return searchParams;
};

export const calculateOrderCost = cartItems => {
    const itemsPrice = Number(cartItems.reduce((acc, cartItem) => cartItem.price * cartItem.quantity + acc, 0).toFixed(2));
    const shippingPrice = itemsPrice > 200 ? 0 : 50;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice =  (itemsPrice + shippingPrice + taxPrice).toFixed(2);
    return {
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    }
}