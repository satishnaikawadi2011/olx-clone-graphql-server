const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const SelledProduct = require('../../models/selledProduct');
const BuyProduct = require('../../models/buyProduct');

// @route    Post api/buy
// @desc     Buy a product
// @access   Private

router.post('/:id', auth, async (req, res) => {
	try {
		const buyedProduct = new BuyProduct({
			...req.body,
			customer : req.user.id,
			product  : req.params.id
		});

		await SelledProduct.findByIdAndUpdate({ _id: req.params.id }, { isBuyed: true });
		// console.log(product);
		await buyedProduct.save();
		res.send(buyedProduct);
	} catch (e) {
		res.status(500).send('server error');
	}
});

// @route Get api/buy
// @desc  all my buyed product
// @access Private

router.get('/me', auth, async (req, res) => {
	try {
		const products = await BuyProduct.find({ customer: req.user.id }).populate('product').populate('customer', [
			'name',
			'avatar'
		]);
		if (!products) {
			return res.status(400).send('no products found');
		}
		res.status(200).send(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route Get api/buy
// @desc  get all buyed products buy all customers
// @access Private

router.get('/all', async (req, res) => {
	try {
		const products = await BuyProduct.find({}).populate('product').populate('customer', [
			'name',
			'avatar'
		]);
		if (!products) {
			return res.status(400).send('no products found');
		}
		res.status(200).send(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});
module.exports = router;
