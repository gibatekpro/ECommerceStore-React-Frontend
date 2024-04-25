class OrderHistory {
    constructor(
        id,
        firstName,
        lastName,
        email,
        orderTrackingNumber = null,
        totalQuantity,
        totalPrice,
        dateCreated = null,
        lastUpdated = null,
        userProfileId = null,
        shippingAddressId = null,
        billingAddressId = null,
        orderStatusId = null
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.orderTrackingNumber = orderTrackingNumber;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
        this.dateCreated = dateCreated ? new Date(dateCreated) : null;
        this.lastUpdated = lastUpdated ? new Date(lastUpdated) : null;
        this.userProfileId = userProfileId;
        this.shippingAddressId = shippingAddressId;
        this.billingAddressId = billingAddressId;
        this.orderStatusId = orderStatusId;
    }

    // Static factory method to create an Order from a given object
    static fromProps(props) {
        return new OrderHistory(
            props.id,
            props.firstName,
            props.lastName,
            props.email,
            props.orderTrackingNumber || null,
            props.totalQuantity,
            props.totalPrice,
            props.dateCreated || null,
            props.lastUpdated || null,
            props.userProfileId || null,
            props.shippingAddressId || null,
            props.billingAddressId || null,
            props.orderStatusId || null
        );
    }
}

export default OrderHistory;