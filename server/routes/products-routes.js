const express = require('express');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');
const productControllers = require('../controllers/product-controllers');
const { route } = require('./users-routes');

const router = express.Router();

// @route  Get api/products
// @desc   get products by user id
// @access Private
router.get('/me', auth, productControllers.getProductsByUserId);

// @route  api/products
// @desc   get a product by its id
// @access Private
router.get('/:pid', auth, productControllers.getProductById);

// @route  api/products
// @desc   create a new product
// @access Private
router.post(
	'/',
	auth,
	[
		check('title').not().isEmpty().isLength({ min: 300 }),
		check('description').isLength({ min: 650 }).not().isEmpty(),
		check('state').not().isEmpty(),
		check('city').not().isEmpty(),
		check('locality').not().isEmpty(),
		check('zip').isInt().not().isEmpty(),
		check('model').not().isEmpty(),
		check('brand').not().isEmpty(),
		check('contact').not().isEmpty(),
		check('price').not().isEmpty().isInt(),
		check('category').not().isEmpty()
	],
	productControllers.createProduct
);

// @route  Get api/products
// @desc   get all available products
// @access Public
router.get('/', productControllers.getProducts);

// @route  api/products
// @desc   update a product by its id
// @access Private
router.patch('/:pid', auth, productControllers.updateProductById);

// @route  Delete api/products
// @desc   delete product by its id
// @access Private
router.delete('/:pid', auth, productControllers.removeProductById);

module.exports = router;
