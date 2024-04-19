import './ProductsGridList.css'
import Product from "../../models/Product";
import ProductCard from "../cards/product_card/ProductCard";
import React from "react";

function ProductsGridList(props) {
    let products = props.products;
    return (
        <div className="mt-5">
            <div className="album py-5 bg-body-tertiary">
                <div className="alert alert-info alert-dismissible fade show" role="alert"
                     hidden={products.length > 0}>
                    <span style={{display: "block", textAlign: "center"}}>No products to display.</span>
                    <button type="button" className="btn-close" data-bs-dismiss="alert"
                            aria-label="Close"></button>
                </div>
                <div className="container">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-4 g-3">
                        {products.map(product => {
                            let productModel = Product.fromProps(product);
                            return (
                                <div className="col d-flex justify-content-center" key={productModel.id}>
                                    <ProductCard
                                        product={productModel}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductsGridList;