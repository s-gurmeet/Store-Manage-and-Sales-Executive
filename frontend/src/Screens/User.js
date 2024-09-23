import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ServerAddress } from '../ServerAddress';
import { MdDeleteForever } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = () => {
    const navigate = useNavigate();
    const storedToken = localStorage.getItem("user_token");
    const [users, setUsers] = useState([]);

    const GetAllUsers = async () => {
        try {
            const response = await fetch(ServerAddress + 'api/users', {
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
                    setUsers(data)
                } else {
                    setUsers([])
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

    const DeleteUser = async (id) => {
        try {
            const response = await fetch(ServerAddress + `api/deleteUser/${id}`, {
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
                GetAllUsers()
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
        GetAllUsers()
    }, []);

    const handleAddUser = () => {
        navigate("/adduser");
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <ToastContainer />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>User Details</h2>
                <button
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
                    Add User
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
                            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>First Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Last Name</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Date of Birth</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Gender</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Experience</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} style={{ backgroundColor: '#fff', transition: 'background-color 0.3s' }}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{index + 1}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <Link
                                        to={{
                                            pathname: `/adduser`,
                                        }}
                                        state={{ userData: user }}
                                    >
                                        {user.email}
                                    </Link>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.first_name ?? "-"}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.last_name ?? "-"}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user?.dob?.split("T")[0] ?? "-"}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.gender ?? "-"}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.experience_years}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <div
                                        onClick={() => {
                                            DeleteUser(user._id);
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

export default User;
