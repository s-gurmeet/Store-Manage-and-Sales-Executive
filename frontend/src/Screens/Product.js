import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServerAddress } from '../ServerAddress';
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
    const navigate = useNavigate();
    const storedToken = localStorage.getItem("user_token");
    const [products, setProducts] = useState([]);

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
    const DeleteProduct = async (id) => {
        try {
            const response = await fetch(ServerAddress + `api/deleteProduct/${id}`, {
                method: 'DELETE', // Use DELETE method
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': storedToken,
                },
            });

            const data = await response.json();
            if (response?.status === 200) {
                toast.success(data.status, {
                    position: "bottom-right",
                    autoClose: 1000,
                });
                GetAllProducts()
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
        GetAllProducts()
    }, []);

    const handleAddProduct = () => {
        navigate("/addproduct");
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <ToastContainer />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Product List</h2>
                <button
                    onClick={handleAddProduct}
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
                    Add Product
                </button>
            </div>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '20px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                borderRadius: '5px',
                overflow: 'hidden'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Sl No.</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Product Name</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Manufacturer</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Discount (%)</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id} style={{ backgroundColor: '#fff', transition: 'background-color 0.3s' }}>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{index + 1}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <Link
                                        to={{
                                            pathname: `/addproduct`,
                                        }}
                                        state={{ productData: product }}
                                    >
                                        {product.productName}
                                    </Link>
                                </td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.manufacturer}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>${product.price.toFixed(2)}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.stock}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.discount}</td>
                            <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                <div
                                    onClick={() => {
                                        DeleteProduct(product._id);
                                    }}
                                >
                                    <MdDeleteForever
                                        style={{
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            color: "red",
                                        }}
                                        size={22}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Product;