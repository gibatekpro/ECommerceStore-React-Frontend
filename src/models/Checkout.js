import Address from './Address'; // Your Address class
import OrderItem from './OrderItem'; // Your OrderItem class

class Checkout {
    constructor(firstName, lastName, email, shippingAddress, billingAddress, orderItems) {
        this.firstName = firstName; // First name of the purchaser
        this.lastName = lastName; // Last name of the purchaser
        this.email = email; // Email of the purchaser
        this.shippingAddress = shippingAddress; // Shipping address as an Address instance
        this.billingAddress = billingAddress; // Billing address as an Address instance
        this.orderItems = orderItems; // Collection of OrderItem instances
    }

    // Static method to create a Checkout instance from a properties object
    static fromProps(props) {
        const shippingAddress = Address.fromProps(props.shippingAddress); // Convert to Address instance
        const billingAddress = Address.fromProps(props.billingAddress); // Convert to Address instance
        const orderItems = props.orderItems.map(OrderItem.fromProps); // Convert to OrderItem instances

        return new Checkout(
            props.firstName,
            props.lastName,
            props.email,
            shippingAddress,
            billingAddress,
            orderItems // An array of OrderItem instances
        );
    }
}

export default Checkout;