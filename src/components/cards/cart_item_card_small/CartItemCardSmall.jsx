import './CartItemCardSmall.css'

import imagePlaceholder from "../../../assets/images/Placeholder Image Card.jpeg";
import {useCartService} from "../../../services/CartServiceProvider";
import Product from "../../../models/Product";
import React, {useEffect, useState} from "react";
import CurrencyValue, {Util} from "../../../util/utils";
import CartItem from "../../../models/CartItem";

function CartItemCardSmall(props) {

    let cartItem = props.cartItem;


    return (
        <li className="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 className="my-0">{cartItem.productName}</h6>
                <small className="text-body-secondary">Quantity: {cartItem.quantity}</small>
            </div>
            <span className="text-body-secondary">{CurrencyValue(cartItem.unitPrice*cartItem.quantity)}</span>
        </li>
    );
}

export default CartItemCardSmall;