import './SearchPage.css'
import React, {useEffect, useState} from "react";
import {Util} from "../../util/utils";
import {Page} from "../../models/Page";
import {PagedProductResponse} from "../../models/PagedProductResponse";
import ProductCard from "../../components/cards/product_card/ProductCard";
import Product from "../../models/Product";
import Pagination from "../../components/pagination/Pagination";
import LoadingSpinner from "../../components/loading_spinner/LoadingSpinner";
import ProductsGridList from "../../components/products_grid_list/ProductsGridList";

function SearchPage() {

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
        const fetchSearchedProducts = async () => {
            const defaultSearchUrl = `${Util.apiUrl}Products/search/findByNameContainsIgnoreCase?name=i&page=${currentPage}&size=${productsPerPage}`;

            setIsLoading(true);

            let url = '';

            if (searchUrl === '') {
                url = defaultSearchUrl
            } else {
                url = searchUrl;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories');
                }
                const data = await response.json();
                const productsData = data._embedded.data;
                const pageData = data.page;
                const pageModel = Page.fromProps(pageData);

                setProducts(productsData);
                setPage(pageModel);
                setTotalAmountOfProducts(page.totalPages)
                setTotalPages(pageModel.totalPages)
            } catch (error) {
                console.error('Error fetching product categories:', error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchedProducts().catch(err => {
            setIsLoading(false);
            setHttpError(err.message);
        });
        //Scroll back to top of image
        window.scroll(0, 0);
    }, [currentPage, searchUrl]);

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


    const searchHandleChange = () => {
        if (search === '') {
            setSearchUrl('');
        } else {
            setCurrentPage(1);
            setSearchUrl(
                `${Util.apiUrl}Products/search/findByNameContainsIgnoreCase?name=${search}&page=${currentPage}&size=${productsPerPage}`
            )
        }
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage + 1;
    let lastItem = productsPerPage * currentPage <= totalAmountOfProducts
        ? productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control me-2" type="search"
                                       placeholder="Search" aria-labelledby="Search"
                                       onChange={e => setSearch(e.target.value)}/>
                                <button className="btn outline-button" onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h5>Number of results: ({page.totalElements})</h5>
                    </div>
                    <p hidden={products.length < 1}>
                        {indexOfFirstProduct} to {indexOfLastProduct} of {page.totalElements} items:
                    </p>
                    <p hidden={products.length > 0}>
                        0 items
                    </p>
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
            </div>
        </div>
    );

}

export default SearchPage;