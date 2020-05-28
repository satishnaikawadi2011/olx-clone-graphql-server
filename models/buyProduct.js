const mongoose = require('mongoose');

const BuyProductSchema = new mongoose.Schema({
	customer : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'user'
	},
	product  : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'selledProduct'
	},

	state    : {
		type     : String,
		required : true
	},
	city     : {
		type     : String,
		required : true
	},
	locality : {
		type     : String,
		required : true
	},
	zip      : {
		type     : Number,
		required : true
	},

	date     : {
		type    : Date,
		default : Date.now
	}
});

module.exports = BuyProduct = mongoose.model('buyProduct', BuyProductSchema);
