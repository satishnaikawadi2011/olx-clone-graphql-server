const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name           : { type: String, required: true },
	password       : { type: String, required: true, minlength: 8, maxlength: 14 },
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

module.exports = mongoose.model('User', userSchema);
