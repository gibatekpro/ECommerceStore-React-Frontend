import React, {createContext, useContext, useEffect, useState} from 'react';
import CartItem from "../models/CartItem";
import {Util} from "../util/utils";

// Creating the auth context with default values
const CartServiceContext = createContext(null);

// AuthProvider component
export const CartServiceProvider = ({children}) => {

    const [storedCartItems, setStoredCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')));
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    // localStorage.removeItem('cartItems')


    let cartItems = storedCartItems !== null ? storedCartItems : [];

    useEffect(() => {
        computeCartTotals(storedCartItems);
    }, [storedCartItems]);

    const addToCart = (cartItem) => {
        let theCartItem = CartItem.fromProps(cartItem);

        //check if we already have the item in our cart
        let _alreadyExistsInCart = false;
        let _existingCartItem = undefined;

        if (cartItems.length > 0) {
            //find the item in the cart based on item id
            // === checks if two values are equal in
            // value and type.
            console.log(cartItems);
            _existingCartItem = cartItems.find(cartItem => cartItem.id === theCartItem.id)

            //check if we found it
            _alreadyExistsInCart = (_existingCartItem !== undefined)

        }

        if (_alreadyExistsInCart) {

            //increment the quantity
            _existingCartItem.quantity++;

        } else {
            //just add the item to the array
            cartItems.push(theCartItem);
        }
        //compute the cart quantity and cart total
        computeCartTotals();

    }

    function computeCartTotals() {

        let totalPriceValue = 0;
        let totalQuantityValue = 0;

        for (let currentCartItem of cartItems) {

            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;

        }
        //publish the new values ... all subscribers will receive the new data
        //.next(...) will publish/send event
        setTotalPrice(totalPriceValue);
        setTotalQuantity(totalQuantityValue);

        //persist cart data
        persistCartItems();

    }

    function persistCartItems() {

        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        setStoredCartItems(cartItems);

    }

    const remove = (theCartItem) => {

        //get index of item in the array
        const itemIndex = cartItems.findIndex(cartItem => cartItem.id = theCartItem.id);

        //if found(index will be greater than -1), remove the item from the array at the given index
        if (itemIndex > -1) {
            cartItems.splice(itemIndex, 1);

            computeCartTotals();
        }

    }

    const decrementQuantity = (cartItem) => {

        cartItem.quantity--;

        let theCartItem = CartItem.fromProps(cartItem);

        //check if we already have the item in our cart
        let _alreadyExistsInCart = false;
        let _existingCartItem = undefined;

        if (cartItems.length > 0) {
            //find the item in the cart based on item id
            // === checks if two values are equal in
            // value and type.
            _existingCartItem = cartItems.find(cartItem => cartItem.id === theCartItem.id)

            //check if we found it
            _alreadyExistsInCart = (_existingCartItem !== undefined)

        }

        if (_alreadyExistsInCart) {

            //increment the quantity
            _existingCartItem.quantity--;

        }
        if (_existingCartItem.quantity === 0) {

            remove(_existingCartItem);

        } else {
            computeCartTotals();
        }

    }

    const value = {
        addToCart,
        decrementQuantity,
        remove,
        storedCartItems,
        totalPrice,
        totalQuantity
    };

    return (
        <CartServiceContext.Provider
            value={value}>
            {children}
        </CartServiceContext.Provider>
    );
};

// Custom hook to use auth context
export function useCartService() {
    return React.useContext(CartServiceContext);

}
