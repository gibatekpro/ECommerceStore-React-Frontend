import './HomePage.css'
import LargeCarousel from "../../components/carousels/large_carousel/LargeCarousel";
import FeaturedProducts from "../../components/featured_products/FeaturedProducts";
import FeaturedCategory from "../../components/featured_category/FeaturedCategory";
import ProductCategoriesCarousel
    from "../../components/carousels/product_categories_carousel/ProductCategoriesCarousel";
import React, {useEffect, useState} from "react";
import {Util} from "../../util/utils";
import Product from "../../models/Product";
import {useAuth} from "../../services/auth/AuthProvider";
import {useCartService} from "../../services/CartServiceProvider";
import {useNavigate} from "react-router-dom";
import ProductCategory from "../../models/ProductCategory";
import productCategory from "../../models/ProductCategory";

function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [productCategories, setProductCategories] = useState([]);
    const [httpError, setHttpError] = useState(true);
    let navigate = useNavigate();


    useEffect(() => {

        const fetchProductCategories = async () => {

            const baseUrl = `${Util.apiUrl}ProductCategories`;

            setIsLoading(true);

            try {
                const response = await fetch(baseUrl).then();
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                await response.json().then((data) => {

                    let productCategories = data.map((item) => {

                        return ProductCategory.fromProps(item);
                    });

                    setProductCategories(productCategories);


                });
            } catch (error) {
                console.error('Error fetching product categories :', error.message);
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

    if (isLoading) {
        return (<div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>);

    }

    function getRandomNumber(min, max) {

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomNum = getRandomNumber(0, productCategories.length);


    return (
        <div>
            <LargeCarousel/>
            <div className="b-divider"></div>
            <FeaturedProducts/>
            {productCategories.length > 1 ?

                productCategories.slice(randomNum, randomNum + 2).map((productCategory, index) => (

                    <FeaturedCategory
                        key={productCategory.id}
                        index = {index}
                        productCategory={productCategory}
                    />

                ))
                :
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <span style={{display: "block", textAlign: "center"}}>Could not load data.</span>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

            }
            <ProductCategoriesCarousel/>
        </div>
    );

}

export default HomePage;