import './ProductCategoriesCarousel.css';

import ProductCard from "../../cards/product_card/ProductCard";
import {useEffect, useState} from "react";
import {Util} from "../../../util/utils";
import {ProductCategory} from "../../../models/ProductCategory";
import ProductCategoryCard from "../../cards/product_category_card/ProductCategoryCard";
import React from 'react';
import Slider from 'react-slick';
import LoadingSpinner from "../../loading_spinner/LoadingSpinner";


function ProductCategoriesCarousel() {

    const [productCategories, setProductCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchProductCategories = async () => {
            const baseUrl = `${Util.apiUrl}productCategories`;

            setIsLoading(true);
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                const data = await response.json();
                // console.log(data);
                setProductCategories(data);
            } catch (error) {
                console.error('Error fetching product categories:', error.message);
                setHttpError(error.message);
            }finally {
                setIsLoading(false);
            }
        };

        fetchProductCategories().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });
    }, []);


    if (isLoading) {
        return (
            <LoadingSpinner/>
        );

    }

    if (httpError) {
        return (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <span style={{display: "block", textAlign: "center"}}>Sorry!!! Could not load data.</span>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        );
    }


    const settings = {
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: false,
                    autoplaySpeed: 3000,
                    initialSlide: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    dots: false
                }
            }
        ]
    };

    return (

        <div className="mt-3 mb-2">
            <div className="d-flex flex-column align-items-center align-items-sm-center align-items-md-center">
                <h1 className="Text grey fw-bold">Product Categories</h1>

                <p className="featured h3">What are you shopping for</p>

                <p className="featured p">Checkout these categories for what you want </p>
            </div>
            <div className="album py-5 px-5 bg-body-tertiary ">
                <div className="justify-content-center align-content-center">
                    <Slider {...settings}>
                        {productCategories.map(category => (
                            <div key={category.id}>
                                <ProductCategoryCard productCategory={category}/>
                            </div>
                        ))}
                    </Slider>

                </div>
            </div>
        </div>

    );
}

export default ProductCategoriesCarousel;