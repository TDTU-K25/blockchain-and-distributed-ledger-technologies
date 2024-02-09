const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const qrRoutes = require('./qrRoutes');
const userRoutes = require('./userRoutes');

// Sử dụng các routes
router.use('/v1/product', productRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/qr', qrRoutes);

module.exports = router;
