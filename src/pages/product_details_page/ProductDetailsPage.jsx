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
import {useAuth} from "../../services/auth/AuthProvider";
import ProductForm from "../../components/forms/ProductForm";
import {UserProfile} from "../../models/UserProfile";
import data from "bootstrap/js/src/dom/data";

function ProductDetailsPage() {
    let {productId} = useParams();
    let auth = useAuth();

    const [product, setProduct] = useState(new Product());
    const [products, setProducts] = useState([]);
    const [productUpdate, setProductUpdate] = useState(new Product());
    const [rating, setRating] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isSimilarLoading, setIsSimilarLoading] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [httpError, setHttpError] = useState();
    const [productImage, setProductImage] = useState();
    const [userRoles, setUserRoles] = useState(localStorage.getItem("userRoles"));
    const [isManagerOrAdmin, setIsManagerOrAdmin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    let cartService = useCartService();

    useEffect(() => {

        //set roles of manager
        if (auth.user) {
            const storedRoles = localStorage.getItem("userRoles");
            setUserRoles(storedRoles);
            const roleArray = storedRoles ? storedRoles.split(",") : [];

            roleArray.includes("Manager") || roleArray.includes("Admin") ? setIsManagerOrAdmin(true) : setIsManagerOrAdmin(false);
        } else {
            setIsManagerOrAdmin(false)
        }

    }, [auth.user])

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

        const fetchSimilarProducts = async () => {

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

        async function fetchProductImage(productImageId) {

            if (productImageId != null) {
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

    }, [productId, productUpdate]);

    async function handleSubmit(values) {
        if (!values.productImage) {
            // If we are not updating product image,
            //update the product directly
            await updateProductDetails(values);
        } else {
            await updateImage(values);
        }
    }

    const updateImage = async (values) => {

        const formData = new FormData();
        formData.append("file", values.productImage);

        console.log(">>>>>S>S>S",values.productImage);

        const baseUrl = `${Util.apiUrl}ImageData/${product.productImageId}`;

        try {
            const response = await fetch(baseUrl, {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Could not update image");
                alert('Update Failed');
            } else {
                await response.json().then(data => {
                    updateProductDetails(values);
                })
            }
        } catch (error) {
            console.error("Error saving image:", error);
        } finally {
        }


    }

    const updateProductDetails = async (values) => {

        let theDetails = {
            id: productId,
            productName: values.productName || null,
            description: values.description || null,
            unitPrice: values.unitPrice || null,
            unitsInStock: values.unitsInStock || null
        }

        const baseUrl = `${Util.apiUrl}Products?id=${productId}`;

        try {
            const response = await fetch(baseUrl, {
                method: "PUT",
                body: JSON.stringify(theDetails),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Could not update product");
                alert('Update Failed');
            } else {
                await response.json().then(data => {
                    setProductUpdate(data);
                    alert('Update successful')
                })
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
        }


    }

    const performEdit = () =>{
        setIsEditingProduct(!isEditingProduct);
    }


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

    } else {
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
                                    <button type="button" className="hard-button green py-2" onClick={addToCart}>Add to
                                        cart
                                    </button>
                                    <StarsReview
                                        rating={rating}
                                        size={24}
                                    />
                                    <div hidden={!isManagerOrAdmin} title={"Edit product"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6F0"
                                             className="bi bi-pen-fill" viewBox="0 0 16 16" type="button"
                                             onClick={performEdit}>
                                            <path
                                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                                            >
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div hidden={!isManagerOrAdmin || !isEditingProduct}>
                        <ProductForm
                            product={product}
                            handleSubmit={handleSubmit}
                        />
                    </div>
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
                            <div hidden={!isManagerOrAdmin} title={"Edit product"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6F0"
                                     className="bi bi-pen-fill mx-2" viewBox="0 0 16 16" type="button"
                                     onClick={performEdit}>
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                                    >
                                </svg>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div hidden={!isManagerOrAdmin && isEditingProduct}>
                        <ProductForm
                            product={product}
                            handleSubmit={handleSubmit}
                        />
                    </div>
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