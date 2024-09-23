import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { ServerAddress } from '../ServerAddress';
import { FaCartShopping } from "react-icons/fa6";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Img from '../Screens/Img.jpg'; 

const AddItem = () => {
    const navigate = useNavigate();
    const storedToken = localStorage.getItem("user_token");
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); // To store added products
    console.log("cart,", Object.values(cart))
    const formik = useFormik({
        initialValues: {
            customerName: '',
            customerNo: ''
        },
        validationSchema: Yup.object({
            customerName: Yup.string().required('Customer name is required'),
            customerNo: Yup.string()
                .required('Customer number is required')
                .matches(/^[0-9]+$/, 'Customer number must be digits')
        }),
        onSubmit: (values) => {
        AddOrder(values)
        },
    })
    const GetAllProducts = async () => {
        try {
            const response = await fetch(ServerAddress + 'api/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': storedToken, // Include your JWT token for authentication
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Fetched users:", data);
                if (data.length > 0) {
                    setProducts(data)
                } else {
                    setProducts([])
                }
            } else {
                toast.error(data.message || 'Failed to fetch users', {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while fetching users', {
                position: "bottom-right",
                autoClose: 1000,
            });
        }
    };

    const AddOrder = async (values) => {
        try {
            const orderData = {
                customerName: values.customerName,
                customerNo: values.customerNo,
                items: Object.values(cart), // Include cart items
            };
    
            const response = await fetch(ServerAddress + 'api/addOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': storedToken,
                },
                body: JSON.stringify(orderData), // Send combined data
            });
    
            const data = await response.json();
            if (response?.status === 201) {
                toggleModal();
                toast.success(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                setTimeout(() => {
                    navigate("/order");
                }, 1000);
            } else {
                toast.error(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            }
            console.log("data----", data);
    
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    useEffect(() => {
        GetAllProducts()
    }, []);

    const handleAdd = (product) => {
        setCart((prev) => {
            const existingProduct = prev[product._id];

            if (existingProduct) {
                // If the product already exists, increment the count
                return {
                    ...prev,
                    [product._id]: {
                        ...existingProduct,
                        count: existingProduct.count + 1, // Increment the count
                    },
                };
            } else {
                // If the product does not exist, add it with a count of 1
                return {
                    ...prev,
                    [product._id]: {
                        ...product,
                        count: 1, // Initialize the count to 1
                    },
                };
            }
        });
    };


    const handleRemove = (productId) => {
        setCart((prev) => {
            const newCart = { ...prev };
            delete newCart[productId];
            return newCart;
        });
    };

    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => setModalOpen(!modalOpen);


    const handleAddCount = (productId) => {
        setCart((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                count: (prev[productId]?.count || 0) + 1, // Increment count
            },
        }));
    };

    const handleRemoveCount = (productId) => {
        setCart((prev) => {
            const existingProduct = prev[productId];

            if (existingProduct.count > 1) {
                return {
                    ...prev,
                    [productId]: {
                        ...existingProduct,
                        count: existingProduct.count - 1, // Decrement count
                    },
                };
            } else {
                const { [productId]: removedItem, ...newCart } = prev;
                return newCart; // Remove product if count is 1
            }
        });
    };
    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <ToastContainer />
            <Modal isOpen={modalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Product List</ModalHeader>
            <ModalBody>
                {Object.keys(cart).length === 0 ? (
                    <p>No products in the cart.</p>
                ) : (
                    Object.entries(cart).map(([_id, { productName, price, count }]) => (
                        <div key={_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div>
                                <strong>{productName}</strong> - ${price.toFixed(2)} (Count: {count})
                            </div>
                            <div>
                                <Button color="light" onClick={() => handleRemoveCount(_id)}>
                                    <FaMinus />
                                </Button>
                                <Button color="light" onClick={() => handleAddCount(_id)}>
                                    <FaPlus />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
                <FormGroup>
                    <Label for="customerName">Customer Name</Label>
                    <Input
                        id="customerName"
                        name="customerName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.customerName}
                        invalid={formik.touched.customerName && Boolean(formik.errors.customerName)}
                    />
                      {formik.touched.customerName && formik.errors.customerName ? (
                                <FormFeedback>{formik.errors.customerName}</FormFeedback>
                            ) : null}
                </FormGroup>
                <FormGroup>
                    <Label for="customerNo">Customer Number</Label>
                    <Input
                        id="customerNo"
                        name="customerNo"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.customerNo}
                        invalid={formik.touched.customerNo && Boolean(formik.errors.customerNo)}
                    />
                      {formik.touched.customerNo && formik.errors.customerNo ? (
                                <FormFeedback>{formik.errors.customerNo}</FormFeedback>
                            ) : null}
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={formik.handleSubmit}>Save</Button>
            </ModalFooter>
        </Modal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Product List</h2>
                <div style={{ position: 'relative', cursor: "pointer" }} onClick={()=> {Object.values(cart).length > 0 && toggleModal()}}>
                    <FaCartShopping size={22} />
                    {/* Badge for item count */}
                    <span style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-10px',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                    }}>
                        {Object.keys(cart).length}
                    </span>
                </div>

                {/* <button
                    onClick={handleAddUser}
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                >
                    View all
                </button> */}
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px',
            }}>
                {products.map(product => (
                    <div key={product.id} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}>
                        <img src={Img} alt={product.productName} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                        <h3 style={{ margin: '10px 0', fontSize: '18px', color: '#3498db' }}>{product.productName}</h3>
                        <p style={{ margin: '5px 0', color: '#e67e22' }}>Discount: {product.discount}</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Price: {product.price}</p>
                        <p style={{ margin: '5px 0', color: '#2ecc71' }}>Stock: {product.stock}</p>
                        <div>
                            <button
                                onClick={() => handleAdd(product)}
                                style={{
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 15px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    marginRight: '5px',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                    fontSize: '10px', 
                                }}
                            >
                                Add
                            </button>
                            <button
                                onClick={() => handleRemove(product._id)}
                                style={{
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 15px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                    fontSize: '10px', 
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddItem;
