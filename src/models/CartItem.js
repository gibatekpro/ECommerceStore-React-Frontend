class CartItem{

    constructor(id, productName, productImageId, unitPrice, quantity = 1){
        this.id = id;
        this.productName = productName;
        this.productImageId = productImageId;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    static fromProps(props) {
        return new CartItem(
            props.id,
            props.productName,
            props.productImageId,
            props.unitPrice,
            props.quantity
        );
    }


}

export default CartItem;