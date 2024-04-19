import './RegisterPage.css';
import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import button from "bootstrap/js/src/button";

function RegisterPage() {
    const [validated, setValidated] = useState(false);
    const [passVisible, setPassVisible] = useState(false);

    const handlePasswordVisibility = () => {

        if (passVisible){
            setPassVisible(false);
        }else {
            setPassVisible(true);
        }

    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <div style={{
            display: "flex",
            marginTop: "50px",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <FormIk noValidate validated={validated} onSubmit={handleSubmit} style={{
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
                <h6 className="text-center mt-2 mb-5">Create an account</h6>
                <Row className="mb-3">
                    <Form.Group md="4" controlId="first_name">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            defaultValue=""
                        />
                        <Form.Control.Feedback type="invalid">Input first name</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group md="4" controlId="last_name">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder=""
                            defaultValue=""
                        />
                        <Form.Control.Feedback type="invalid">Input last name</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group md="4" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="email"
                                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"
                                placeholder=""
                                aria-describedby="inputGroupPrepend"
                                required
                            />
                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group md="4" controlId="pass1">
                        <Form.Label>Password</Form.Label>
                        <InputGroup hasValidation={true}>
                            <Form.Control
                                required
                                type={passVisible ? "text" : "password"}
                                placeholder=""
                                defaultValue=""
                            />
                            <InputGroup.Text id="inputGroupPrepend" as="button" onClick={handlePasswordVisibility}>
                                {passVisible ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      className="bi bi-eye" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                    <path
                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="bi bi-eye-slash" viewBox="0 0 16 16">
                                    <path
                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                    <path
                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                    <path
                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>}
                            </InputGroup.Text>
                            {/*<Form.Control.Feedback>Looks good!</Form.Control.Feedback>*/}
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group md="4" controlId="pass1">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup hasValidation={"true"}>
                            <Form.Control
                                required
                                type={passVisible ? "text" : "password"}
                                placeholder=""
                                defaultValue=""
                            />
                            <InputGroup.Text id="inputGroupPrepend" as="button" onClick={handlePasswordVisibility}>
                                {passVisible ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                      className="bi bi-eye" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                    <path
                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    className="bi bi-eye-slash" viewBox="0 0 16 16">
                                    <path
                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                    <path
                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                    <path
                                    d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                                    </svg>}
                            </InputGroup.Text>
                            {/*<Form.Control.Feedback>Looks good!</Form.Control.Feedback>*/}
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Check
                        required
                        label="Agree to terms and conditions"
                        feedback="You must agree before submitting."
                        feedbackType="invalid"
                    />
                </Form.Group>
                <Button className="hard-button blue" type="submit">Submit form</Button>
            </FormIk>
        </div>
    );
}

export default RegisterPage;