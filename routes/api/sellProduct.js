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
// @route    GET api/products/me
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
// @route POST image
// @desc  uploading product image
// @access Priate
// router.post(
// 	'/upload',
// 	[
// 		auth,
// 		upload.single('image')
// 	],
// 	async (req, res) => {
// 		try {
// 			const user = req.user;
// 			user.avatar = req.file.buffer;
// 			await user.save();
// 			await res.send();
// 		} catch (err) {
// 			console.error(err.message);
// 			res.status(400).send('server error');
// 		}
// 	},
// 	(error, req, res, next) => {
// 		res.status(400).send({ error: error.message });
// 	}
// );
router.post(
	'/upload',
	auth,
	upload.single('image'),
	async (req, res) => {
		const user = User.find({ id: req.user.id });
		user.avatar = req.file.buffer;
		await user.save();
		res.send();
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

// @route    POST api/product
// @desc     Create or update user profile
// @access   Private

router.post(
	'/',
	[
		auth,

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

		const productData = { ...req.body, owner: req.user.id };

		try {
			const product = new SelledProduct(productData);

			await product.save();
			res.json(product);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
