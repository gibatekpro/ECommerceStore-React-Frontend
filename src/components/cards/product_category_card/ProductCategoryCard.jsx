import './ProductCategoryCard.css'
import imagePlaceholder from "../../../assets/images/Placeholder Image Card.jpeg";
import React, {useEffect, useState} from "react";
import {Util} from "../../../util/utils";
import ProductCategory from "../../../models/ProductCategory";
import {Link} from "react-router-dom";

function ProductCategoryCard(props) {

    const [productImage, setProductImage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchProductCategories = async () => {
            const baseUrl = `${Util.apiUrl}imageData/${props.productCategory.categoryImageId}`;
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

        fetchProductCategories().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, []);

    const categoryModel = ProductCategory.fromProps(props.productCategory)

    return (
        <div className="product-category-card card shadow-sm">
            <div className="product-category-card image-div">
                { isLoading || httpError ? <img src={imagePlaceholder} alt="Example image"/> :
                    <img src={productImage} alt="Example image"/>}
            </div>
            <div className="card-body">
                <h5>{categoryModel.categoryName}</h5>
                <p className="card-text">{categoryModel.categoryDescription}</p>
                <div className="d-flex justify-content-center align-items-center">
                    <Link to={`product-categories/${categoryModel.categoryName}/${categoryModel.id}`}>
                        <button type="button" className="outline-button green">Shop now</button>
                    </Link>
                </div>
            </div>
        </div>

    );
}

export default ProductCategoryCard;