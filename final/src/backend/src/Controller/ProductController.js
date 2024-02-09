const Product = require('../Schema/product');

class ProductController {
    // Định nghĩa route để lấy thông tin sản phẩm
    async getAllProductByWalletId(req, res) {
        const { userWalletId } = req.params;
        try {
            const products = await Product.find({ userWalletId });

            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found for the specified userWalletId.' });
            }

            res.json({
                data: products,
                message: 'Get all products for the specified userWalletId',
                code: 200,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addProduct(req, res) {
        const { name, price, description, userWalletId, media } = req.body;
        try {
            const product = new Product({ name, price, description, userWalletId, media });
            const newProduct = await product.save();
            res.status(201).json({
                data: newProduct,
                code: 200,
                message: 'Add new product successfully!',
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // Define the route to update a product by ID
    async editProduct(req, res) {
        const { name, price, description, userWalletId, media, id } = req.body;
        const { productId } = req.params;

        try {
            // Find the existing product by its ID
            const existingProduct = await Product.findOne({ id: productId });

            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found.' });
            }
            // Update the existing product with new values
            existingProduct.name = name;
            existingProduct.price = price;
            existingProduct.description = description;
            existingProduct.userWalletId = userWalletId;
            existingProduct.media = media;
            existingProduct.id = id;

            // Save the updated product
            const updatedProduct = await existingProduct.save();

            res.status(200).json({
                data: updatedProduct,
                code: 200,
                message: 'Product updated successfully!',
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Define the route to get details of a product by ID
    async getDetailProduct(req, res) {
        const { productId } = req.params;
        try {
            const existingProduct = await Product.findOne({ id: productId });

            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found.' });
            }
            // Return the details of the existing product
            res.status(200).json({
                data: existingProduct,
                code: 200,
                message: 'Product details retrieved successfully!',
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deleteProductByID(req, res) {
        const { productId } = req.params;
        try {
            const existingProduct = await Product.findOne({ id: productId });

            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            // Delete the product
            await Product.deleteOne({ id: productId });

            res.status(200).json({
                code: 200,
                message: 'Product deleted successfully!',
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
