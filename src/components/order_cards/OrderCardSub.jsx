import React from "react";


function OrderCardSub(){
    return (

        <div className="row g-0 mt-3">
            <div className="col-md-2 col-sm-2">
                <svg className="bd-placeholder-img" width="100%"
                     height="150"
                     xmlns="http://www.w3.org/2000/svg"
                     role="img" aria-label="Placeholder: Image"
                     preserveAspectRatio="xMidYMid slice"
                     focusable="false"><title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#868e96"/>
                    <text x="50%" y="50%" fill="#dee2e6"
                          dy=".3em">Image
                    </text>
                </svg>
            </div>
            <div className="col-md-6" style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "start"
            }}>
                <div className="card-body">
                    <h5 className="card-title">Product Name</h5>
                    <br/>
                    <p>Unit Price:<small>£15.00</small></p>
                    <p>Quantity<small> £15.00</small></p>
                </div>
            </div>
            <hr/>
            {/*////////////////SHIPPING INFO START////////////////////////////////////////*/}
            {/*<div className="col-md-3"*/}
            {/*     style={{display: "flex", justifyContent: "flex-end"}}>*/}
            {/*    <div className="card-body">*/}
            {/*        <div className="items">*/}
            {/*            <label className="fw-bold"*/}
            {/*                   style={{color: "#23A6F0"}}>Shipping*/}
            {/*                info</label>*/}
            {/*            <hr/>*/}
            {/*            <small>Address 1</small>*/}
            {/*            <br/>*/}
            {/*            <small>Address 2</small>*/}
            {/*            <br/>*/}
            {/*            <small>City</small>*/}
            {/*            <br/>*/}
            {/*            <small className="fw-bold">email</small>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*////////////////SHIPPING INFO END////////////////////////////////////////*/}
            <div className="card-footer text-body-secondary mt-3">
                Order status: <small className="fw-bold"
                                     style={{color: "#23A6F0"}}>{orderStatus}</small>
            </div>
        </div>
    );
}

export default OrderCardSub;