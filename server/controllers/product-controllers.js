const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Product = require('../models/product');

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

exports.getProductById = getProductById;
