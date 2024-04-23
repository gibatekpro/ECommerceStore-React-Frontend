import './ProductCategoryPage.css'
import ProductsGridList from "../../components/products_grid_list/ProductsGridList";
import Pagination from "../../components/pagination/Pagination";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Util} from "../../util/utils";
import {Page} from "../../models/Page";
import LoadingSpinner from "../../components/loading_spinner/LoadingSpinner";
import ProductCategory from "../../models/ProductCategory";

function ProductCategoryPage() {

    const {productCategoryName, productCategoryId} = useParams();
    const [productImage, setProductImage] = useState();
    const [productCategory, setProductCategory] = useState(new ProductCategory());
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(new Page());
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');


    useEffect(() => {

        const fetchProductsByCategory = async () => {
            const defaultSearchUrl = `${Util.apiUrl}Products/search/findByProductCategoryId?id=${productCategoryId}&page=${currentPage}&size=${productsPerPage}`;

            setIsLoading(true);

            let url = defaultSearchUrl;


            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                await response.json().then(data => {

                    const productsData = data._embedded.data;
                    const pageData = data.page;
                    const pageModel = Page.fromProps(pageData);

                    setProducts(productsData);
                    setPage(pageModel);
                    setTotalAmountOfProducts(page.totalPages)
                    setTotalPages(pageModel.totalPages)

                });

                await fetchProductCategory();

            } catch (error) {
                console.error('Error fetching product categories:', error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchProductCategory = async () => {
            try {
                let baseUrl = `${Util.apiUrl}productCategories/${productCategoryId}`;

                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch product category");
                }

                const data = await response.json();

                console.log("Fetched Product Category:", data);

                setProductCategory(data);

                await fetchProductImage(ProductCategory.fromProps(data));

            } catch (error) {
                console.error("Error fetching product category:", error.message);
            }
        };

        const fetchProductImage = async (productCategory) => {
            const baseUrl = `${Util.apiUrl}imageData/${productCategory.categoryImageId}`;

            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    console.log("Failed to fetch image");
                }

                // Convert response to blob and create an object URL
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);

                setProductImage(imageObjectURL);
            } catch (error) {
                console.error("Error fetching image:", error.message);
                setHttpError(error.message);
            }
        };


        fetchProductsByCategory().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });


        // fetchProductImage().catch(err =>{
        //
        // })
        //Scroll back to top of image
        window.scroll(0, 0);
    }, [currentPage, productCategoryId]);


    if (isLoading) {
        return (<LoadingSpinner/>);

    }

    if (httpError) {
        return (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <span style={{display: "block", textAlign: "center"}}>Sorry!!! Could not load data.</span>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        );
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage + 1;
    let lastItem = productsPerPage * currentPage <= totalAmountOfProducts
        ? productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <section
                className="mw-100 py-5 mt-3 text-center container bg-body-tertiary"
                style={{
                    backgroundImage: productImage ? `url(${productImage})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    height: "auto",
                    position: "relative", // Set relative positioning for absolute overlay
                }}
            >
                {/* Semi-Transparent Overlay */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
                    }}
                ></div>

                {/* Content within the section */}
                <div className="row py-lg-5" style={{position: "relative"}}>
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-bolder" style={{color: "white"}}>{productCategoryName}</h1>
                        <p className="lead" style={{color: "white"}}>
                            {productCategory.categoryDescription}
                        </p>
                        <p>
                            <Link to="search">
                                <button className="outline-button green-lg my-2 mx-2">Go to search</button>
                            </Link>
                            <Link to="/cart-details">
                                <button className="hard-button green my-2 mx-2">View my cart</button>
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            <ProductsGridList products={products}/>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />
            )}
        </div>

    );
}

export default ProductCategoryPage;