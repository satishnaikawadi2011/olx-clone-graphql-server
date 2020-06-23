const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');
const auth = require('../../middleware/auth');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
	'/',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({
					errors : [
						{ msg: 'User already exists' }
					]
				});
			}

			user = new User({
				name,
				email,
				password
			});

			// const salt = await bcrypt.genSalt(10);

			// user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user : {
					id : user.id
				}
			};

			jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '5 days' }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

// @route GET api/users
// @desc get user logged in
// @access Private

router.get('/me', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(400).send();
		}
		await user.populate('selledProducts').execPopulate();
		// console.log(user.selledProducts);
		const selledProducts = user.selledProducts;
		res.status(200).send({ user, selledProducts });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route  Patch api/users
// @desc   updating user
// @access  Private

router.patch('/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		'name',
		'email',
		'password'
	];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		const user = await User.findById(req.user.id);
		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		res.send('updated succesfully');
	} catch (e) {
		res.status(400).send(e);
	}
});

// @route Delete api/users
// @desc  deleting use account
// @access  Priate
router.delete('/me', auth, async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.user.id);
		if (user) {
			return res.send(user);
		}
		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
