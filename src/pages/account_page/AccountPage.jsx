import './AccountPage.css'
import CartItemCard from "../../components/cards/cart_item_card/CartItemCard";
import React, {useEffect, useState} from "react";
import CartItem from "../../models/CartItem";
import CurrencyValue, {Util} from "../../util/utils";
import {Link} from "react-router-dom";
import {CardText} from "react-bootstrap";
import {UserProfile} from "../../models/UserProfile";
import Address from "../../models/Address";
import AddressForm from "../../components/forms/AddressForm";
import button from "bootstrap/js/src/button";
import OrderHistory from "../../models/OrderHistory";
import {useAuth} from "../../services/auth/AuthProvider";
import address from "../../models/Address";
import ProfileForm from "../../components/forms/ProfileForm";
import OrderCards from "../../components/order_cards/OrderCards";


function AccountPage() {


    //Scroll back to top of image
    window.scroll(0, 0);

    const [profile, setProfile] = useState(localStorage.getItem('userProfile'));
    const [userProfile, setUserProfile] = useState(new UserProfile());
    const [userAddress, setUserAddress] = useState(new Address);
    const [isLoading, setIsLoading] = useState(false);
    const [httpError, setHttpError] = useState();
    const [orders, setOrders] = useState([]);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [token, setToken] = useState('');
    const userString = localStorage.getItem("user");
    const parsedUser = JSON.parse(userString);
    const theToken = parsedUser.token;


    useEffect(() => {

        //fetch the user token for authorization
        setToken(theToken);


        const fetchProfile = async () => {

            if (profile) {
                try {

                    const profileJson = JSON.parse(profile);


                    const userProfileProp = UserProfile.fromProps(profileJson);

                    //set the user profile
                    setUserProfile(userProfileProp);

                    //I want to fetch the Address here
                    //after fetching the profile
                    await fetchAddress(userProfileProp);

                    await fetchOrders(userProfileProp);

                } catch (error) {
                    console.error("Error parsing profile:", error);
                }
            }
        }

        const fetchAddress = async (userProfileProp) => {

            const baseUrl = `${Util.apiUrl}Address/search/findByUserProfileId?id=${userProfileProp.id}`;

            try {
                const response = await fetch(baseUrl);
                if (!response.ok) {
                    throw new Error('Failed to fetch address');
                }

                await response.json().then((data) => {

                    const mAddress = {
                        id: data.id,
                        address1: data.address1,
                        address2: data.address2 || "",
                        city: data.city,
                        country: data.country,
                        postCode: data.postCode,
                        userProfileId: data.userProfileId || "",
                    };

                    let address = Address.fromProps(data)

                });


            } catch (error) {
                console.error('Error fetching address:', error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        const fetchOrders = async (userProfileProp) => {
            const baseUrl = `${Util.apiUrl}Orders/GetUserOrders?userId=${userProfileProp.userId}`;

            const userString = localStorage.getItem("user");
            const parsedUser = JSON.parse(userString);
            const theToken = parsedUser.token;

            try {
                const response = await fetch(baseUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${theToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }

                await response.json().then((data) => {

                    setOrders(data);

                });
            } catch (error) {
                console.error("Error fetching orders:", error.message);
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile().catch((error) => {
            console.error("Error in fetchProfile:", error);
        });

    }, [userAddress]);

    let cartItem = new CartItem(
        10,
        "Random Name",
        "20",
        12,
        1
    )


    const handleSubmit = async (values) => {

        let userAddressId = userAddress !== null || false ? userAddress.id : "";

        //remain at bottom of page
        window.scrollTo(0, document.body.scrollHeight);

        setSubmitDisabled(true);

        const mAddress = {
            id: userAddressId,
            address1: values.address,
            address2: values.address2,
            city: values.city,
            country: values.country,
            postCode: values.postCode,
            userProfileId: userProfile.id,
        };

        let address = Address.fromProps(mAddress);

        const baseUrl = userAddressId
            ? `${Util.apiUrl}address/${userAddressId}`
            : `${Util.apiUrl}address`;

        const method = userAddressId ? "PUT" : "POST";

        console.log(JSON.stringify(address));

        console.log(baseUrl);

        try {
            const response = await fetch(baseUrl, {
                method: method,
                body: JSON.stringify(address),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Could not save address");
            } else {
                const data = await response.json();
                console.log("Updated data is:", data);
                setUserAddress(data);
            }
        } catch (error) {
            console.error("Error saving address:", error);
        } finally {
        }
    }

    const handleProfileSubmit = async (values) => {
        if (profile) {
            try {

                const profileJson = JSON.parse(profile);


                const userProfileProp = UserProfile.fromProps(profileJson);

                //remain at bottom of page
                window.scrollTo(0, document.body.scrollHeight);

                setSubmitDisabled(true);

                const mProfile = {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    dob: values.date
                };

                const baseUrl = `${Util.apiUrl}userProfiles/${userProfileProp.id}`;

                try {
                    const response = await fetch(baseUrl, {
                        method: "PUT",
                        body: JSON.stringify(mProfile),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Could not save profile");
                    } else {
                        await response.json().then(data => {
                            let stringUser = JSON.stringify(data);
                            localStorage.setItem('userProfile', stringUser)

                            let profileModel = UserProfile.fromProps(data);

                            setUserProfile(profileModel);

                            console.log(data)
                        })
                    }
                } catch (error) {
                    console.error("Error saving profile:", error);
                } finally {
                }

            } catch (error) {
                console.error("Error parsing profile:", error);
            }
        }


    }

    const setIsEditingAddressValue = () => {
        //show one form at a time
        setIsEditingAddress(!isEditingAddress)
        setIsEditingProfile(isEditingProfile ? false : isEditingProfile)
    }

    const setIsEditingProfileValue = () => {
        //show one form at a time
        setIsEditingAddress(isEditingAddress ? false : isEditingAddress)
        setIsEditingProfile(!isEditingProfile)
    }

    return (

        <div className=" p-1 p-sm-1 p-md-5 p-lg-5  m-0 border-opacity-10">
            <nav>
                <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-profile-tab" data-bs-toggle="tab"
                            data-bs-target="#nav-profile"
                            type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile
                    </button>
                    <button className="nav-link" id="nav-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-orders"
                            type="button" role="tab" aria-controls="nav-orders" aria-selected="false">Orders
                    </button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                {/*//////////////////////////////PROFILE START///////////////////////////////////////////////////////*/}
                <div className="tab-pane fade show active" id="nav-profile" role="tabpanel"
                     aria-labelledby="nav-profile-tab">
                    <div
                        className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-3 p-1 p-sm-1 p-md-5 p-lg-5">
                        <div className="col">
                            <div className="card w-100">
                                <div className="d-flex justify-content-between card-header"
                                     style={{textTransform: "uppercase"}}>
                                    <span>Account Details</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6F0"
                                         className="bi bi-pen-fill" viewBox="0 0 16 16" type="button"
                                         onClick={setIsEditingProfileValue}>
                                        <path
                                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                                        >
                                    </svg>
                                </div>
                                <div className="card-body">
                                    <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>First Name: <small
                                        className="fw-light"
                                        style={{color: "black"}}>{userProfile.firstName}</small></CardText>
                                    <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>Last Name: <small
                                        className="fw-light"
                                        style={{color: "black"}}>{userProfile.lastName}</small></CardText>
                                    <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>Email: <small
                                        className="fw-light"
                                        style={{color: "black"}}>{userProfile.email}</small></CardText>
                                    <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>Date of Birth: <small
                                        className="fw-light"
                                        style={{color: "black"}}>{userProfile.dob.toDateString()}</small></CardText>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card w-100">
                                <div className="d-flex justify-content-between card-header"
                                     style={{textTransform: "uppercase"}}>
                                    <span>Address book</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#23A6F0"
                                         className="bi bi-pen-fill" viewBox="0 0 16 16" type="button"
                                         onClick={setIsEditingAddressValue}>
                                        <path
                                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                                    </svg>
                                </div>
                                <div className="card-body">
                                    <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>Address 1: <small
                                        className="fw-light" style={{color: "black"}}>{
                                        userAddress ? userAddress.address1 : "Not set"
                                    }</small></CardText>
                                    <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>Address 2: <small
                                        className="fw-light" style={{color: "black"}}>{
                                        userAddress ? userAddress.address2 : "Not set"
                                    }</small></CardText>
                                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2">
                                        <div className="col">
                                            <CardText className="fs-6 fw-bold" style={{color: "#23A6F0"}}>City: <small
                                                className="fw-light" style={{color: "black"}}>{
                                                userAddress ? userAddress.city : "Not set"
                                            }</small></CardText>
                                        </div>
                                        <div className="col mt-3 mt-sm-3 mt-md-0 mt-lg-0">
                                            <CardText className="fs-6 fw-bold"
                                                      style={{color: "#23A6F0"}}>Country: <small
                                                className="fw-light" style={{color: "black"}}>{
                                                userAddress ? userAddress.country : "Not set"
                                            }</small></CardText>
                                        </div>
                                        <div className="col mt-3 mt-sm-3 mt-md-3 mt-lg-3">
                                            <CardText className="fs-6 fw-bold"
                                                      style={{color: "#23A6F0"}}>Postcode: <small
                                                className="fw-light" style={{color: "black"}}>{
                                                userAddress ? userAddress.postCode : "Not set"
                                            }</small></CardText>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div hidden={!isEditingAddress}>
                        <AddressForm
                            handleSubmit={handleSubmit}
                        />

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4935928.2889158875!2d-2.3278149499999996!3d52.838200449999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1714045559332!5m2!1sen!2suk"
                            width="600" height="450" style={{border: "0"}} allowFullScreen="" loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div hidden={!isEditingProfile}>
                        <ProfileForm
                            userProfile={userProfile}
                            handleProfileSubmit={handleProfileSubmit}
                        />
                    </div>
                </div>
                {/*//////////////////////////////PROFILE END///////////////////////////////////////////////////////*/}

                {/*///////////////////////////////ORDERS START///////////////////////////////////////////////////////*/}
                <div className="tab-pane fade" id="nav-orders" role="tabpanel" aria-labelledby="nav-orders-tab">
                    <div className="album  p-1 p-sm-1 p-md-5 p-lg-5">
                        <div className="container">
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-1 g-3">
                                <div className="col">
                                    <h3 className="fw-bold">Your orders</h3>
                                    {/*//////////////////////////////////////Accordion Start//////////////////////////////////*/}
                                    <div className="accordion" id="accordionExample">
                                        {/*//////////////////////////////////////Accordion Item Start//////////////////////////////////*/}
                                        {orders && orders.length > 0 && (
                                            <div>
                                                {orders.map((order, index) => (
                                                    <OrderCards
                                                        key={order.id}
                                                        index={index}
                                                        order={order}
                                                        token={token}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {/*//////////////////////////////////////Accordion Item End//////////////////////////////////*/}
                                    </div>
                                    <div className="alert alert-info alert-dismissible fade show mt-5" role="alert"
                                         hidden={orders && orders.length > 0}>
                                        You have not placed any order. Check your<Link to={"/cart-details"}
                                                                                       className="alert-link"> cart</Link>
                                        <button type="button" className="btn-close" data-bs-dismiss="alert"
                                                aria-label="Close"></button>
                                    </div>
                                    {/*//////////////////////////////////////Accordion End//////////////////////////////////*/}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default AccountPage;