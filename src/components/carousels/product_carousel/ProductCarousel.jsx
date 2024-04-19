import './ProductCarousel.css';

import ProductCard from "../../cards/product_card/ProductCard";
import {useEffect, useState} from "react";
import {Util} from "../../../util/utils";
import {PagedProductResponse} from "../../../models/PagedProductResponse";


function ProductCarousel() {

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl = `${Util.apiUrl}/products`;

            setIsLoading(true);
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                const productResponse = new PagedProductResponse(data._embedded, data.page);
                console.log(data._embedded);
                setProducts(data._embedded);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error.message);
                setHttpError(error.message);
                setIsLoading(false);
            }
        };

        fetchProducts().catch(err => {
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
        <div className="mt-5 mb-2">
            <div className="d-flex justify-content-between align-items-center px-5 mx-5">
                <h1 className="product-carousel Text grey fw-bold">Appliances</h1>
                <button type="button" className="outline-button green">View more</button>
            </div>
            <div id="productCarousel" className="product-carousel carousel slide mb-0" data-bs-ride="carousel">
                <div className="product-carousel carousel-indicators">
                    <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="0" className="active"
                            aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="1"
                            aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="2"
                            aria-label="Slide 3"></button>
                </div>
                <div className="product-carousel carousel-inner">
                    <div className="product-carousel carousel-item active">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 ">
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="product-carousel carousel-item">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 ">
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="product-carousel carousel-item">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 ">
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                            <div className="col d-flex justify-content-center">
                                <ProductCard
                                    hasDescription={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel"
                        data-bs-slide="prev">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="product-carousel bi bi-caret-left" viewBox="0 0 16 16">
                        <path
                            d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"/>
                    </svg>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#productCarousel"
                        data-bs-slide="next">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                         className="bi bi-caret-right" viewBox="0 0 16 16">
                        <path
                            d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"/>
                    </svg>
                    <span className="visually-hidden">Next</span>
                </button>

            </div>
        </div>

    );

}

export default ProductCarousel;