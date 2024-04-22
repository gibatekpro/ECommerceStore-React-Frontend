export const Util = {
    apiUrl: 'http://localhost:5051/api/',
    baseUrl: 'http://localhost:5051',
    stripeKey: 'pk_test_51N5XrvG4mCGEpPxu7qpEIfRNYKHwzzoA2ZmAYQeYX3evd6qXwFPzK8OT5f4kspvLyfw91k737pZ62JMFHrmjUYRF00wwqOxI6R'
};

const CurrencyValue = value => `£${parseFloat(value).toFixed(2)}`;
export default CurrencyValue;