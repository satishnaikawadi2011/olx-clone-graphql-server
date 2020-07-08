const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Schema = mongoose.Schema;
const Product = require('../models/product');

const userSchema = new Schema({
	name           : { type: String, required: true },
	password       : { type: String, required: true, minlength: 8 },
	email          : { type: String, required: true, unique: true, trim: true },
	selledProducts : [
		{ type: mongoose.Types.ObjectId, required: true, ref: 'Product' }
	],
	cart           : [
		{ type: mongoose.Types.ObjectId, required: true, ref: 'Product' }
	],
	totalAmount    : { type: Number, default: 0 },
	totalProducts  : { type: Number, default: 0 }
});

// Delete user products when user is removed
userSchema.pre('remove', async function(next) {
	const user = this;
	await Product.deleteMany({ owner: user._id });
	next();
});

// genereting jwt token
userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, config.get('jwtSecret'), { expiresIn: '2h' });

	return token;
};

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('Unable to login,please try again');
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error('Invalid Credentials !');
	}
	// console.log(user);
	return user;
};

const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);
