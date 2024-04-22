export class UserProfile {
    constructor(id, firstName, lastName, userId, email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userId = userId;
        this.email = email;
    }

    static fromProps(props) {
        return new UserProfile(
            props.id,
            props.firstName,
            props.lastName,
            props.userId,
            props.email,
        );
    }
}