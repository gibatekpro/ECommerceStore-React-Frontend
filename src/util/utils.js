export const Util = {
    apiUrl: 'http://localhost:5051/api/',
    baseUrl: 'http://localhost:5051',
};

const CurrencyValue = value => `£${parseFloat(value).toFixed(2)}`;
export default CurrencyValue;