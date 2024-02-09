const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true },
        name: String,
        email: String,
        phone: String,
        address: String,
    },
    { timestamps: true },
);

// Tạo model sản phẩm
const User = mongoose.model('user', userSchema);

module.exports = User;
