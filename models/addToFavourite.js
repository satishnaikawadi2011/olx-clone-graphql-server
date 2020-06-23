const mongoose = require('mongoose');

const AddToFavouriteSchema = new mongoose.Schema(
	{
		customer : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'user'
		},
		product  : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'selledProduct'
		}
	},
	{
		timestamps : true
	}
);

module.exports = AddToFavourite = mongoose.model('AddToFavourite', AddToFavouriteSchema);
