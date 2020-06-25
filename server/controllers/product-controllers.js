const { validationResult } = require('express-validator');
const myGeocoder = require('../utils/location');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Product = require('../models/product');

// -------------------------------------------------------------------------------------------------------------------------------------------------
const getProductById = async (req, res, next) => {
	const productId = req.params.pid;
	let product;
	try {
		product = await Product.findById(productId);
	} catch (err) {
		const error = new HttpError('Something went wrong,could not find a product', 500);
		return next(error);
	}
	if (!product) {
		const error = new HttpError('Could not found a product for rovided id', 404);
		return next(error);
	}
	res.json({ product: product.toObject({ getters: true }) });
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
const createProduct = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new HttpError('Invalid inputs passed, please check your data.', 422));
	}

	const { title, description, state, zip, city, locality, category, model, brand, contact, price } = req.body;
	var location;
	const arrAddress = [
		state,
		city,
		locality
	];
	arrAddress.join(' ');
	myGeocoder(arrAddress, async (err, resp) => {
		if (err) {
			return console.log(err);
		}
		else {
			location = resp;
			const createdProduct = new Product({
				title,
				description,
				state,
				city,
				locality,
				zip,
				contact,
				price,
				brand,
				model,
				category,
				image       : 'https://picsum.photos/200',
				owner       : req.user.id,
				location
			});
			try {
				await createdProduct.save();
			} catch (err) {
				const error = new HttpError('Creating product failed, please try again.', 500);
				return next(err);
			}
			// let user;
			// try {
			// 	user = await User.findById(owner);
			// } catch (err) {
			// 	const error = new HttpError('Creating product failed, please try again.', 500);
			// 	return next(error);
			// }

			// if (!user) {
			// 	const error = new HttpError('Could not find user for provided id.', 404);
			// 	return next(error);
			// }

			// console.log(user);

			try {
				//   const sess = await mongoose.startSession();
				//   sess.startTransaction();
				//   await createdPlace.save({ session: sess });
				req.user.selledProducts.push(createdProduct);
				await req.user.save();
			} catch (err) {
				const error = new HttpError('Creating product failed, please try again.', 500);
				return next(err);
			}

			res.status(201).json({ product: createdProduct });
		}
	});
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------

const getProductsByUserId = async (req, res, next) => {
	try {
		const products = await Product.find({ owner: req.user.id });
		if (!products) {
			const error = new HttpError('could not found products for provided user', 404);
			return next(error);
		}
		res.json({ products: products });
	} catch (e) {
		const error = new HttpError('could not fetch proudcts, please try again', 500);
		return next(error);
	}
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------

const getProducts = async (req, res, nexr) => {
	try {
		const products = await Product.find({});
		if (!products) {
			const error = new HttpError('could not found products', 404);
			return next(error);
		}
		res.json({ products: products });
	} catch (e) {
		const error = new HttpError('could not fetch proudcts, please try again', 500);
		return next(error);
	}
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------

const updateProductById = async (req, res, next) => {
	const updates = Object.keys(req.body);
	const product = await Product.findOne({ _id: req.params.pid, owner: req.user.id });
	if (!product) {
		const error = new HttpError('could not found product with provided id', 404);
		return next(error);
	}
	// req.user = await User.findById(req.params.uid);
	const allowedUpdates = [
		'title',
		'description',
		'contact',
		'state',
		'city',
		'locality',
		'zip'
	];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		const error = new HttpError('Invalid updates !', 422);
		return next(error);
	}
	if (!req.body.state) {
		req.body.state = product.state;
	}
	if (!req.body.city) {
		req.body.city = product.city;
	}
	if (!req.body.locality) {
		req.body.locality = product.locality;
	}

	const arrAddress = [
		req.body.state,
		req.body.city,
		req.body.locality
	];
	arrAddress.join(' ');
	console.log(arrAddress);
	myGeocoder(arrAddress, async (err, resp) => {
		if (err) {
			return console.log(err);
		}
		else {
			// console.log(resp);
			product.location.longitude = resp.longitude;
			product.location.latitude = resp.latitude;
			// console.log(product.location);
			try {
				// console.log('1');
				updates.forEach((update) => (product[update] = req.body[update]));
				// console.log('2');
				// console.log(req.user);
				const updatedProduct = await product.save();
				// console.log('3');
				res.json({ product: updatedProduct });
			} catch (e) {
				const error = new HttpError('Unable to update product , please try again', 500);
				return next(error);
			}
		}
	});
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------

const removeProductById = async (req, res, next) => {
	const productId = req.params.pid;
	try {
		const product = await Product.findOneAndDelete({ _id: productId, owner: req.user.id });
		if (!product) {
			const error = new HttpError('Could not found a product with provided id', 404);
			return next(error);
		}
		// await product.remove();
		await req.user.selledProducts.pull(product);
		await req.user.save();
		res.json({ product: product });
	} catch (e) {
		// const error = new HttpError('Unable to remove product , please try again', 500);
		return next(e);
	}
};

// -------------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------------

exports.removeProductById = removeProductById;
exports.updateProductById = updateProductById;
exports.getProducts = getProducts;
exports.getProductsByUserId = getProductsByUserId;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
