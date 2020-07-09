const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Product = require('../models/product');
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');

// const transporter = nodemailer.createTransport(
// 	sendgridTransport({
// 		auth : {
// 			api_key : 'SG.FuGQE6HSQpKavSTDaM-n8Q.TfGRcmn4eQ-ERIiTDQnVG8Afl3w5TmLeeStyTQB0L9Q'
// 		}
// 	})
// );

const createUser = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again later.', 500);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError('User exists already, please login instead.', 422);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		password,
		selledProducts : [],
		cart           : []
	});

	try {
		await createdUser.save();
		// await transporter.sendMail({
		// 	to      : email,
		// 	from    : 'satishnaikawadi2001@gmail.com',
		// 	subject : 'Signup Succeeded !',
		// 	html    : '<h1>You have successfully signed in for MeriDukan online Shop</h1>'
		// });
		const token = await createdUser.generateAuthToken();
		res.status(201).json({ user: createdUser.toObject({ getters: true }), token: token });
	} catch (err) {
		// const error = new HttpError('Signing up failed, please try again later.', 500);
		// return next(error);
		console.log(err);
	}
	// console.log(createdUser);
};

// ----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------
const getUsers = async (req, res, next) => {
	try {
		const users = await User.find({});
		res.status(200).json({ users: users });
	} catch (err) {
		const error = new HttpError('Getting users failed,please try again. ', 500);
		return next(error);
	}
};

// ----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------
const getUserById = async (req, res, next) => {
	// const userId = req.params.uid;

	let user = req.user;
	// try {
	// 	user = await User.findById(userId);
	// } catch (err) {
	// 	const error = new HttpError('Something went wrong,could not find a user', 500);
	// 	return next(error);
	// }
	if (!user) {
		const error = new HttpError('Could not found a user for provided id', 404);
		return next(error);
	}
	res.json({ user: user.toObject({ getters: true }) });
};

// -----------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------

const updateUserById = async (req, res, next) => {
	const updates = Object.keys(req.body);
	// req.user = await User.findById(req.params.uid);
	const allowedUpdates = [
		'name',
		'email',
		'password'
	];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		const error = new HttpError('Invali updates !', 422);
		return next(error);
	}

	try {
		// console.log('1');
		updates.forEach((update) => (req.user[update] = req.body[update]));
		// console.log('2');
		// console.log(req.user);
		await req.user.save();
		console.log('3');
		res.json({ user: req.user.toObject({ getters: true }) });
	} catch (e) {
		const error = new HttpError('Unable to update user , please try again', 500);
		return next(error);
	}
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------
const removeUserById = async (req, res, next) => {
	// req.user = await User.findById(req.params.uid);
	try {
		await req.user.remove();
		res.json({ user: req.user.toObject({ getters: true }) });
	} catch (e) {
		const error = new HttpError('unable to remove user,please try again', 500);
		return next(error);
	}
};

// ------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------

const login = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);
		if (!user) {
			const error = new HttpError('Invalid credentials', 422);
			return next(error);
		}
		const token = await user.generateAuthToken();
		res.json({ user: user, token: token });
	} catch (e) {
		const error = new HttpError('Unable to login,please try again', 500);
		return next(error);
	}
};

// ------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------

exports.login = login;
exports.removeUserById = removeUserById;
exports.updateUserById = updateUserById;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.getUsers = getUsers;
