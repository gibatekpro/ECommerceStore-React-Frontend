export class OrderItem {
    constructor(quantity, productId) {
        this.quantity = quantity;
        this.id = productId;
    }

    static fromProps(props) {
        return new OrderItem(
            props.quantity,
            props.id
        );
    }
    toJSON() {
        return {
            quantity: this.quantity,
            productId: this.id // Use 'productId' as the key name
        };
    }
}

export default OrderItem;