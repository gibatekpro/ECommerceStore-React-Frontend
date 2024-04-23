import './ProductCategoryPage.css'
import ProductsGridList from "../../components/products_grid_list/ProductsGridList";
import Pagination from "../../components/pagination/Pagination";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Util} from "../../util/utils";
import {Page} from "../../models/Page";
import LoadingSpinner from "../../components/loading_spinner/LoadingSpinner";

function ProductCategoryPage() {
    const { productCategoryName, productCategoryId } = useParams();
    const { productCategory, setProductCategory } = useState();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(new Page());
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

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
                await response.json().then(data =>{

                    const productsData = data._embedded.data;
                    const pageData = data.page;
                    const pageModel = Page.fromProps(pageData);

                    setProducts(productsData);
                    setPage(pageModel);
                    setTotalAmountOfProducts(page.totalPages)
                    setTotalPages(pageModel.totalPages)


                });

            } catch (error) {
                console.error('Error fetching product categories:', error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductsByCategory().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });
        //Scroll back to top of image
        window.scroll(0, 0);
    }, [currentPage, searchUrl]);

    const fetchProductCategory = async (productId) =>{

        const url = `${Util.apiUrl}ProductCategories/${productCategoryId}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch product category');
            }
            await response.json().then(data =>{

                setProductCategory(data);


            });

        } catch (error) {
            console.error('Error fetching product category:', error.message);
            setHttpError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

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
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">{productCategoryName}</h1>
                        <p className="lead text-body-secondary">{}</p>
                        <p>
                            <button href="#" className="outline-button green-lg my-2 mx-2">Go to search</button>
                            <button href="#" className="hard-button green my-2 mx-2">View my cart</button>
                        </p>
                    </div>
                </div>
            </section>
            <ProductsGridList
                products = {products}
            />
            {totalPages > 1 &&
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}/>
            }
        </div>
    );
}

export default ProductCategoryPage;