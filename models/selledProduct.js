const mongoose = require('mongoose');

const SelledProductSchema = new mongoose.Schema({
	owner       : {
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'user'
	},
	category    : {
		type     : String,
		required : true
	},
	brand       : {
		type     : String,
		required : true
	},
	model       : {
		type     : String,
		required : true
	},
	title       : {
		type     : String,
		required : true
	},
	description : {
		type     : String,
		required : true
	},
	price       : {
		type     : Number,
		required : true
	},

	state       : {
		type     : String,
		required : true
	},
	city        : {
		type     : String,
		required : true
	},
	locality    : {
		type     : String,
		required : true
	},
	zip         : {
		type     : Number,
		required : true
	},
	image       : {
		type : Buffer
	},
	isBuyed     : {
		type    : Boolean,
		default : false
	},
	date        : {
		type    : Date,
		default : Date.now
	}
});

module.exports = SelledOroduct = mongoose.model('selledProduct', SelledProductSchema);
