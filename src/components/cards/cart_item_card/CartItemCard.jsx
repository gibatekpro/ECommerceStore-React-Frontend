import './CartItemCard.css'

import imagePlaceholder from "../../../assets/images/Placeholder Image Card.jpeg";
import {useCartService} from "../../../services/CartServiceProvider";
import Product from "../../../models/Product";
import React, {useEffect, useState} from "react";
import CurrencyValue, {Util} from "../../../util/utils";
import CartItem from "../../../models/CartItem";

function CartItemCard(props) {
    let cartService = useCartService();

    let cartItem = CartItem.fromProps(props.cartItem);

    const [cartItemImage, setCartItemImage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchCartItemImage = async () => {
            const baseUrl = `${Util.apiUrl}imageData/${cartItem.productImageId}`;
            setIsLoading(true);
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                // Handle image as a blob
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setCartItemImage(imageObjectURL);
            } catch (error) {
                console.error('Error fetching image:', error.message);
                setHttpError(error.message);
                setCartItemImage(null)
            } finally {
                setIsLoading(false);
            }
        };

        fetchCartItemImage().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, []);

    const incrementQuantity = () => {
        cartService.addToCart(cartItem);
    }

    const decrementQuantity = () => {
        cartService.decrementQuantity(cartItem);
    }

    const remove = () => {
        cartService.remove(cartItem);
    }

    return (
        <div className="card w-100 m-2 bg-body-tertiary">
            <div className="row g-0">
                <div className="col-md-2 col-sm-2">
                    {cartItemImage !== null ?
                        <img src={cartItemImage} alt="CartItem"/>
                        :
                        <svg className="bd-placeholder-img" width="100%" height="250" xmlns="http://www.w3.org/2000/svg"
                             role="img" aria-label="Placeholder: Image" preserveAspectRatio="xMidYMid slice"
                             focusable="false"><title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#868e96"/>
                            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image</text>
                        </svg>
                    }
                </div>
                <div className="col-md-6" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div className="card-body">
                        <h5 className="card-title">{cartItem.productName}</h5>
                        <br/>
                        <h6 className="card-text">Unit Price: {CurrencyValue(cartItem.unitPrice)}</h6>
                    </div>
                </div>
                <div className="col-md-3"  style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="card-body">
                        <div className="items">
                            <label>Quantity</label>
                            <hr/>
                            <div className="row no-gutters">
                                <div className="col">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6F0"
                                         type="button"
                                         onClick={incrementQuantity}
                                         className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                                    </svg>
                                </div>
                                <div className="col ml-4 mr-2">
                                    {cartItem.quantity}
                                </div>
                                <div className="col">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6F0"
                                         type="button"
                                         onClick={decrementQuantity}
                                         className="bi bi-dash-square-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1"/>
                                    </svg>
                                </div>
                                <div className="col-8"></div>
                            </div>
                        </div>
                        <h6 className="my-4">Subtotal: {CurrencyValue(cartItem.quantity * cartItem.unitPrice)}</h6>
                    </div>
                </div>
                <div className="col-md-1" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div className="card-body">
                        <div className="items">
                                <button className="hard-button red"
                                        onClick={remove}>
                                    Remove
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default CartItemCard;