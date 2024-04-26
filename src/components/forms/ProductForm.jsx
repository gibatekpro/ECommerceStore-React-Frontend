import * as Yup from "yup";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import {cityOptions} from "../../util/CityOptions";
import Button from "react-bootstrap/Button";
import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import {useState} from "react";

const ProductForm = ({product, handleSubmit}) => {
    const [errorMessage, setErrorMessage] = useState(null)

    const ProductSchema = Yup.object().shape({

            productName: Yup.string()
                .min(1, 'Too Short!')
                .max(80, 'Too Long!')
                .required('Required'),
            description: Yup.string()
                .min(1, 'Too Short!')
                .max(250, 'Too Long!')
                .required('Required'),
            unitPrice: Yup.string()
                .required('Input amount as digits'),
            unitsInStock: Yup.string()
                .required('Input units as digits')
                .matches(/^\d+$/, {
                    message: 'Only whole numbers allowed'
                })

        })
    ;

    const submitForm = (values) => {

        // if (!values.productImageId){
        //     console.log("Not editing image")
        //     console.log("Values", values)
        // }

        handleSubmit(values);
    }

    return (
        <div>
            <div className="text-center mt-4 px-smx-3 mt-md-4 mt-lg-4 px-1 px-smx-1 px-md-5 px-lg-5">
                <h4>Editing Product</h4>
            </div>
            <hr/>
            <Formik
                initialValues={{
                    productName: product.productName,
                    description: product.description,
                    unitPrice: product.unitPrice,
                    unitsInStock: product.unitsInStock,
                }}
                validationSchema={ProductSchema}
                onSubmit={async (values, {setSubmitting, setFieldValue, setErrorMessage}) => {
                    await new Promise((r) => setTimeout(r, 2000));
                    submitForm(values);
                    setSubmitting(false);
                }}>
                {({handleSubmit, isSubmitting, handleChange, setFieldValue, values, touched, errors}) => (
                    <Form noValidate
                          onSubmit={handleSubmit}>
                        {/*////////////////////////////PRODUCT SECTION//////////////////////////////////*/}
                        <div
                            className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-3 p-1 p-sm-1 p-md-5 p-lg-5">
                            <div className="col-md-12">
                                <Form.Group controlId="productName">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        value={values.productName}
                                        onChange={handleChange}
                                        isValid={touched.productName && !errors.productName}
                                        isInvalid={errors.productName != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.productName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-md-12">
                                <Form.Group controlId="description">
                                    <Form.Label>Product Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        isValid={touched.description && !errors.description}
                                        isInvalid={errors.description != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>

                        <div
                            className="row row-cols-1 row-cols-sm-1 row-cols-md-3 row-cols-lg-3 g-3 px-1 px-smx-1 px-md-5 px-lg-5">

                            <div className="col-md-5">
                                <Form.Group controlId="unitPrice">
                                    <Form.Label>Unit Price</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id="inputGroupPrepend">£</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="unitPrice"
                                            value={values.unitPrice}
                                            onChange={handleChange}
                                            isValid={touched.unitPrice && !errors.unitPrice}
                                            isInvalid={errors.unitPrice != null}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.unitPrice}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </div>

                            <div className="col-md-4">
                                <Form.Group controlId="unitsInStock">
                                    <Form.Label>Units In Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="unitsInStock"
                                        value={values.unitsInStock}
                                        onChange={handleChange}
                                        isValid={touched.unitsInStock && !errors.unitsInStock}
                                        isInvalid={errors.unitsInStock != null}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.unitsInStock}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-3">
                                <Form.Group controlId="productImage" className="mb-3">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        isValid={touched.productImage && !errorMessage}
                                        isInvalid={errorMessage != null}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            const acceptedImageTypes = ["image/jpeg", "image/png, image/jpg"];

                                            if (file && acceptedImageTypes.includes(file.type)) {
                                                setFieldValue("productImage", file).then(r => {});
                                                setErrorMessage(null);
                                            } else {
                                                setErrorMessage("Please upload a valid image (JPEG or PNG).");
                                            }
                                        }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errorMessage}
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

export default ProductForm;