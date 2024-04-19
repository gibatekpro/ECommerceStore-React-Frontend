import './App.css';
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import HomePage from "./pages/home_page/HomePage";
import SearchPage from "./pages/search_page/SearchPage";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import ProductDetailsPage from "./pages/product_details_page/ProductDetailsPage";
import RegisterPage from "./pages/register_page/RegisterPage";

function App() {
    return (
        <div>
            <Navbar/>
            <div className="app-body d-flex flex-column">
                <Routes>
                    <Route path="/" element={<HomePage />}>
                        {/*<Route index element={<HomePage />} />*/}
                    </Route>
                    <Route path="/search" element={<SearchPage />}>
                    </Route>
                    <Route path="/signup" element={<RegisterPage />}>
                    </Route>
                    <Route path="*" element={<HomePage />}>
                    </Route>
                    <Route path="product-details">
                        <Route path=":productId" element={<ProductDetailsPage />} />
                    </Route>
                </Routes>
                {/*<ProductDetailsPage/>*/}
            </div>
            <Footer/>
        </div>
    );
}

export default App;
