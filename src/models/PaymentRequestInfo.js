export class PaymentRequestInfo {
    constructor(receiptEmail, amount, currency, description) {
        this.receiptEmail = receiptEmail;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
    }

    // Static method to create an instance from a properties object
    static fromProps(props) {
        return new PaymentRequestInfo(
            props.receiptEmail,
            props.amount,
            props.currency,
            props.description
        );
    }
}
