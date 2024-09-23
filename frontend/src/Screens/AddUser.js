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
    FormFeedback,
    Row,
    Col
} from "reactstrap";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons
import { ServerAddress } from '../ServerAddress';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// AddUser component
const AddUser = () => {
    const storedToken = localStorage.getItem("user_token");
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location, "useLocation")
    const [isUpdate, setisUpdate] = useState(false);
    const [userId, setuserId] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            dob: "",
            gender: "",
            experience_years: "",
            application_usage: "",
            email: "",
            password: "",
            confirm_password: ""
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required('First name is required'),
            last_name: Yup.string().required('Last name is required'),
            dob: Yup.date()
                .required('Date of birth is required')
                .nullable(),
            gender: Yup.string().required('Gender is required'),
            experience_years: Yup.number()
                .required('Years of experience are required')
                .min(0, 'Experience cannot be negative')
                .typeError('Must be a number'),
            application_usage: Yup.string().required('Application usage type is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: isUpdate ? Yup.string() : Yup.string()
                .min(6, 'Password must be at least 6 characters long')
                .required('Password is required'),
            confirm_password: isUpdate ? Yup.string() : Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
        }),
        onSubmit: (values) => {
            isUpdate ? UpdateUser(values) : AddUser(values)
        },
    });

    const AddUser = async (values) => {
        try {
            const response = await fetch(ServerAddress + 'api/adduser', {
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
            if (response?.status === 201) {
                toast.success(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setTimeout(() => {
                    navigate("/user");
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

    const UpdateUser = async (values) => {
        try {
            const response = await fetch(ServerAddress + `api/updateUser/${userId}`, {
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
                    navigate("/user");
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
            let data = location.state.userData;
            setuserId(data._id)
            setisUpdate(true);
            let reversedDate = data.dob.split("T")[0]
            formik.setFieldValue("first_name", data.first_name || "");
            formik.setFieldValue("last_name", data.last_name || "");
            formik.setFieldValue("dob", reversedDate || "");
            formik.setFieldValue("gender", data.gender || "");
            formik.setFieldValue("experience_years", data.experience_years || "");
            formik.setFieldValue("application_usage", data.application_usage || "");
            formik.setFieldValue("email", data.email || "");
        } catch (error) { }
    }, []);

    return (
        <Container>
            <ToastContainer />
            <style>
                {`
                .form-group {
                    position: relative;
                }

                .eye-icon-container {
                    position: absolute;
                    right: 10px; /* Adjust as needed */
                    top: 70%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    z-index: 1; /* Ensure it is on top */
                    pointer-events: auto; /* Allow clicking the icon */
                }

                .input-with-icon {
                    padding-right: 40px; /* Add padding to the right for the icon */
                }
                `}
            </style>
            <h2>{isUpdate ? "Update User" : "Add User"}</h2>
            <Form onSubmit={formik.handleSubmit}>
                {/* First Part */}
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="first_name">First Name</Label>
                            <Input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.first_name}
                                invalid={formik.touched.first_name && Boolean(formik.errors.first_name)}
                                type="text"
                                name="first_name"
                                id="first_name"
                                placeholder="Enter first name"
                            />
                            {formik.touched.first_name && formik.errors.first_name ? (
                                <FormFeedback>{formik.errors.first_name}</FormFeedback>
                            ) : null}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="last_name">Last Name</Label>
                            <Input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.last_name}
                                invalid={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                type="text"
                                name="last_name"
                                id="last_name"
                                placeholder="Enter last name"
                            />
                            {formik.touched.last_name && formik.errors.last_name ? (
                                <FormFeedback>{formik.errors.last_name}</FormFeedback>
                            ) : null}
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                invalid={formik.touched.email && Boolean(formik.errors.email)}
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <FormFeedback>{formik.errors.email}</FormFeedback>
                            ) : null}
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="dob">Date of Birth</Label>
                            <Input
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.dob}
                                invalid={formik.touched.dob && Boolean(formik.errors.dob)}
                                type="date"
                                name="dob"
                                id="dob"
                            />
                            {formik.touched.dob && formik.errors.dob ? (
                                <FormFeedback>{formik.errors.dob}</FormFeedback>
                            ) : null}
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label for="gender">Gender</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        invalid={formik.touched.gender && Boolean(formik.errors.gender)}
                        type="select"
                        name="gender"
                        id="gender"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </Input>
                    {formik.touched.gender && formik.errors.gender ? (
                        <FormFeedback>{formik.errors.gender}</FormFeedback>
                    ) : null}
                </FormGroup>
                <FormGroup>
                    <Label for="experience_years">Years of Experience</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.experience_years}
                        invalid={formik.touched.experience_years && Boolean(formik.errors.experience_years)}
                        type="number"
                        name="experience_years"
                        id="experience_years"
                        placeholder="Enter years of experience"
                    />
                    {formik.touched.experience_years && formik.errors.experience_years ? (
                        <FormFeedback>{formik.errors.experience_years}</FormFeedback>
                    ) : null}
                </FormGroup>

                {/* Second Part */}
                {!isUpdate &&
                    <Row>
                        <Col md={6}>
                            <FormGroup className="form-group">
                                <Label for="password">Password</Label>
                                <Input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    invalid={formik.touched.password && Boolean(formik.errors.password)}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    className="input-with-icon"
                                />
                                {!formik.errors.password &&
                                    <div
                                        className="eye-icon-container"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                }
                                {formik.touched.password && formik.errors.password ? (
                                    <FormFeedback>{formik.errors.password}</FormFeedback>
                                ) : null}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup className="form-group">
                                <Label for="confirm_password">Confirm Password</Label>
                                <Input
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirm_password}
                                    invalid={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    id="confirm_password"
                                    placeholder="Confirm your password"
                                    className="input-with-icon"
                                />
                                {!formik.errors.confirm_password &&
                                    <div
                                        className="eye-icon-container"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                }
                                {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                    <FormFeedback>{formik.errors.confirm_password}</FormFeedback>
                                ) : null}
                            </FormGroup>
                        </Col>
                    </Row>
                }

                <FormGroup>
                    <Label for="application_usage">Application Usage Type</Label>
                    <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.application_usage}
                        invalid={formik.touched.application_usage && Boolean(formik.errors.application_usage)}
                        type="select"
                        name="application_usage"
                        id="application_usage"
                    >
                        <option value="">Select application usage type</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SALES EXECUTIVE">Sales Executive</option>
                        <option value="NORMAL USER">Normal User</option>
                    </Input>
                    {formik.touched.application_usage && formik.errors.application_usage ? (
                        <FormFeedback>{formik.errors.application_usage}</FormFeedback>
                    ) : null}
                </FormGroup>

                <Button type="submit" color="primary">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default AddUser;
