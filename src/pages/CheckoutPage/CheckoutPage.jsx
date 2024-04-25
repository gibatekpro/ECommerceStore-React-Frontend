import {
    CardElement,
    PaymentElement,
    CardExpiryElement,
    AddressElement,
    ExpressCheckoutElement, PaymentRequestButtonElement, useElements, useStripe
} from "@stripe/react-stripe-js";
import React, {useEffect, useState} from "react";
import {useAuth} from "../../services/auth/AuthProvider";
import CurrencyValue, {Util} from "../../util/utils";
import {UserProfile} from "../../models/UserProfile";
import {useCartService} from "../../services/CartServiceProvider";
import button from "bootstrap/js/src/button";
import {PaymentRequestInfo} from "../../models/PaymentRequestInfo";
import ProductCard from "../../components/cards/product_card/ProductCard";
import CartItemCardSmall from "../../components/cards/cart_item_card_small/CartItemCardSmall";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import * as formik from 'formik';
import {Formik} from "formik";
import * as Yup from "yup";
import {cityOptions} from "../../util/CityOptions";
import {string} from "yup";
import LoadingSpinner from "../../components/loading_spinner/LoadingSpinner";
import cartItem from "../../models/CartItem";
import {OrderItem} from "../../models/OrderItem";
import Checkout from "../../models/Checkout";
import Address from "../../models/Address";

