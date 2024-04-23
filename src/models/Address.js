class Address {
    constructor(address1, address2, city, country, postCode) {
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.country = country;
        this.postCode = postCode;
    }

    static fromProps(props) {
        return new Address(
            props.address1, // Address line 1
            props.address2 || "", // Address line 2 (optional)
            props.city, // City name
            props.country, // Country name
            props.postCode // Postal code
        );
    }
}

export default Address;