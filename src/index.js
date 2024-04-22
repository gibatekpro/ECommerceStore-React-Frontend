import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {BrowserRouter} from "react-router-dom";
import {Util} from "./util/utils";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const root = ReactDOM.createRoot(document.getElementById('root'));
const stripePromise = loadStripe(Util.stripeKey);
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Elements stripe={stripePromise}>
              <App />
          </Elements>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
