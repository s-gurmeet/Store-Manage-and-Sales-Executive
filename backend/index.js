// To run the server "nodemon index.js"
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { UserModel, ProductModel, OrderModel } = require('./models/studentModel')

app.use(cors())
app.use(express.json()); //middleware

mongoose.connect('mongodb://localhost:27017/product_details')

//JWT Authentication 
const authenticateJWT = (req, res, next) => {
    console.log("req.headers:", req.headers)
    const token = req.headers['authorization'];

    console.log("token===", token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) {
            console.log("err==", err)
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = user;
        next();
    });
};

//Register User
app.post('/api/register', async (req, res) => {
    const data = req.body
    console.log("register data=01=", data)
    try {
        const users = await UserModel.find({}, '-password -confirm_password').sort({ createdAt: -1 }); // Exclude password fields and sort by creation date

        let application_usage;
        if (users.length === 0) {
            application_usage = "ADMIN";
        } else {
            application_usage ="NORMAL USER"
        }

        const salt = await bcrypt.genSalt(10);
        const spassword = await bcrypt.hash(data.password, salt);
        const sconfirm_password = await bcrypt.hash(data.confirm_password, salt);
        console.log("spassword====", spassword)
        await UserModel.create({
            username: data.username,
            email: data.email,
            password: spassword,
            confirm_password: sconfirm_password,
            application_usage: application_usage
        })
        res.json({ status: 201 })
    } catch {
        res.json({ status: 'duplicate email' })
    }
})

//Login User
app.post('/api/login', async (req, res) => {
    console.log("register data==", req.body)
    try {
        const user_data = await UserModel.findOne({
            email: req.body.email,
            // password: req.body.password,
        })
        console.log("user_data=", user_data)
        if (!user_data) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(req.body.password, user_data.password);

        // If the password is not valid, send an error response
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user_data) {
            const token = jwt.sign({
                first_name: user_data.first_name,
                email: user_data.email,
            }, 'secretkey')
            // }, 'secretkey', {expiresIn:'2h'})
            return res.json({ status: 200, token: token, id: user_data.id, email: user_data.email, application_usage: user_data.application_usage })
        } else {
            return res.json({ status: 'error', user: false })
        }
    } catch {
        return res.json({ status: 'error', user: false })
    }

})

