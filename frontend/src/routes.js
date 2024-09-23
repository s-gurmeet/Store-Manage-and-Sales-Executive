import React from "react";
const Login = React.lazy(() => import("./Screens/Login"));
const Signin = React.lazy(() => import("./Screens/Signin"));
const AddUser = React.lazy(() => import("./Screens/AddUser"));
const User = React.lazy(() => import("./Screens/User"));
const Product = React.lazy(() => import("./Screens/Product"));
const AddProduct = React.lazy(() => import("./Screens/AddProduct"));
const AddItem = React.lazy(() => import("./Screens/AddItem"));
const Item = React.lazy(() => import("./Screens/Items"));

const auth_routs =[
  {
    path: "/",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/signin",
    name: "Signin",
    element: <Signin />,
  } 
]

const routes = [
  {
    path: "/product",
    name:"Product",
    element: <Product />,
  },
  {
    path: "/addproduct",
    name: "AddProduct",
    element: <AddProduct />,
  },
  {
    path: "/adduser",
    name: "AddUser",
    element: <AddUser/>,
  },
  {
    path: "/user",
    name: "User",
    element: <User/>,
  },
  {
    path: "/addorder",
    name: "Add Order",
    element: <AddItem/>,
  },
  {
    path: "/order",
    name: "Order",
    element: <Item/>,
  },
 
];

export { routes, auth_routs };
