import './FeaturedProducts.css'
import ProductCard from "../cards/product_card/ProductCard";
import React, {useEffect, useState} from "react";
import {Util} from "../../util/utils";
import Product from "../../models/Product";

function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchProductCategories = async () => {
            const baseUrl = `${Util.apiUrl}Products/search/findByProductCategoryId?id=11`;

            setIsLoading(true);
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                const data = await response.json();
                // console.log(data);
                setProducts(data._embedded.data);
            } catch (error) {
                console.error('Error fetching product categories:', error.message);
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

    if (httpError) {
        return (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <span style={{display: "block", textAlign: "center"}}>Sorry!!! Could not load data.</span>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        );
    }

    return (
        <div className="mt-3 mb-2">
            <div className="d-flex flex-column align-items-center align-items-sm-center align-items-md-center">
                <h1 className="Text grey fw-bold">Featured Products</h1>

                <p className="featured h3">Top Selling Products</p>

                <p className="featured p">Select from a range of great products</p>
            </div>
            <div className="album d-flex py-5 bg-body-tertiary">
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 ">
                        {products.slice(0, 8).map(product => {
                            return (
                                <div className="col d-flex justify-content-center" key={product.id}>
                                    <ProductCard
                                        product={product}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>

    )
        ;

}

export default FeaturedProducts;