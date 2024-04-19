
export class ProductCategory {
    constructor(id, categoryImageId, categoryName, categoryDescription) {
        this.id = id;
        this.categoryImageId = categoryImageId;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
    }

    static fromProps(props) {
        return new ProductCategory(
            props.id,
            props.categoryImageId,
            props.categoryName,
            props.categoryDescription
        );
    }
}

export default ProductCategory;
