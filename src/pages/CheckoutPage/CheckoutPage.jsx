import {
    CardElement,
    PaymentElement,
    CardExpiryElement,
    AddressElement,
    ExpressCheckoutElement, PaymentRequestButtonElement, useElements, useStripe
} from "@stripe/react-stripe-js";
import {useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthProvider";
import CurrencyValue, {Util} from "../../util/utils";
import {UserProfile} from "../../models/UserProfile";
import {useCartService} from "../../services/CartServiceProvider";
import button from "bootstrap/js/src/button";
import {PaymentRequestInfo} from "../../models/PaymentRequestInfo";

function CheckoutPage() {
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [userProfile, setUserProfile] = useState(new UserProfile());
    let elements = useElements();
    let stripe = useStripe();
    let auth = useAuth();
    let cartService = useCartService();


    useEffect(() => {

        const fetchUserProfile = async () => {
            if (!auth.user) {
                console.log("User not authenticated");
                return;
            }

            const userString = localStorage.getItem("user");
            const parsedUser = JSON.parse(userString);

            const theToken = parsedUser.token;
            setToken(theToken);

            const decodedToken = atob(theToken.split(".")[1]);
            const theEmail = JSON.parse(decodedToken).sub;
            setEmail(theEmail);

            const baseUrl = `${Util.apiUrl}UserProfiles/getUserByEmail?email=${theEmail}`;

            try {
                const response = await fetch(baseUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${theToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserProfile(data);
                    console.log(data);
                } else {
                    console.log("Failed to fetch user profile");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile().catch(err => {
            // setIsLoading(false);
            setHttpError(err.message);
        });


    }, []);

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }
    const checkout = async () => {
        // if (!stripe || !elements || elements.getElement(CardElement)) {
        //     console.log('here')
        //     return;
        // }
        console.log('there')
        setSubmitDisabled(true);

        //amount, currency, description
        let amount = cartService.totalPrice * 100;
        let paymentInfo = new PaymentRequestInfo(
            email,
            amount,
            'GBP',
            token
        )

        console.log(paymentInfo);

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
                console.log(`The response intent is: ${stripeResponse}`);

                await stripe.confirmCardPayment(
                    stripeResponse.client_secret, {
                        payment_method: {
                            card: elements.getElement(CardElement),
                            billing_details: {
                                email: email,
                                name: `${userProfile.firstName} ${userProfile.lastName}`
                            }
                        }
                    }, {handleActions: false})
                    .then((result) => {
                            if (result.error) {

                                //inform the customer there was an error
                                alert(`There was an error: ${result.error.message}`);
                                setSubmitDisabled(false);
                                alert('There was an error')
                            } else {
                                //call REST API via the CheckoutService
                                alert('Payment complete')

                                cartService.resetCart();
                            }
                        }
                    )
            } else {
                console.log("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }



    // const [selectedDate, setSelectedDate] = useState('');
    // const handleDateChange = (event) => {
    //     setSelectedDate(event.target.value);
    // };
    // // onClick={() => handleCheckout(selectedDate, cart)}

    return (
        <div>
            {cartService.totalPrice > 0 && <div className="card mt-3 mw-100">
                <h5 className="card-header">Fees pending: <span
                    className="text-danger">{CurrencyValue(cartService.totalPrice)}</span></h5>
                <div className="card-body">
                    <h5 className="card-title mb-3">Credit Card</h5>
                    <CardElement id="card-element"/>
                    <button className="outline-button blue" onClick={checkout}>
                        Pay ({CurrencyValue(cartService.totalPrice)})
                    </button>
                </div>
            </div>
            }
        </div>
    );
}

export default CheckoutPage;