export const Util = {
    apiUrl: 'https://ecommerce.gibah.online/api/',
    baseUrl: 'https://ecommerce.gibah.online',
    stripeKey: 'pk_test_51N5XrvG4mCGEpPxu7qpEIfRNYKHwzzoA2ZmAYQeYX3evd6qXwFPzK8OT5f4kspvLyfw91k737pZ62JMFHrmjUYRF00wwqOxI6R',
    googleMapApiKey: 'AIzaSyDSjUFexb8QOXq3py5QRGUOYY6J-mVjFPE'
};

const CurrencyValue = value => `£${parseFloat(value).toFixed(2)}`;
export default CurrencyValue;