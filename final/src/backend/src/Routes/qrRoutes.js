// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../Schema/product');
const QRCode = require('qrcode');

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const existingProduct = await Product.find({ id: productId });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let qr = await QRCode.toDataURL(`https://blockchain-final-frontend.vercel.app/items/detail?id=${productId}`);
        res.status(200).json({
            data: qr,
            code: 200,
            message: 'Create QR successfully!',
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
