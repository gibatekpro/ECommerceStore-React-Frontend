import './ProductCard.css'
import image3_small from "../../../assets/images/carousel/image3_small.jpg";
import React, {useEffect, useState} from "react";
import CurrencyValue, {Util} from "../../../util/utils";
import imagePlaceholder from "../../../assets/images/Placeholder Image Card.jpeg";
import Product from "../../../models/Product";
import {Link} from "react-router-dom";
import StarsReview from "../../stars_review/StarsReview";

// import {useHistory, Link} from 'react-router-dom';

function ProductCard(props) {

    const productModel = Product.fromProps(props.product);

    const [productImage, setProductImage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchProductImage = async () => {
            const baseUrl = `${Util.apiUrl}imageData/${props.product.productImageId}`;
            setIsLoading(true);
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch image');
                }

                // Handle image as a blob
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProductImage(imageObjectURL);
            } catch (error) {
                console.error('Error fetching image:', error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductImage().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, []);

    return (
        // <Link style={{textDecoration: "none"}} to={`/product-details/${productModel.id}`}>
        <div className="card shadow-sm">
            <Link className="product-card-link" to={`/product-details/${productModel.id}`} style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                textDecoration: "none",
                color: "inherit"}}>
                <div className="card-img-top">
                    {isLoading || httpError ? <img src={imagePlaceholder} alt="Example image"/> :
                        <img src={productImage} alt="Example image"/>}
                </div>
                <div className="card-body">
                    <h6>{productModel.productName}</h6>
                    <p className="card-text">{productModel.description}</p>
                    <StarsReview
                        rating={4.5}
                        size={16}
                    />
                    <br/>
                    <div className="d-flex justify-content-between align-items-center">
                        <button type="button" className="outline-button green">Add to cart</button>
                        <small className="text-body-secondary">{CurrencyValue(productModel.unitPrice)}</small>
                    </div>
                </div>
            </Link>
        </div>
    )
        ;
}

export default ProductCard;