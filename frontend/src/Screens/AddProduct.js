import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Container,
    FormGroup,
    Form,
    Input,
    Label,
    Button,
    FormFeedback
} from "reactstrap";
import { ServerAddress } from '../ServerAddress';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
    const storedToken = localStorage.getItem("user_token");
    const navigate = useNavigate();
    const location = useLocation();
    const [isUpdate, setisUpdate] = useState(false);
    const [productId, setproductId] = useState("")

    const formik = useFormik({
        initialValues: {
            productName: "",
            manufacturer: "",
            price: "",
            stock: "",
            discount: "",
        },
        validationSchema: Yup.object({
            productName: Yup.string().required('Product name is required'),
            manufacturer: Yup.string().required('Manufacturer name is required'),
            price: Yup.number().required('Price is required').positive('Price must be a positive number'),
            stock: Yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative'),
            discount: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100'),
        }),
        onSubmit: (values) => {
            isUpdate ? UpdateProduct(values) : AddProduct(values)
        },
    });

    const AddProduct = async (values) => {
        try {
            const response = await fetch(ServerAddress + 'api/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': storedToken,
                },
                // Add your request body if needed
                // body: JSON.stringify({ name: name, email: email }),
                body: JSON.stringify(values),
            });

            const data = await response.json();
            console.log("data==", data, response)
            if (response?.status === 201) {
                toast.success(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setTimeout(() => {
                    navigate("/product");
                }, 1000);
            } else {
                toast.error(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            }
            console.log("data----", data)

            // Handle the response or update the state accordingly
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const UpdateProduct = async (values) => {
        try {
            const response = await fetch(ServerAddress + `api/updateProduct/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': storedToken,
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response?.status === 200) {
                toast.success(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setTimeout(() => {
                    navigate("/product");
                }, 1000);
            } else {
                toast.error(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            }
            console.log("data----", data)

            // Handle the response or update the state accordingly
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        try {
            let data = location.state.productData;
            setproductId(data._id)
            setisUpdate(true);
            formik.setFieldValue("productName", data.productName || "");
            formik.setFieldValue("manufacturer", data.manufacturer || "");
            formik.setFieldValue("price", data.price || "");
            formik.setFieldValue("stock", data.stock || "");
            formik.setFieldValue("discount", data.discount || "");
        } catch (error) { }
    }, []);

    return (
        <Container>
            <ToastContainer />
            <h2>{isUpdate ? "Update Product" : "Add Product"}</h2>
            <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                    <Label for="productName">Product Name</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.productName}
                        invalid={formik.touched.productName && Boolean(formik.errors.productName)}
                        type="text"
                        name="productName"
                        id="productName"
                        placeholder="Enter product name"
                    />
                    {formik.touched.productName && formik.errors.productName ? (
                        <FormFeedback>{formik.errors.productName}</FormFeedback>
                    ) : null}
                </FormGroup>

                <FormGroup>
                    <Label for="manufacturer">Manufacturer Name</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.manufacturer}
                        invalid={formik.touched.manufacturer && Boolean(formik.errors.manufacturer)}
                        type="text"
                        name="manufacturer"
                        id="manufacturer"
                        placeholder="Enter manufacturer name"
                    />
                    {formik.touched.manufacturer && formik.errors.manufacturer ? (
                        <FormFeedback>{formik.errors.manufacturer}</FormFeedback>
                    ) : null}
                </FormGroup>

                <FormGroup>
                    <Label for="price">Price</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.price}
                        invalid={formik.touched.price && Boolean(formik.errors.price)}
                        type="number"
                        name="price"
                        id="price"
                        placeholder="Enter price"
                    />
                    {formik.touched.price && formik.errors.price ? (
                        <FormFeedback>{formik.errors.price}</FormFeedback>
                    ) : null}
                </FormGroup>

                <FormGroup>
                    <Label for="stock">Stock</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.stock}
                        invalid={formik.touched.stock && Boolean(formik.errors.stock)}
                        type="number"
                        name="stock"
                        id="stock"
                        placeholder="Enter stock quantity"
                    />
                    {formik.touched.stock && formik.errors.stock ? (
                        <FormFeedback>{formik.errors.stock}</FormFeedback>
                    ) : null}
                </FormGroup>

                <FormGroup>
                    <Label for="discount">Discount (%)</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.discount}
                        invalid={formik.touched.discount && Boolean(formik.errors.discount)}
                        type="number"
                        name="discount"
                        id="discount"
                        placeholder="Enter discount percentage"
                    />
                    {formik.touched.discount && formik.errors.discount ? (
                        <FormFeedback>{formik.errors.discount}</FormFeedback>
                    ) : null}
                </FormGroup>

                <Button type="submit" color="primary" >
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default AddProduct;
