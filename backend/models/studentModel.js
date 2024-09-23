const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    dob: { type: Date },
    gender: { type: String },
    experience_years: { type: Number, min: 0, default: 0},
    application_usage: { type: String, required: true, default:"NORMAL USER" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirm_password: { type: String, required: true }, // Usually not stored in DB
    created_at: { type: Date, default: Date.now },
}, {
    collection: 'UserData',
    collation: { locale: 'en', strength: 2 } // Example collation for English, case-insensitive
});

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    manufacturer: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // Ensuring price cannot be negative
    stock: { type: Number, required: true, min: 0 }, // Ensuring stock cannot be negative
    discount: { type: Number, min: 0, max: 100, default: 0 }, // Discount can be between 0 and 100
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: null },
    modified_at: { type: Date, default: null },
    modified_by: { type: String, default: null },
}, {
    collection: 'ProductData',
    timestamps: true // Optional: adds createdAt and updatedAt fields
});

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true }, // Unique identifier for the order
    customerName: { type: String, required: true },
    contactNo: { type: String, required: true }, // Assuming a string for flexibility (e.g., including formatting)
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product schema
    purchaseQuantity: { type: Number, required: true, min: 1 }, // Must be at least 1
    totalAmount: { type: Number, required: true, min: 0 }, // Total amount should be non-negative
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, default: null },
}, {
    collection: 'OrderData',
    timestamps: true // Optional: adds createdAt and updatedAt fields
});

const UserModel = mongoose.model("UserData", UserSchema);
const ProductModel = mongoose.model("ProductData", ProductSchema);
const OrderModel = mongoose.model("OrderData", OrderSchema);

module.exports = { UserModel, ProductModel, OrderModel };
