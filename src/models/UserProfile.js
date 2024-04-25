export class UserProfile {
    constructor(id, firstName, lastName, userId, email, dob = new Date(), orders = []) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userId = userId;
        this.email = email;
        this.dob = dob;
        this.orders = orders;
    }

    // Static factory method to create a UserProfile from a given object
    static fromProps(props) {
        return new UserProfile(
            props.id,
            props.firstName,
            props.lastName,
            props.userId,
            props.email,
            new Date(props.dob),
            props.orders
        );
    }
}