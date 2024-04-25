import './App.css';
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import HomePage from "./pages/home_page/HomePage";
import SearchPage from "./pages/search_page/SearchPage";
import {Routes, Route, Outlet, Link} from "react-router-dom";
import ProductDetailsPage from "./pages/product_details_page/ProductDetailsPage";
import RegisterPage from "./pages/register_page/RegisterPage";
import LoginPage from "./pages/login_page/LoginPage";
import {AuthProvider, useAuth} from "./services/auth/AuthProvider";
import RequireAuth from "./services/auth/RequireAuth";
import ProtectedPage from "./pages/ProtectedPage";
import FailurePage from "./pages/register_page/FailurePage";
import SuccessPage from "./pages/register_page/SuccessPage";
import {CartServiceProvider} from "./services/CartServiceProvider";
import CartDetailsPage from "./pages/cart_details_page/CartDetailsPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import {useEffect, useState} from "react";
import {UserProfile} from "./models/UserProfile";
import {useElements, useStripe} from "@stripe/react-stripe-js";
import {Util} from "./util/utils";
import Product from "./models/Product";
import ProductCategory from "./models/ProductCategory";
import ProductCategoryPage from "./pages/ProductCategoryPage/ProductCategoryPage";
import AccountPage from "./pages/account_page/AccountPage";


function App() {
    const [userProfile, setUserProfile] = useState(localStorage.getItem('userProfile'));
    return (
        <div>
            <AuthProvider>
                <CartServiceProvider>
                    <Navbar/>
                    <div className="app-body d-flex flex-column">
                        <Routes>
                            <Route path="/" element={<HomePage/>}>
                                {/*<Route index element={<HomePage />} />*/}
                            </Route>
                            <Route path="product-categories">
                                <Route path=":productCategoryName/:productCategoryId" element={<ProductCategoryPage/>}/>
                            </Route>
                            <Route path="/search" element={<SearchPage/>}>
                            </Route>
                            <Route path="register" element={<RegisterPage/>}>
                            </Route>
                            <Route path="cart-details" element={<CartDetailsPage/>}>
                            </Route>
                            <Route path="register/success" element={<SuccessPage/>}>
                            </Route>
                            <Route path="register/failure" element={<FailurePage/>}>
                            </Route>
                            <Route path="register/*" element={<HomePage/>}>
                            </Route>
                            <Route path="*" element={<HomePage/>}>
                            </Route>
                            <Route path="product-details">
                                <Route path=":productId" element={<ProductDetailsPage/>}/>
                            </Route>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/account-page"
                                   element={
                                       <RequireAuth>
                                           <AccountPage/>
                                       </RequireAuth>
                                   }
                            />
                            <Route
                                path="/protected"
                                element={
                                    <RequireAuth>
                                        <ProtectedPage/>
                                    </RequireAuth>
                                }
                            />
                            <Route path="cart-details/checkout"
                                   element={
                                       <RequireAuth>
                                           <CheckoutPage userProfile={userProfile}/>
                                       </RequireAuth>
                                   }>
                            </Route>
                        </Routes>
                        {/*<ProductDetailsPage/>*/}
                    </div>
                    <Footer/>
                </CartServiceProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
