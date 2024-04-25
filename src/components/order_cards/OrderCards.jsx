import button from "bootstrap/js/src/button";
import {CardText} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import OrderHistory from "../../models/OrderHistory";
import {UserProfile} from "../../models/UserProfile";
import Address from "../../models/Address";
import CurrencyValue, {Util} from "../../util/utils";
import {format} from "date-fns";


function OrderCards(props) {
    const [orderStatus, setOrderStatus] = useState('');

    let order = OrderHistory.fromProps(props.order)

    useEffect(() => {
        const fetchOrderStatus = async () => {

            const baseUrl = `${Util.apiUrl}OrderStatus/${order.orderStatusId}`;

            try {
                const response = await fetch(baseUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${props.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order status');
                }

                await response.json().then((data) => {

                    let theStatus = data.statusName;

                    setOrderStatus(theStatus);
                });

            } catch (error) {
                console.error('Error fetching order status:', error.message);
            }
        }

        fetchOrderStatus().catch(error => {
            console.log(error);
        })
    }, []);

    return (

        <div className="accordion-item">
            <h4 className="accordion-header">
                <button className={`accordion-button ${props.index === 0 ? '' : 'collapsed'}`} type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${props.index}`} aria-expanded="true"
                        aria-controls={`collapse${props.index}`}>
                    <CardText className="fw-bold">ORDER #:  </CardText>
                    {order.orderTrackingNumber}
                </button>
            </h4>
            <div id={`collapse${props.index}`} className={`accordion-collapse collapse${props.index === 0 ? 'show' : ''}`}
                 data-bs-parent="#accordionExample">
                <div className="accordion-body">
                    {/*//////////////////////////////////////Card Start//////////////////////////////////*/}
                    <div className="card w-100">
                        <div className="card-header">
                            <div
                                className="row row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-3">
                                <div
                                    className="my-2 my-sm-2 my-md-0 my-lg-0 col col-sm col-md col-lg">
                                    <small>ORDER PLACED</small>
                                    <br/>
                                    <small>{format(order.dateCreated, 'd-MMMM')}</small>
                                </div>
                                <div
                                    className="my-2 my-sm-2 my-md-0 my-lg-0 col col-sm col-md col-lg">
                                    <small>TOTAL</small>
                                    <br/>
                                    <small>{CurrencyValue(order.totalPrice)}</small>
                                </div>
                                <div
                                    className="my-2 my-sm-2 my-md-0 my-lg-0 col col-sm col-md col-lg">
                                    <small>DISPATCHED TO</small>
                                    <br/>
                                    <small className="fw-bold"
                                           style={{color: "#23A6F0"}}>
                                        {order.firstName} {order.lastName}
                                    </small>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/*//////////////////////////////////////Card End//////////////////////////////////*/}
                </div>
            </div>
        </div>
    );
}

export default OrderCards;