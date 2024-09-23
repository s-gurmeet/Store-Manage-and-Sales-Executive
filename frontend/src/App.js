// import React from "react"
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Login from "./Screens/Login";
// import Signin from "./Screens/Signin";
// import Home from "./Screens/Home";
// import Inventory from "./Screens/Inventory";
// import AddInventory from "./Screens/AddInventory";

// const App = () => {
//     return <div style={{textAlign:"center"}}>
//              <BrowserRouter>
//                 <Routes>
//                     <Route path="/" element={<Login />} />
//                     <Route path="/signin" element={<Signin />} />
//                     <Route path="/home" element={<Home />} />
//                     <Route path="/order" element={<Inventory />} />
//                     <Route path="/manifest" element={<AddInventory />} />
//                 </Routes>
//             </BrowserRouter>
//     </div>
// }

// export default App;
import React, {useState, useEffect} from 'react';

import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import { Suspense } from 'react';
import Home from './Screens/Home';
import { auth_routs, routes } from "./routes";

function App() {
    const storedToken = localStorage.getItem("user_token");
    const [token, settoken] = useState("")
    useEffect(() => {
        if (storedToken) {
            settoken(storedToken)
        }
    }, [storedToken])

    console.log("token==", token)
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={() => <div>Loading...</div>}>
                    <Routes>
                        {token ?
                            <Route
                                path="/"
                                element={
                                    <Home />
                                }
                            >
                                {routes.map((item, index) => {
                                    return (
                                        <Route
                                            path={item.path}
                                            name={item.name}
                                            element={item.element}
                                            key={index}
                                        />
                                    );
                                })}
                            </Route>
                            :
                            <>
                                {auth_routs.map((item, index) => {
                                    return (
                                        <Route
                                            path={item.path}
                                            name={item.name}
                                            element={item.element}
                                            key={index}
                                        />
                                    );
                                })}
                            </>
                        }
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
}

export default App;