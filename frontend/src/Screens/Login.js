import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ServerAddress } from '../ServerAddress';

function Login() {
    const navigate = useNavigate();
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [token, settoken] = useState("")

    const Login = async (e) => {
        e.preventDefault()
        const response = await fetch(ServerAddress + `api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            })
        })
        const data = await response.json()
        console.log("data==", data)
        if (data.status === 200) {
            localStorage.setItem("user_token", data.token)
            localStorage.setItem("user_type", data.application_usage)
            settoken(data.token)
        } else {
            toast.error('Please enter valid Username and Password', {
                position: "bottom-right",
                autoClose: 1000,
            });
        }
    }

    useEffect(() => {
        if (token) {
            navigate("/addorder")
            window.location.reload()
        }
    }, [token])

    return (
        <>
            <ToastContainer />
            <form onSubmit={(e) => {
                e.preventDefault()
                if(!email && !password){
                    toast.error('Please enter valid Email and Password', {
                        position: "bottom-right",
                        autoClose: 1000,
                    });
                } else{
                    Login(e)
                }
            }
            }>
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
                        }}>Login</h2>
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
                            }} onClick={() => navigate("./signin")}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Login