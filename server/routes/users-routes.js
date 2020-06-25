const express = require('express');
const { check } = require('express-validator');
const userControllers = require('../controllers/user-controller');
const auth = require('../middlewares/auth');

const router = express.Router();

// @route  Post api/users
// @desc   create a new user
// @access Public
router.post(
	'/',
	[
		check('name').not().isEmpty(),
		check('email').isEmail(),
		check('password').not().isEmpty().isLength({ min: 8, max: 14 })
	],
	userControllers.createUser
);

// @route  Get api/users
// @desc   get all users
// @access Public
router.get('/', userControllers.getUsers);

// @route  Get api/users
// @desc   get user by id
// @access Private
router.get('/me', auth, userControllers.getUserById);

// @route  Patch api/users
// @desc   update user by id
// @access Private
router.patch('/me', auth, userControllers.updateUserById);

// @route  Delete api/users
// @desc   remove user by id
// @access Private
router.delete('/me', auth, userControllers.removeUserById);

// @route  Post api/users
// @desc   log in user
// @access Public
router.post(
	'/login',
	[
		check('email').not().isEmpty().isEmail(),
		check('password').not().isEmpty().isLength({ min: 8 })
	],
	userControllers.login
);

module.exports = router;
