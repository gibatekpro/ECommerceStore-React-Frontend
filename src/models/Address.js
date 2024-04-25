class Address {
    constructor(id, address1, address2, city, country, postCode, userProfileId) {
        this.id = id ? id : null
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.country = country;
        this.postCode = postCode;
        this.userProfileId = userProfileId
    }

    static fromProps(props) {
        return new Address(
            props.id || null,
            props.address1,
            props.address2 || "",
            props.city,
            props.country,
            props.postCode,
            props.userProfileId || null
        );
    }
}

export default Address;