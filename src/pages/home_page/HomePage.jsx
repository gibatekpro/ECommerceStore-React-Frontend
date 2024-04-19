import './HomePage.css'
import LargeCarousel from "../../components/carousels/large_carousel/LargeCarousel";
import FeaturedProducts from "../../components/featured_products/FeaturedProducts";
import FeaturedCategory from "../../components/featured_category/FeaturedCategory";
import ProductCategoriesCarousel from "../../components/carousels/product_categories_carousel/ProductCategoriesCarousel";

function HomePage() {

    var data = [0, 1]

    return (
        <div>
            <LargeCarousel/>
            <div className="b-divider"></div>
            <FeaturedProducts/>
            <FeaturedCategory
                value={data[0]}/>
            <FeaturedCategory
                value={data[1]}/>
            <ProductCategoriesCarousel/>
        </div>
    );

}

export default HomePage;