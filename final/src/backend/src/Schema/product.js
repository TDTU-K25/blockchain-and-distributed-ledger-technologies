const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true },
        name: String,
        price: Number,
        description: String,
        userWalletId: String,
        media: String,
    },
    { timestamps: true },
);

productSchema.pre('save', function (next) {
    const currentDate = new Date().toISOString();
    this.id = `product_${uuidv4()}_${currentDate}`;
    next();
});

// Tạo model sản phẩm
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
