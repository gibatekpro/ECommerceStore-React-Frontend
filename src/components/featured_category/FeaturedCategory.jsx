import './FeaturedCategory.css'
import BabyProducts from "../../assets/images/Featured Category/BabyProducts.jpg";
import Gaming from "../../assets/images/Featured Category/Gaming.jpeg";

function FeaturedCategory(props) {
    return (
        <div className="row featurette">
            {props.value === 0 ? (
                <>
                    <hr className="featurette-divider d-lg-none"/>
                    <div className="row featurette">
                        <div className="col-md-6 p-5">
                            <h2 className="featurette-heading fw-normal lh-1">Delightful Finds for Your Little One!</h2>
                            <p className="lead">Keep your baby happy, smiling, and cooing with our handpicked selection
                                of toys, clothes, and essentials. From soft plush toys that they’ll love to hug to
                                comfortable, stylish outfits perfect for playtime, we have everything to enhance your
                                little one's world.</p>

                            <button className="hard-button green uppercase" href="#">Shop Now</button>
                        </div>
                        <div className="col-md-6">
                            <img src={BabyProducts}
                                 className="featured img"
                                 alt="Example image"/>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <hr className="featurette-divider d-lg-none"/>
                    <div className="row featurette">
                        <div className="col-md-6">
                            <img src={Gaming}
                                 className="featured img"
                                 alt="Example image"/>
                        </div>
                        <div className="col-md-6 p-5">
                            <h2 className="featurette-heading fw-normal lh-1">Epic Gear for Ultimate Gamers!</h2>
                            <p className="lead">Elevate your gaming experience with our top-tier selection of gaming
                                gear, designed for the ultimate gamers. Whether you're battling it out in the virtual
                                arenas or exploring new fantastical worlds, our products—from high-performance gaming
                                PCs and consoles to precision controllers and immersive headsets—ensure you play at your
                                best.</p>

                            <button className="hard-button green uppercase" href="#">Shop Now</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


export default FeaturedCategory;