//User
app.get('/api/users', authenticateJWT, async (req, res) => {
    try {
        // You can access the authenticated user data from req.user if needed
        const authenticated = req.user;
        const authenticatedUser = await UserModel.findOne({ email: authenticated.email });

        console.log("authenticatedUser",  authenticatedUser.application_usage);

        let users;

        // Check the application_usage of the authenticated user
        if (authenticatedUser.application_usage === "NORMAL USER" || authenticatedUser.application_usage === "SALES EXECUTIVE") {
            // Fetch users created by the authenticated user
            users = await UserModel.find({ email: authenticatedUser.email }, '-password -confirm_password');
        } else {
            // Fetch all users for other users
            users = await UserModel.find({}, '-password -confirm_password');
        }

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/adduser', authenticateJWT, async (req, res) => {
    try {
        // You can access the authenticated user data from req.user
        const data = req.body
        const salt = await bcrypt.genSalt(10);
        const spassword = await bcrypt.hash(data.password, salt);
        const sconfirm_password = await bcrypt.hash(data.confirm_password, salt);
        console.log("data", data)
        try {
            await UserModel.create({
                first_name: data.first_name,
                last_name: data.last_name,
                dob: data.dob,
                gender: data.gender,
                experience_years: data.experience_years,
                application_usage: data.application_usage.toUpperCase(),
                email: data.email,
                password: spassword,
                confirm_password: sconfirm_password
            })
            res.status(201).json({ status: 'User added successfully' });
        } catch {
            res.json({ status: 'Duplicate email' })
        }

    } catch (error) {
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});

app.put('/api/updateUser/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params; // Get user ID from URL
    const data = req.body;
    console.log("data u==", data)
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(id, {
            first_name: data.first_name,
            last_name: data.last_name,
            dob: data.dob,
            gender: data.gender,
            experience_years: data.experience_years,
            application_usage: data.application_usage.toUpperCase(),
            email: data.email,
        }, { new: true }); // Return the updated document

        if (!updatedUser) {
            return res.status(404).json({ status: 'User not found' });
        }

        res.status(200).json({ status: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});

app.delete('/api/deleteUser/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params; // Get user ID from URL

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ status: 'User not found' });
        }

        res.status(200).json({ status: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});

// Products
app.get('/api/products', authenticateJWT, async (req, res) => {
    try {
        // You can access the authenticated user data from req.user if needed
        const authenticatedUser = req.user;
        console.log("authenticatedUser", authenticatedUser);

        // Fetch all users from the database
        const users = await ProductModel.find({}, '-password -confirm_password'); // Exclude password fields

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/addProduct', authenticateJWT, async (req, res) => {
    try {
        const authenticatedUser = req.user;
        const data = req.body;
        console.log("authenticatedUser==", authenticatedUser)
        console.log("authenticatedUser==", authenticatedUser.email)
        try {
            await ProductModel.create({
                productName: data.productName,
                manufacturer: data.manufacturer,
                price: data.price,
                stock: data.stock,
                discount: data.discount,
                created_by: authenticatedUser.email,
            });
            res.status(201).json({ status: 'Product added successfully' });
        } catch (err) {
            console.error('Error creating product:', err);
            res.status(400).json({ status: 'Something Went Wrong', error: err.message });
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/api/updateProduct/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params; // Get product ID from URL
    const data = req.body;

    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
            productName: data.productName,
            manufacturer: data.manufacturer,
            price: data.price,
            stock: data.stock,
            discount: data.discount,
            modified_by: req.user.email,
            modified_at: Date.now()
        }, { new: true }); // Return the updated document

        if (!updatedProduct) {
            return res.status(404).json({ status: 'Product not found' });
        }

        res.status(200).json({ status: 'Product updated successfully', product: updatedProduct });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});

app.delete('/api/deleteProduct/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params; // Get product ID from URL

    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'Product not found' });
        }

        res.status(200).json({ status: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});

//Order
const { v4: uuidv4 } = require('uuid'); // Make sure to install uuid package

app.post('/api/addOrder', authenticateJWT, async (req, res) => {
    const authenticatedUser = req.user;
    console.log("authenticatedUser==", authenticatedUser.email)
    const { customerName, customerNo, items } = req.body; // Destructure the incoming data
    console.log("authenticatedUser==", authenticatedUser)
    try {
        const orders = []; // Array to hold created orders

        for (const item of items) {
            console.log("item", item)
            const newOrder = new OrderModel({
                orderId: uuidv4(), // Generate a unique order ID
                customerName: customerName, // Use the customerName from request body
                contactNo: customerNo, // Use the customerNo from request body
                product: item._id, // Assuming item contains the product ID
                purchaseQuantity: item.count,
                totalAmount: item.price * item.count,
                created_by: authenticatedUser.email,
            });

            await newOrder.save();
            orders.push(newOrder); // Add the order to the orders array
        }

        res.status(201).json({ status: 'Orders added successfully', orders });
    } catch (err) {
        console.error('Error adding orders:', err);
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});

app.get('/api/orders', authenticateJWT, async (req, res) => {
    try {
        const authenticated = req.user;
        const authenticatedUser = await UserModel.findOne({ email: authenticated.email });

        console.log("authenticatedUser",  authenticatedUser.application_usage);

        let orders;

        // Check the application_usage of the authenticated user
        if (authenticatedUser.application_usage === "NORMAL USER" || authenticatedUser.application_usage === "SALES EXECUTIVE") {
            // Fetch orders created by the authenticated user
            orders = await OrderModel.find({ created_by: authenticatedUser.email }, '-password -confirm_password');
        } else {
            // Fetch all orders for other users
            orders = await OrderModel.find({}, '-password -confirm_password');
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.delete('/api/deleteOrder/:orderId', authenticateJWT, async (req, res) => {
    const { orderId } = req.params; // Get order ID from URL

    try {
        const deletedOrder = await OrderModel.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({ status: 'Order not found' });
        }

        res.status(200).json({ status: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(400).json({ status: 'Something Went Wrong', error: err.message });
    }
});


app.listen(1337, () => {
    console.log("Server started an 1338")
})