import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signin() {
    const navigate = useNavigate();
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [cpassword, setcpassword] = useState("")

    const AddSignin = async (e) => {
        e.preventDefault()
        const response = await fetch('http://localhost:1337/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                confirm_password: cpassword,
            })
        })
        const data = await response.json()
        if (data.status === 201) {
            navigate("/")
        }
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            if (!email) {
                toast.error('Email is required', {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            } else if (!password) {
                toast.error('Password is required', {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            } else if (!cpassword) {
                toast.error('Confirm Password is required', {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            } else if (password !== cpassword) {
                toast.error('Password and Confirm will be same', {
                    position: "bottom-right",
                    autoClose: 1000,
                });
            } else {
                AddSignin(e)
            }
        }
        }>
            <ToastContainer />
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f0f2f5"
            }}>
                <div style={{
                    textAlign: "left",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    width: "350px",
                    padding: "20px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "white"
                }}>
                    <h2 style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        color: "#333"
                    }}>Sign In</h2>
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Email:</label>
                        <input
                            type='email'
                            name="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            placeholder='Please Enter Email'
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Password:</label>
                        <input
                            type='password'
                            name="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            placeholder='Please Enter Password'
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}>Confirm Password:</label>
                        <input
                            type='password'
                            name="cpassword"
                            value={cpassword}
                            onChange={(e) => setcpassword(e.target.value)}
                            placeholder='Enter Confirm Password'
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <button type='submit' style={{
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "10px 15px",
                            cursor: "pointer"
                        }}>Submit</button>
                        <button type='button' style={{
                            backgroundColor: "yellow",
                            border: "none",
                            borderRadius: "4px",
                            padding: "10px 15px",
                            cursor: "pointer"
                        }} onClick={() => navigate("/")}>Log In</button>
                    </div>
                </div>
            </div>
        </form>

    )
}

export default Signin