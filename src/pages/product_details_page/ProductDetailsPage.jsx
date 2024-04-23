import './ProductDetailsPage.css'
import Product from "../../models/Product";
import StarsReview from "../../components/stars_review/StarsReview";
import React, {useEffect, useState} from "react";
import {Page} from "../../models/Page";
import CurrencyValue, {Util} from "../../util/utils";
import LoadingSpinner from "../../components/loading_spinner/LoadingSpinner";
import {useParams} from "react-router-dom";
import imagePlaceholder from "../../assets/images/Placeholder Image Card.jpeg";
import ProductsGridList from "../../components/products_grid_list/ProductsGridList";
import CartItem from "../../models/CartItem";
import {useCartService} from "../../services/CartServiceProvider";

function ProductDetailsPage() {
    let {productId} = useParams();

    const [product, setProduct] = useState(new Product());
    const [products, setProducts] = useState([]);
    const [rating, setRating] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isSimilarLoading, setIsSimilarLoading] = useState(false);
    const [httpError, setHttpError] = useState();
    const [productImage, setProductImage] = useState();
    let cartService = useCartService();


    useEffect(() => {
        const fetchProduct = async () => {
            const baseUrl = `${Util.apiUrl}Products/${productId}`;

            setIsLoading(true);

            try {
                const response = await fetch(baseUrl).then();
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                const data = await response.json();
                let theProduct = Product.fromProps(data);
                setProduct(theProduct);
                await fetchProductImage(data.productImageId)
            } catch (error) {
                console.error('Error fetching product :', error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchSimilarProducts = async () =>{

            const searchUrl = `${Util.apiUrl}Products/search/findSimilarProducts?id=${productId}&page=1&size=8`;

            setIsSimilarLoading(true);

            try {
                const response = await fetch(searchUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                const data = await response.json();
                const productsData = data._embedded.data;

                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching product categories:', error.message);
            } finally {
                setIsSimilarLoading(false);
            }

        }

        async function fetchProductImage(productImageId){

            if(productImageId != null){
                console.log(`${Util.apiUrl}imageData/${productImageId}`)

                const baseUrl = `${Util.apiUrl}imageData/${productImageId}`;
                setIsImageLoading(true);
                try {
                    const response = await fetch(baseUrl);

                    const imageBlob = await response.blob();
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setProductImage(imageObjectURL);
                } catch (error) {
                    console.error('Error fetching image:', error.message);
                } finally {
                    setIsImageLoading(false);
                }
            }

        }

        fetchProduct().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });

        fetchSimilarProducts().catch(err => {
            setIsSimilarLoading(false);
        });

        fetchProductImage().catch(err => {
            setIsImageLoading(false);
        });

    }, [productId]);

    const addToCart = () => {
        let cartItem = CartItem.fromProps(product);
        cartService.addToCart(cartItem);
    }

    if (httpError) {
        return (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <span style={{display: "block", textAlign: "center"}}>Sorry!!! Could not load data.</span>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        );
    }

    if (isLoading) {
        return (<LoadingSpinner/>);

    }else {
        return (
            <div>
                <div className="container d-none d-lg-block">
                    <div className="row mt-5">
                        <div className="col-sm-2 col-md-2">
                            <div className="product-details-page">
                                {productImage !== null ?
                                    <img className="product-details-page" src={productImage} alt="Product"/>
                                    :
                                    <img className="product-details-page" src={imagePlaceholder} alt="Product"/>
                                }
                            </div>
                        </div>
                        <div className="col-4 col-md-4 container">
                            <div className="ml-2">
                                <h2 className="product-details-text">{product.productName}</h2>
                                <h5 className="text-primary product-details-text">{product.productName}</h5>
                                <p className="lead product-details-text">{product.description}</p>
                                <h5 className="text-body-secondary fw-bold">{CurrencyValue(product.unitPrice)}</h5>
                                <br/>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button type="button" className="hard-button green py-2" onClick={addToCart}>Add to cart</button>
                                    <StarsReview
                                        rating={rating}
                                        size={24}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="mt-5 px-5">
                        <h5>Similar products: </h5>
                    </div>
                </div>
                <div className="container d-lg-none mt-5">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="product-details-page">
                            {productImage !== null ?
                                <img className="product-details-page" src={productImage} alt="Product"/>
                                :
                                <img className="product-details-page" src={imagePlaceholder} alt="Product"/>
                            }
                        </div>
                    </div>
                    <div className="ml-2">
                        <h2 className="product-details-text">{product.productName}</h2>
                        <h5 className="text-primary product-details-text">{product.productName}</h5>
                        <p className="lead product-details-text">{product.description}</p>
                        <h5 className="text-body-secondary fw-bold">{CurrencyValue(product.unitPrice)}</h5>
                        <br/>
                        <div className="d-flex justify-content-between align-items-center">
                            <button type="button" className="hard-button green py-2">Add to cart</button>
                            <StarsReview
                                rating={rating}
                                size={24}
                            />
                        </div>
                    </div>
                    <hr/>
                    <div className="mt-5 px-5">
                        <h5>Similar products: </h5>
                    </div>
                </div>
                <ProductsGridList
                    products={products}
                />
            </div>
        );
    }

}

export default ProductDetailsPage;