const User = require('../models/user');
const SelledProduct = require('../models/selledProduct');
const AddToFavourite = require('../models/addToFavourite');

const populateUser = async (userId) => {
	const user = User.findById(userId);
	return { ...user, _id: user.id };
};

const populateProducts = async (productIds) => {
	const products = SelledProduct.find({ _id: { $in: productIds } });
	return products.map((product) => {
		return {
			...product,
			_id   : product.id,
			owner : populateUser.bind(this, product.owner)
		};
	});
};

exports.populateProducts = populateProducts;
exports.populateUser = populateUser;
