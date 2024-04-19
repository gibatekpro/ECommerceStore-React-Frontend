import './Navbar.css';
import {Link, NavLink} from "react-router-dom";

function Navbar() {
    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-light">
                <div className="container-fluid">
                    <a className="logo mx-3" href="/">ShopVerse</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#252B42"
                             className="bi bi-list " viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="ms-md-5"></div>
                        <ul className="navbar-nav me-auto mb-2 mb-md-0 ms-md-5">
                            <li className="nav-item">
                                <a className="Text black fw-bold nav-link" aria-current="page" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="Text black fw-bold nav-link" href="#">About</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="Text black nav-link dropdown-toggle" href="#"
                                   data-bs-toggle="dropdown"
                                   aria-expanded="false">Category</a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>

                        {/*<form className="d-flex" role="search">*/}
                        {/*    <input className="form-control me-2" type="search" placeholder="Search"*/}
                        {/*           aria-label="Search"/>*/}
                        {/*    <button className="outline-button" type="submit">Search</button>*/}
                        {/*</form>*/}
                        <ul className="navbar-nav d-flex mb-2 me-5 mb-md-0 ms-md-5">
                            <li className="nav-item">
                                <a className="Icon fw-normal nav-link" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         className="bi-cart" viewBox="0 0 16 16">
                                        <path
                                            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                                    </svg>
                                    1
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="Icon fw-normal Text blue fw-bold nav-link" aria-current="page"
                                   href="/signup">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         className="bi bi-person me-1 mb-1" viewBox="0 0 16 16">
                                        <path
                                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                    Login/Register</a>
                            </li>
                            <a href="/search">
                                <button className="nav-item hard-button blue mx-3" type="submit">Search</button>
                            </a>
                        </ul>
                    </div>
                </div>
            </nav>

        </div>
    );
}

export default Navbar;
