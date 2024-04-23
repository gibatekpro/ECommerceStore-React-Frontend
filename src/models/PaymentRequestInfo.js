import OrderItem from './OrderItem'; // Importing the OrderItem class

export class PaymentRequestInfo {
    constructor(receiptEmail, amount, currency, description, orderItems = []) {
        this.receiptEmail = receiptEmail;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.orderItems = orderItems;
    }

    // Static method to create an instance from a properties object
    static fromProps(props) {
        const orderItems = props.orderItems.map(itemProps =>
            OrderItem.fromProps(itemProps)
        );

        return new PaymentRequestInfo(
            props.receiptEmail,
            props.amount,
            props.currency,
            props.description,
            orderItems
        );
    }
}