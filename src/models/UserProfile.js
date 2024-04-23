export class UserProfile {
    constructor(id, firstName, lastName, userId, email, dob = new Date()) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userId = userId;
        this.email = email;
        this.dob = dob;
    }

    static fromProps(props) {
        return new UserProfile(
            props.id,
            props.firstName,
            props.lastName,
            props.userId,
            props.email,
            props.dob
        );
    }
}