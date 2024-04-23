import './FeaturedCategory.css'
import BabyProducts from "../../assets/images/Featured Category/BabyProducts.jpg";
import Gaming from "../../assets/images/Featured Category/Gaming.jpeg";
import {Link} from "react-router-dom";
import productCategory, {ProductCategory} from "../../models/ProductCategory";
import Product from "../../models/Product";
import React, {useEffect, useState} from "react";
import {Util} from "../../util/utils";

function FeaturedCategory(props) {
    let productCategory = ProductCategory.fromProps(props.productCategory);

    const [productCategoryImage, setProductCategoryImage] = useState();
    const [httpError, setHttpError] = useState(false);

    useEffect(() => {
        const fetchProductImage = async () => {
            const baseUrl = `${Util.apiUrl}imageData/${productCategory.categoryImageId}`;
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    setHttpError(true);
                    throw new Error('Failed to fetch image');
                }

                // Handle image as a blob
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProductCategoryImage(imageObjectURL);
            } catch (error) {
                console.error('Error fetching image:', error.message);
                setHttpError(true)
            }
        };

        fetchProductImage().catch(err => {
            setHttpError(err.message);
        });
    }, []);

    let index = props.index;

    return (
        <div className="row featurette">
            {index === 0 ? (
                <>
                    <hr className="featurette-divider d-lg-none"/>
                    <div className="row featurette">
                        <div className="col-md-6 p-5">
                            <h2 className="featurette-heading fw-normal lh-1">
                                Delightful Finds for Your {productCategory.categoryName}!
                            </h2>
                            <p className="lead">
                                {productCategory.categoryDescription}
                                {'\n'}
                                We promise to give you only the best out there.
                            </p>

                            <Link to={`product-categories/${productCategory.categoryName}/${productCategory.id}`}>
                                <button className="hard-button green uppercase" >
                                    Shop Now
                                </button>
                            </Link>
                        </div>
                        <div className="col-md-6">
                            {httpError ? (
                                <svg
                                    className="bd-placeholder-img"
                                    width="100%"
                                    height="auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    role="img"
                                    aria-label="Placeholder: Image"
                                    preserveAspectRatio="xMidYMid slice"
                                    focusable="false"
                                >
                                    <title>Placeholder</title>
                                    <rect width="100%" height="100%" fill="#868e96"/>
                                    <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                                        Image
                                    </text>
                                </svg>
                            ) : (
                                <img src={productCategoryImage} className="featured img" alt="Example image"/>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <hr className="featurette-divider d-lg-none"/>
                    <div className="row featurette">
                        <div className="col-md-6">
                            {httpError ? (
                                <svg
                                    className="bd-placeholder-img"
                                    width="100%"
                                    height="auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    role="img"
                                    aria-label="Placeholder: Image"
                                    preserveAspectRatio="xMidYMid slice"
                                    focusable="false"
                                >
                                    <title>Placeholder</title>
                                    <rect width="100%" height="100%" fill="#868e96"/>
                                    <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                                        Image
                                    </text>
                                </svg>
                            ) : (
                                <img src={productCategoryImage} className="featured img" alt="Example image"/>
                            )}
                        </div>
                        <div className="col-md-6 p-5">
                            <h2 className="featurette-heading fw-normal lh-1">
                                Great Selections for {productCategory.categoryName}
                            </h2>
                            <p className="lead">
                                {productCategory.categoryDescription}
                                {'\n'}
                                We have the best selections for you. Keep smiling while you shop with us.
                            </p>

                            <Link to={`product-categories/${productCategory.categoryName}/${productCategory.id}`}>
                                <button className="hard-button green uppercase">
                                    Shop Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

}


export default FeaturedCategory;