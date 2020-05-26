const express = require('express');

const multer = require('multer');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
// const checkObjectId = require('../../middleware/checkObjectId');

const User = require('../../models/User');
const SelledProduct = require('../../models/selledProduct');
// @route    GET api/products
// @desc     Get current users all products
// @access   Private
router.get('/me', auth, async (req, res) => {
	try {
		const products = await SelledProduct.find({
			owner : req.user.id
		}).populate('owner', [
			'name',
			'avatar'
		]);

		if (!products) {
			return res.status(400).json({ msg: 'There are no products sold by this user' });
		}

		res.json(products);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// multer middleware
const upload = multer({
	limits     : {
		fileSize : 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload an image'));
		}

		cb(undefined, true);
	}
});

// @route    POST api/product
// @desc     Create  user profile
// @access   Private

router.post(
	'/',
	[
		auth,
		upload.single('image'),
		[
			check('category', 'Category is required').not().isEmpty(),
			check('brand', 'brand is required').not().isEmpty(),
			check('model', 'model is required').not().isEmpty(),
			check('title', 'title is required').not().isEmpty(),
			check('description', 'description is required').not().isEmpty(),
			check('price', 'price is required').not().isEmpty()

			// check('image', 'image is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			if (req.file) {
				const image = await req.file.buffer;

				const productData = { ...req.body, owner: req.user.id, image };
				const product = new SelledProduct(productData);
				await product.save();
				res.json(product);
			}
			else {
				const productData = { ...req.body, owner: req.user.id };
				const product = new SelledProduct(productData);
				await product.save();
				res.json(product);
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route  Get api/product
// @desc   get all products
// @access Public

router.get('/', async (req, res) => {
	try {
		const products = await SelledProduct.find({}).populate('owner', 'name');
		await res.status(200).send(products);
	} catch (e) {
		res.status(400).send(e);
	}
});

// @route Patch api/product
// @desc  update selling price of product
// @access Private

router.patch('/me/:id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		'price'
	];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		const product = await SelledProduct.findOne({ _id: req.params.id, owner: req.user.id });

		if (!product) {
			return res.status(404).send();
		}

		updates.forEach((update) => (product[update] = req.body[update]));
		await product.save();
		res.send(product);
	} catch (e) {
		res.status(400).send(e);
	}
});

// @route Delete api/product
// @desc  delete any product
// @access Private

router.delete('/me/:id', auth, async (req, res) => {
	try {
		const product = await SelledProduct.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

		if (!product) {
			res.status(404).send();
		}

		res.send(product);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
