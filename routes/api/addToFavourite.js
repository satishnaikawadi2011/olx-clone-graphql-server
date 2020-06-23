const express = require('express');

const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const SelledProduct = require('../../models/selledProduct');
const AddToFavourite = require('../../models/addToFavourite');

// @route    Post api/addToFavourite
// @desc     Buy a product
// @access   Private

router.post('/:id', auth, async (req, res) => {
	try {
		const addToFavourite = new AddToFavourite({
			customer : req.user.id,
			product  : req.params.id
		});

		// await SelledProduct.findByIdAndUpdate({ _id: req.params.id }, { isBuyed: true });
		// console.log(product);
		// console.log(typeof req.params.id);

		await addToFavourite.save();
		res.send(addToFavourite);
	} catch (e) {
		res.status(500).send('server error');
	}
});

// @route Get api/addToFavourite
// @desc  all my buyed product
// @access Private

router.get('/me', auth, async (req, res) => {
	try {
		const favourites = await AddToFavourite.find({ customer: req.user.id });
		if (!favourites) {
			return res.status(400).send('no favourites found');
		}
		res.status(200).send(favourites);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server error');
	}
});

// @route Get api/buy
// @desc  get all buyed products buy all customers
// @access Private

// router.get('/all', async (req, res) => {
// 	try {
// 		const products = await BuyProduct.find({}).populate('product').populate('customer', [
// 			'name',
// 			'avatar'
// 		]);
// 		if (!products) {
// 			return res.status(400).send('no products found');
// 		}
// 		res.status(200).send(products);
// 	} catch (err) {
// 		console.error(err.message);
// 		res.status(500).send('server error');
// 	}
// });
// module.exports = router;