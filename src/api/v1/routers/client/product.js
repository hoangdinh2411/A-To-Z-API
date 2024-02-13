const express = require('express');
const ProductsControllerOnClient = require('../../controllers/client/product');
const router = express.Router();
router.get('/', ProductsControllerOnClient.getAllForClient);
router.get('/subcategory/:subcategory_id', ProductsControllerOnClient.getProductsOfSubcategory);
router.get('/:slug', ProductsControllerOnClient.getProductBySlug);

module.exports = router;
