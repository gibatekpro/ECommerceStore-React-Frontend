import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {cityOptions} from "../../util/CityOptions";
import {CardElement} from "@stripe/react-stripe-js";
import Button from "react-bootstrap/Button";
import CurrencyValue, {Util} from "../../util/utils";
import React, {useState} from "react";
import {Formik} from "formik";
import * as Yup from "yup";
import Address from "../../models/Address";
import {PaymentRequestInfo} from "../../models/PaymentRequestInfo";
import Checkout from "../../models/Checkout";


const AddressForm = ({handleSubmit}) => {

    const AddressSchema = Yup.object().shape({
        address: Yup.string()
            .min(1, 'Too Short!')
            .max(80, 'Too Long!')
            .required('Required'),
        country: Yup.string()
            .required('Required'),
        city: Yup.string()
            .required('Required'),
        postCode: Yup.string()
            .required('Required')
            .max(8, 'Too Long!')
            .matches(/^[a-zA-Z0-9 ]+$/, 'Invalid Postcode'),
    });


    const submitForm = (values) => {

        handleSubmit(values);
    }

    return (
        <div>
            <div className="text-center mt-4 px-smx-3 mt-md-4 mt-lg-4 px-1 px-smx-1 px-md-5 px-lg-5">
                <h4>Editing Address</h4>
            </div>
            <hr/>
            <Formik
                initialValues={{
                    address: "",
                    address2: "",
                    country: "",
                    city: "",
                    postCode: ""
                }}
                validationSchema={AddressSchema}
                onSubmit={async (values, {setSubmitting}) => {
                    await new Promise((r) => setTimeout(r, 500));
                    submitForm(values);
                    setSubmitting(false);
                }}>
                {({handleSubmit, isSubmitting, handleChange, values, touched, errors}) => (
                    <Form noValidate
                          onSubmit={handleSubmit}>
                        {/*////////////////////////////SHIPPING ADDRESS SECTION//////////////////////////////////*/}
                        <div
                            className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-3 p-1 p-sm-1 p-md-5 p-lg-5">
                            <div className="col-md-12">
                                <Form.Group controlId="address">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        isValid={touched.address && !errors.address}
                                        isInvalid={errors.address != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-12">
                                <Form.Group controlId="address2">
                                    <Form.Label>Address 2 (Optional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Apartment or suite"
                                        name="address2"
                                        value={values.address2}
                                        onChange={handleChange}
                                        isValid={touched.address2 && !errors.address2}
                                        isInvalid={errors.address2 != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address2}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>

                        <div
                            className="row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-3 g-3 px-1 px-smx-1 px-md-5 px-lg-5">

                            <div className="col-md-5">
                                <Form.Group controlId="country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select
                                        name="country"
                                        value={values.country}
                                        onChange={handleChange}
                                        isValid={touched.country && !errors.country}
                                        isInvalid={errors.country != null}
                                    >
                                        <option value="">Select</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.country}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Select
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        isValid={touched.city && !errors.city}
                                        isInvalid={errors.city != null}
                                    >
                                        <option value="">Select</option>
                                        {cityOptions.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}

                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-3">
                                <Form.Group controlId="postCode">
                                    <Form.Label>Post Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="postCode"
                                        value={values.postCode}
                                        onChange={handleChange}
                                        isValid={touched.postCode && !errors.postCode}
                                        isInvalid={errors.postCode != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.postCode}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>

                        {/*////////////////////////////SUBMIT BUTTON//////////////////////////////////*/}

                        <h6 className="text-center mt-5" hidden={!isSubmitting}>
                            <div className="spinner-border text-primary " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </h6>
                        <div className="text-center mt-3 px-smx-3 mt-md-4 mt-lg-4 px-1 px-smx-1 px-md-5 px-lg-5">
                            <Button
                                className="hard-button blue w-100"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
export default AddressForm;