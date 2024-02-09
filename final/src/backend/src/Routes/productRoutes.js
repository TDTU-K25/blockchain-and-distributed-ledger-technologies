// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../Controller/ProductController');

router.get('/all/:userWalletId', ProductController.getAllProductByWalletId);
router.post('/add', ProductController.addProduct);
router.put('/edit/:productId', ProductController.editProduct);
router.delete('/delete/:productId', ProductController.deleteProductByID);
router.get('/:productId', ProductController.getDetailProduct);

module.exports = router;
