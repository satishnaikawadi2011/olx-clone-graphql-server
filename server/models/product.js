const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	title       : { type: String, required: true },
	description : { type: String, required: true },
	image       : { type: String, required: true },
	state       : { type: String, required: true },
	city        : { type: String, required: true },
	locality    : { type: String, required: true },
	category    : { type: String, required: true },
	model       : { type: String, required: true },
	brand       : { type: String, required: true },
	contact     : { type: Number, required: true },
	price       : { type: Number, required: true },
	zip         : { type: Number, required: true },
	location    : {
		latitude  : { type: Number, required: true },
		longitude : { type: Number, required: true }
	},
	owner       : { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);
