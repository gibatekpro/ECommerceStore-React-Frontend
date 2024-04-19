export class Product {
    constructor(id, productName, description, unitPrice, productImageId, active, unitsInStock, dateCreated, lastUpdated, productCategoryId) {
        this.id = id;
        this.productName = productName;
        this.description = description;
        this.unitPrice = unitPrice;
        this.productImageId = productImageId;
        this.active = active;
        this.unitsInStock = unitsInStock;
        this.dateCreated = new Date(dateCreated);
        this.lastUpdated = lastUpdated ? new Date(lastUpdated) : null;
    }

    static fromProps(props) {
        return new Product(
            props.id,
            props.productName,
            props.description,
            props.unitPrice,
            props.productImageId,
            props.active,
            props.unitsInStock,
            props.dateCreated,
            props.lastUpdated,
        );
    }
}

export default Product;