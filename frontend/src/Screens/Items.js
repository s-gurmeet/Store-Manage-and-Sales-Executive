import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ServerAddress } from '../ServerAddress';

const Item = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("user_token");
  const [orders, setOrders] = useState([]);


  const GetAllOrders = async () => {
    try {
        const response = await fetch(ServerAddress + 'api/orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': storedToken, // Include your JWT token for authentication
            },
        });

        const data = await response.json();
        console.log("data pr=", data)
        if (response.ok) {
            if (data.length > 0) {
                setOrders(data)
            } else {
                setOrders([])
            }
        } else {
            toast.error(data.message || 'Failed to fetch order', {
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
const DeleteOrder = async (id) => {
  try {
      const response = await fetch(ServerAddress + `api/deleteOrder/${id}`, {
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
          GetAllOrders()
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
  GetAllOrders()
}, []);

  const handleAddOrder = () => {
    navigate("/addorder");
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Order List</h2>
        <button 
          onClick={handleAddOrder}
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
          Add Order
        </button>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
              <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Customer Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Customer No</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Products</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Purchase Quantity</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Total Amount</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} style={{ backgroundColor: '#fff', transition: 'background-color 0.3s' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{index+1}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.orderId}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.customerName}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.contactNo}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.product}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.purchaseQuantity}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.totalAmount}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                <div
                                    onClick={() => {
                                        DeleteOrder(order.orderId);
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
    </div>
  );
};

export default Item;
