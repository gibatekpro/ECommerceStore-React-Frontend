import './LargeCarousel.css'
import image1 from "../../../assets/images/carousel/image1.jpg";
import image2 from "../../../assets/images/carousel/image2.jpg";
import image3 from "../../../assets/images/carousel/image3.jpg";
import {Link} from "react-router-dom";


function LargeCarousel(){

    return (

        <div id="largeCarousel" className="carousel large-carousel slide mb-0" data-bs-ride="carousel">
            <div className="carousel-indicators large-carousel">
                <button type="button" data-bs-target="#largeCarousel" data-bs-slide-to="0" className="active"
                        aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#largeCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#largeCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner large-carousel">
                <div className="carousel-item large-carousel active">
                        <img src={image1}
                             className="carousel large-carousel img shadow-lg mb-4"
                             alt="Example image"/>
                    <div className="container">
                        <div className="carousel-caption large-carousel text-start">
                            <h1>Exclusive Offers</h1>
                            <p className="opacity-75">Lots of exclusive offers just waiting for you! Don't miss out on
                                the chance to save big.</p>
                            <Link to={"/search"}>
                                <button className="hard-button green uppercase">Shop Now</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-item large-carousel">
                    <img src={image2}
                         className="carousel large-carousel img shadow-lg mb-4"
                         alt="Example image"/>
                    <div className="container">
                        <div className="carousel-caption large-carousel">
                            <h1>Best deals for home appliances</h1>
                            <p>Get the best appliances and electronics to make your home and office extra-comfy.</p>
                            <Link to={"/search"}>
                                <button className="hard-button green uppercase">Shop Now</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-item large-carousel">
                    <img src={image3}
                         className="carousel large-carousel img shadow-lg mb-4"
                         alt="Example image"/>
                    <div className="container">
                        <div className="carousel-caption large-carousel text-end">
                            <h1>Explore trending gadgets</h1>
                            <p>Great deals on all the latest trending gadgets.</p>
                            <Link to={"/search"}>
                                <button className="hard-button green uppercase">Shop Now</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#largeCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#largeCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>

        </div>

    );

}

export default LargeCarousel;