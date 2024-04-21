import './CartDetailsPage.css'
import {useCartService} from "../../services/CartServiceProvider";
import CurrencyValue from "../../util/utils";
import cartItem from "../../models/CartItem";
import CartItemCard from "../../components/cards/cart_item_card/CartItemCard";
import React from "react";
import ProductCard from "../../components/cards/product_card/ProductCard";
import {json} from "react-router-dom";

function CartDetailsPage() {
    let cartService = useCartService()

    let cartItems = cartService.storedCartItems !== null ? cartService.storedCartItems : [];


    return (
        <div className="mt-5">
            <h5 className="mx-3">Cart({cartService.totalQuantity})</h5>
            <div hidden={cartItems.length < 1}>
                {cartItems.map(cartItem => {
                    return (
                        <CartItemCard
                            key={cartItem.id}
                            cartItem={cartItem}
                        />
                    );
                })}
            </div>
            <div className="m-5" hidden={cartService.totalQuantity < 1}>
                <p>Total Quantity: {cartService.totalQuantity}</p>
                <p>Shipping: FREE</p>
                <p>Total Price: {CurrencyValue(cartService.totalPrice)}</p>
                <div>
                    <button className="hard-button blue">Checkout</button>
                </div>
            </div>
            <div hidden={cartItems.length > 0}>
                <div className="alert alert-warning col-md-12 m-2" role="alert"
                     style={{textAlign: "center"}}>
                    Your shopping cart is empty.
                </div>
                <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <a href="/">
                        <button className="outline-button blue">
                            Start Shopping
                        </button>
                    </a>
                </div>
            </div>
        </div>

    );
}

export default CartDetailsPage;