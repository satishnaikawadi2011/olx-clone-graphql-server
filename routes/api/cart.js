const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const SelledProduct = require('../../models/selledProduct');
const BuyProduct = require('../../models/buyProduct');

// @route Post api/cart
// @desc  add product to cart
// @access Private

router.post('/add/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(400).send('user not found');
		}
		const product = { product: req.params.id };
		user.cart = [
			...user.cart,
			product
		];
		await user.save();
		res.status(200).send();
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route   Get api/cart
// @desc    get all products in cart
// @access  private

router.get('/me', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate('cart.product');
		if (!user) {
			res.status(400).send('user not found');
		}

		res.status(200).send(user.cart);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route  Patch api/cart/remove
// @desc   remove product from cart
// @access Private

router.patch('/remove/:id', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			res.status(400).send('user not found');
		}

		const cart = user.cart.filter((Product) => Product.product != req.params.id);

		user.cart = [
			...cart
		];
		await user.save();
		res.status(200).send(user.cart);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route  Patch api/cart
// @desc   remove all products from cart
// @access Private

router.patch('/clear', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			res.status(400).send('user not found');
		}

		user.cart = [];

		await user.save();
		res.status(200).send(user.cart);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

module.exports = router;
