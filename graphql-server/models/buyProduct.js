const mongoose = require('mongoose');

const BuyProductSchema = new mongoose.Schema(
	{
		// customer : {
		// 	type : mongoose.Schema.Types.ObjectId,
		// 	ref  : 'user'
		// },
		// product  : {
		// 	type : mongoose.Schema.Types.ObjectId,
		// 	ref  : 'selledProduct'
		// },
		customerId : {
			type     : String,
			required : true
		},
		productId  : {
			type     : String,
			required : true
		},
		state      : {
			type     : String,
			required : true
		},
		city       : {
			type     : String,
			required : true
		},
		locality   : {
			type     : String,
			required : true
		},
		zip        : {
			type     : Number,
			required : true
		},
		mobile     : {
			type     : Number,
			required : true
		}
	}
	// {
	// 	timestamps : true
	// }
);

module.exports = BuyProduct = mongoose.model('buyProduct', BuyProductSchema);
