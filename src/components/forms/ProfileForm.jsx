import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import {Formik} from "formik";
import * as Yup from "yup";
import Row from "react-bootstrap/Row";


const ProfileForm = ({handleProfileSubmit}) => {

    const today = new Date();
    const year18 = new Date(today.setFullYear(today.getFullYear() - 15));

    const AddressSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(1, 'Too Short!')
            .max(25, 'Too Long!')
            .required('Required'),
        lastName: Yup.string()
            .min(1, 'Too Short!')
            .max(25, 'Too Long!')
            .required('Required'),
        date: Yup.date()
            .required('Required')
            .max(year18, 'You must be 15+ to place an order.'),
    });


    const submitForm = (values) => {

        handleProfileSubmit(values);
    }

    return (
        <div>
            <div className="text-center mt-4 px-smx-3 mt-md-4 mt-lg-4 px-1 px-smx-1 px-md-5 px-lg-5">
                <h4>Editing Account Details</h4>
            </div>
            <hr/>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    date: '',
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
                                <Form.Group md="4" controlId="firstName">
                                    <Form.Label>First name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        isValid={touched.firstName && !errors.firstName}
                                        isInvalid={errors.firstName != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-12">
                                <Form.Group md="4" controlId="lastName">
                                    <Form.Label>Last name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        isValid={touched.lastName && !errors.lastName}
                                        isInvalid={errors.lastName != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>

                        <Row className="px-1 px-smx-1 px-md-5 px-lg-5">
                            <Form.Group md="4" controlId="email">
                                <Form.Label>Date of Birth</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={values.date}
                                        onChange={handleChange}
                                        isValid={touched.date && !errors.date}
                                        isInvalid={errors.date != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.date}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>

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
export default ProfileForm;