import './RegisterPage.css';
import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
import {Field} from "formik";
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import * as Yup from 'yup';
import {Link, Navigate, useNavigate} from "react-router-dom";
import {Util} from "../../util/utils";

function RegisterPage() {
    window.scroll(0, 0);
    const {Formik} = formik;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passVisible, setPassVisible] = useState(false);
    const [passConfirmVisible, setPassConfirmVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const today = new Date();
    const year18 = new Date(today.setFullYear(today.getFullYear() - 15));

    let navigate = useNavigate();

    const handlePasswordVisibility = () => {setPassVisible(!passVisible)}

    const handlePasswordConfirmVisibility = () => {setPassConfirmVisible(!passConfirmVisible)}

    async function handleSubmit(values) {
        const requestBody = JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            dob: values.date,
        });

        try {
            const response = await fetch(`${Util.apiUrl}account/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });

            if (response.ok) {
                console.log("Registration successful");
                navigate("success");
            } else {
                const errorData = await response;
                console.log(errorData)
                navigate("failure");
            }
        } catch (error) {
            console.error("Registration Error:", error.message);
        }finally {
            setIsLoading(false);
        }
    }

    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(1, 'Too Short!')
            .max(25, 'Too Long!')
            .required('Required'),
        lastName: Yup.string()
            .min(1, 'Too Short!')
            .max(25, 'Too Long!')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Too Short!')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\\^\-,_+=!%*?&])[A-Za-z\d@$\\^\-,_+=!%*?&]{8,}$/, {
                message: 'Must contain at least one special character and uppercase'
            })
            .max(25, 'Too Long!')
            .required('Required'),
        confirmPassword: Yup.string()
            .min(8, 'Too Short!')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\\^\-,_+=!%*?&])[A-Za-z\d@$\\^\-,_+=!%*?&]{8,}$/, {
                message: 'Must contain at least one special character and uppercase'
            })
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .max(25, 'Too Long!')
            .required('Required'),
        email: Yup.string()
            .required('Required')
            .matches("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$", {
                message: 'Email does not match expected pattern'
            }),
        date: Yup.date()
            .required('Required')
            .max(year18, 'You must be 15+ to place an order.'),
        // terms: Yup.bool()
        //     .required()
        //     .oneOf([true], 'Terms must be accepted'),
    });
    return (
        <div style={{
            display: "flex",
            marginTop: "50px",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    date: '',
                    // terms: false
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values) => {
                    setIsLoading(true);
                    await new Promise((r) => setTimeout(r, 500));
                    await handleSubmit(values);
                }}>
                {({handleSubmit, handleChange, values, touched, errors}) => (
                    <Form noValidate
                          onSubmit={handleSubmit}
                          style={{
                              display: "flex",
                              flexDirection: "column",
                              flexGrow: 1,
                              maxWidth: "400px",
                              width: "100%",
                              padding: "20px",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              borderRadius: "8px",
                              backgroundColor: "#fff"
                          }} className="bg-body-tertiary">
                        <a className="logo text-center fs-3" href="/">ShopVerse</a>
                        <hr/>
                        <h6 className="text-center mt-2">Create an account</h6>
                        <hr className="mb-5"/>
                        <h6 className="text-center" hidden={!isLoading}>
                            <div className="spinner-border text-primary " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </h6>
                        <Row className="mb-3">
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
                        </Row>
                        <Row className="mb-3">
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
                        </Row>
                        <Row className="mb-3">
                            <Form.Group md="4" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={errors.email != null}
                                    />
                                    <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group md="4" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type={passVisible ? "text" : "password"}
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        isValid={touched.password && !errors.password}
                                        isInvalid={touched.password && errors.password}
                                    />
                                    <InputGroup.Text id="inputGroupPrepend" as="button" type="button"
                                                     onClick={handlePasswordVisibility}>
                                        {passVisible ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-eye" viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                <path
                                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                                <path
                                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                                <path
                                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                            </svg>}
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group md="4" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <InputGroup hasValidation={"true"}>
                                    <Form.Control
                                        type={passConfirmVisible ? "text" : "password"}
                                        name="confirmPassword"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        isValid={touched.confirmPassword && !errors.confirmPassword}
                                        isInvalid={touched.confirmPassword && errors.confirmPassword}
                                    />
                                    <InputGroup.Text id="inputGroupPrependB" as="button" type="button"
                                                     onClick={handlePasswordConfirmVisibility}>
                                        {passConfirmVisible ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-eye" viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor"
                                                 className="bi bi-eye-slash" viewBox="0 0 16 16">
                                                <path
                                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                                <path
                                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                                <path
                                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                            </svg>}
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmPassword}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
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
                        <Button className="hard-button blue" type="submit" disabled={isLoading}>Sign up</Button>
                        <br/>
                        <small>Already have an account? <Link to="/login">Sign in</Link></small>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default RegisterPage;