function CheckoutPage(props) {

    // You can then map this JSON to an object of a custom class
    let userProfile = UserProfile.fromProps(JSON.parse(props.userProfile));

    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [token, setToken] = useState('');
    window.scroll(0, 0);
    const {Formik} = formik;
    const [shippingIsBilling, setShippingIsBilling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const today = new Date();
    const year18 = new Date(today.setFullYear(today.getFullYear() - 15));
    const userString = localStorage.getItem("user");
    const parsedUser = JSON.parse(userString);
    const theToken = parsedUser.token;
    let elements = useElements();
    let stripe = useStripe();
    let auth = useAuth();
    let cartService = useCartService();
    let navigate = useNavigate();

    useEffect(() => {

        setToken(theToken)

    }, []);

    const handleSubmit = async (values) => {

        //remain at bottom of page
        window.scrollTo(0, document.body.scrollHeight);

        auth.checkTokenExpiration();

        if (!stripe || !elements || !elements.getElement(CardElement)) {
            console.log("Form is not doing anything")
            setIsLoading(false)
            return;
        }

        setSubmitDisabled(true);

        let shippingAddress = new Address(
            null,
            values.shippingAddress,
            values.shippingAddress2,
            values.shippingCity,
            values.shippingCountry,
            values.shippingPostCode,
            null,
        );

        let billingAddress = shippingIsBilling ? shippingAddress : new Address(
            null,
            values.billingAddress,
            values.billingAddress2,
            values.billingCity,
            values.billingCountry,
            values.billingPostCode,
            null,
        );

        let amount = Math.round(cartService.totalPrice * 100);

        let orderItems = cartService.storedCartItems.map(cartItem => OrderItem.fromProps(cartItem).toJSON());


        let paymentInfo = new PaymentRequestInfo(
            values.email,
            amount,
            'GBP',
            `${cartService.totalQuantity} items purchased at ${CurrencyValue(cartService.totalPrice)}`,
            orderItems
        );

        let checkoutData = new Checkout(
            values.firstName,
            values.lastName,
            values.email,
            shippingAddress,
            billingAddress,
            orderItems
        );

        let checkoutDataString = JSON.stringify(checkoutData);

        const baseUrl = `${Util.apiUrl}checkout/payment-intent`;

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                body: JSON.stringify(paymentInfo),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const stripeResponse = await response.json();

                let stripeResponseString = JSON.stringify(stripeResponse);

                await stripe.confirmCardPayment(
                    stripeResponse.clientSecret, {
                        payment_method: {
                            card: elements.getElement(CardElement),
                            billing_details: {
                                email: values.email,
                                name: `${values.firstName} ${values.lastName}`
                            }
                        }
                    }, {handleActions: false})
                    .then((result) => {
                            if (result.error) {

                                //inform the customer there was an error
                                alert(`There was an error. Could not complete payment`);
                                setSubmitDisabled(false);
                            } else {

                                console.log("Created payment intent", checkoutData);
                                //Success now complete checkout
                                checkout(checkoutData);

                            }
                        }
                    )
            } else {
                console.log('Could not create payment intent');
                console.log('Payment Info', paymentInfo);
            }
        } catch (error) {
            console.error("Error creating payment intent:", error);
        } finally {
            setSubmitDisabled(false)
            setIsLoading(false);
        }
    }

    const checkout = async (checkoutData) => {

        const baseUrl = `${Util.apiUrl}checkout`;
        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                body: JSON.stringify(checkoutData),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {


                await response.json().then((data) => {

                    alert(`Payment complete. \n Order Tracking number: ${data.orderTrackingNumber}`);

                    cartService.resetCart();
                });


            } else {
                console.log('Could not complete checkout');
            }
        } catch (error) {
            console.error("Could not complete checkout:", error);
        }
    }

    const SignupSchema = Yup.object().shape(
        //No need for billing error checking if shipping and billing are the same
        shippingIsBilling ?
            {
                firstName: Yup.string()
                    .min(1, 'Too Short!')
                    .max(25, 'Too Long!')
                    .required('Required'),
                lastName: Yup.string()
                    .min(1, 'Too Short!')
                    .max(25, 'Too Long!')
                    .required('Required'),
                email: Yup.string()
                    .required('Required')
                    .matches("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$", {
                        message: 'Email does not match expected pattern'
                    }),
                shippingAddress: Yup.string()
                    .min(1, 'Too Short!')
                    .max(80, 'Too Long!')
                    .required('Required'),
                shippingCountry: Yup.string()
                    .required('Required'),
                shippingCity: Yup.string()
                    .required('Required'),
                shippingPostCode: Yup.string()
                    .required('Required')
                    .max(8, 'Too Long!')
                    .matches(/^[a-zA-Z0-9 ]+$/, {
                        message: 'Post code cannot have special characters'
                    }),
            }
            :
            {
                firstName: Yup.string()
                    .min(1, 'Too Short!')
                    .max(25, 'Too Long!')
                    .required('Required'),
                lastName: Yup.string()
                    .min(1, 'Too Short!')
                    .max(25, 'Too Long!')
                    .required('Required'),
                email: Yup.string()
                    .required('Required')
                    .matches("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$", {
                        message: 'Email does not match expected pattern'
                    }),
                shippingAddress: Yup.string()
                    .min(1, 'Too Short!')
                    .max(80, 'Too Long!')
                    .required('Required'),
                shippingCountry: Yup.string()
                    .required('Required'),
                shippingCity: Yup.string()
                    .required('Required'),
                shippingPostCode: Yup.string()
                    .required('Required')
                    .max(8, 'Too Long!')
                    .matches(/^[a-zA-Z0-9 ]+$/, {
                        message: 'Post code cannot have special characters'
                    }),
                billingAddress: Yup.string()
                    .min(1, 'Too Short!')
                    .max(80, 'Too Long!')
                    .required('Required'),
                billingCountry: Yup.string()
                    .required('Required'),
                billingCity: Yup.string()
                    .required('Required'),
                billingPostCode: Yup.string()
                    .required('Required')
                    .max(8, 'Too Long!')
                    .matches(/^[a-zA-Z0-9 ]+$/, {
                        message: 'Post code cannot have special characters'
                    }),
            });


    const goToCart = (event) => {
        navigate("/cart-details");
    };

    const setShippingAndBilling = () => {
        setShippingIsBilling(!shippingIsBilling)
    }

    return (
        <div className="container">
            <div className="py-5 text-center">
                <h1>Checkout</h1>
            </div>

            <div className="row g-5">
                <div className="col-md-5 col-lg-4 order-md-last">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-primary">Your cart</span>
                        <span className="badge bg-primary rounded-pill">{cartService.totalQuantity}</span>
                    </h4>

                    <ul className="list-group mb-3">
                        {cartService.storedCartItems.map((cartItem) => (
                            <CartItemCardSmall key={cartItem.id} cartItem={cartItem}/>
                        ))}

                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (GBP)</span>
                            <strong>{CurrencyValue(cartService.totalPrice)}</strong>
                        </li>
                    </ul>

                    <div className="input-group justify-content-end">
                        <button type="button" className="outline-button green-lg" onClick={goToCart}>
                            View in cart
                        </button>
                    </div>
                </div>

                <div className="col-md-7 col-lg-8">
                    <Formik
                        initialValues={{
                            firstName: userProfile.firstName,
                            lastName: userProfile.lastName,
                            email: userProfile.email,
                            shippingAddress: "",
                            shippingAddress2: "",
                            shippingCountry: "",
                            shippingCity: "",
                            shippingPostCode: "",
                            billingAddress: "",
                            billingAddress2: "",
                            billingCountry: "",
                            billingCity: "",
                            billingPostCode: "",
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={async (values) => {
                            setIsLoading(true);
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            await handleSubmit(values);
                        }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors}) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <h4 className="mb-3">Shipping Details</h4>
                                <hr className="mb-5"/>

                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <Form.Group controlId="firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="firstName"
                                                value={values.firstName}
                                                onChange={handleChange}
                                                isValid={touched.firstName && !errors.firstName}
                                                isInvalid={errors.firstName != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-sm-6">
                                        <Form.Group controlId="lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="lastName"
                                                value={values.lastName}
                                                onChange={handleChange}
                                                isValid={touched.lastName && !errors.lastName}
                                                isInvalid={errors.lastName != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-12">
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <InputGroup hasValidation>
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    isValid={touched.email && !errors.email}
                                                    isInvalid={errors.email != null}
                                                />
                                                <InputGroup.Text>@</InputGroup.Text>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </div>

                                    {/*////////////////////////////SHIPPING ADDRESS SECTION//////////////////////////////////*/}
                                    <h4 className="mb-3 mt-5">Shipping Address</h4>
                                    <hr className="mb-2"/>

                                    <div className="col-md-12">
                                        <Form.Group controlId="shippingAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="shippingAddress"
                                                value={values.shippingAddress}
                                                onChange={handleChange}
                                                isValid={touched.shippingAddress && !errors.shippingAddress}
                                                isInvalid={errors.shippingAddress != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.shippingAddress}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-12">
                                        <Form.Group controlId="shippingAddress2">
                                            <Form.Label>Address 2 (Optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Apartment or suite"
                                                name="shippingAddress2"
                                                value={values.shippingAddress2}
                                                onChange={handleChange}
                                                isValid={touched.shippingAddress2 && !errors.shippingAddress2}
                                                isInvalid={errors.shippingAddress2 != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.shippingAddress2}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-5">
                                        <Form.Group controlId="shippingCountry">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Select
                                                name="shippingCountry"
                                                value={values.country}
                                                onChange={handleChange}
                                                isValid={touched.shippingCountry && !errors.shippingCountry}
                                                isInvalid={errors.shippingCountry != null}
                                            >
                                                <option value="">Select</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.shippingCountry}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-4">
                                        <Form.Group controlId="shippingCity">
                                            <Form.Label>City</Form.Label>
                                            <Form.Select
                                                name="shippingCity"
                                                value={values.city}
                                                onChange={handleChange}
                                                isValid={touched.shippingCity && !errors.shippingCity}
                                                isInvalid={errors.shippingCity != null}
                                            >
                                                <option value="">Select</option>
                                                {cityOptions.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}

                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.shippingCity}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3">
                                        <Form.Group controlId="shippingPostCode">
                                            <Form.Label>Post Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="shippingPostCode"
                                                value={values.shippingPostCode}
                                                onChange={handleChange}
                                                isValid={touched.shippingPostCode && !errors.shippingPostCode}
                                                isInvalid={errors.shippingPostCode != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.shippingPostCode}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>


                                    {/*////////////////////////////SHIPPING IS BILLING ADDRESS//////////////////////////////////*/}
                                    <hr className="my-4 mt-5"/>
                                    <Form.Group>
                                        <Form.Check
                                            name="billingIsShipping"
                                            onChange={setShippingAndBilling}
                                            label="Shipping address is the same as my billing address."
                                        />
                                    </Form.Group>
                                    <hr className="my-4"/>

                                    {/*////////////////////////////BILLING ADDRESS SECTION//////////////////////////////////*/}

                                    <h4 hidden={shippingIsBilling} className="mb-3 mt-5">Billing Address</h4>
                                    <hr hidden={shippingIsBilling} className="mb-2"/>

                                    <div hidden={shippingIsBilling} className="col-md-12">
                                        <Form.Group controlId="billingAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="billingAddress"
                                                value={values.billingAddress}
                                                onChange={handleChange}
                                                isValid={touched.billingAddress && !errors.billingAddress}
                                                isInvalid={errors.billingAddress != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.billingAddress}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div hidden={shippingIsBilling} className="col-md-12">
                                        <Form.Group controlId="billingAddress2">
                                            <Form.Label>Address 2 (Optional)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="billingAddress2"
                                                placeholder="Apartment or suite"
                                                value={values.billingAddress2}
                                                onChange={handleChange}
                                                isValid={touched.billingAddress2 && !errors.billingAddress2}
                                                isInvalid={errors.billingAddress2 != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.billingAddress2}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div hidden={shippingIsBilling} className="col-md-5">
                                        <Form.Group controlId="billingCountry">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Select
                                                name="billingCountry"
                                                value={values.country}
                                                onChange={handleChange}
                                                isValid={touched.billingCountry && !errors.billingCountry}
                                                isInvalid={errors.billingCountry != null}
                                            >
                                                <option value="">Select</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.billingCountry}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div hidden={shippingIsBilling} className="col-md-4">
                                        <Form.Group controlId="billingCity">
                                            <Form.Label>City</Form.Label>
                                            <Form.Select
                                                name="billingCity"
                                                value={values.city}
                                                onChange={handleChange}
                                                isValid={touched.billingCity && !errors.billingCity}
                                                isInvalid={errors.billingCity != null}
                                            >
                                                <option value="">Select</option>
                                                {cityOptions.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}

                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.billingCity}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div hidden={shippingIsBilling} className="col-md-3">
                                        <Form.Group controlId="billingPostCode">
                                            <Form.Label>Post Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="billingPostCode"
                                                value={values.billingPostCode}
                                                onChange={handleChange}
                                                isValid={touched.billingPostCode && !errors.billingPostCode}
                                                isInvalid={errors.billingPostCode != null}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.billingPostCode}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    {/*////////////////////////////PAYMENT SECTION//////////////////////////////////*/}
                                    <h4 className="mb-3 mt-5">Payment</h4>
                                    <hr className="mb-4"/>
                                    <div className="row g-1">
                                        <div className="col-sm-5">
                                            <small>Test card: 4242 4242 4242 4242</small>
                                        </div>
                                        <div className="col-sm-4">
                                            <small>Test date: Any future date</small>
                                        </div>
                                        <div className="col-sm-3">
                                            <small>Test CVV: Random digit</small>
                                        </div>
                                    </div>

                                    <div className="card w-100">
                                        <div className="card-header">
                                            <h6>Payment secured by Stripe</h6>
                                        </div>
                                        <div className="card-body">
                                            <CardElement id="card-element"/>
                                        </div>
                                    </div>

                                    {/*////////////////////////////SUBMIT BUTTON//////////////////////////////////*/}
                                    {isLoading &&
                                        <h6 className="text-center" hidden={!isLoading}>
                                            <div className="spinner-border text-primary " role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </h6>
                                    }
                                    <Button
                                        className="hard-button blue"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        Continue to checkout ({CurrencyValue(cartService.totalPrice)})
                                    </Button>
                                    <br/>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>

    )
        ;
}

export default CheckoutPage;