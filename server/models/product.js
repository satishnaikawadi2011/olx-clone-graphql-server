const mongoose = require('mongoose');
const myGeocoder = require('../utils/location');
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
	contact     : { type: String, required: true },
	price       : { type: Number, required: true },
	zip         : { type: Number, required: true },
	location    : {
		longitude : { type: Number, required: true },
		latitude  : { type: Number, required: true }
	},
	owner       : { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

// convert address into geocode before saving
// productSchema.pre('save', async function(next) {
// 	const product = this;
// 	if (product.isModified('state') || product.isModified('city') || product.isModified('locality')) {
// 		const arrAddress = [
// 			product.state,
// 			product.city,
// 			product.locality
// 		];
// 		arrAddress.join(' ');
// 		console.log(arrAddress);
// 		myGeocoder(arrAddress, async (err, resp) => {
// 			if (err) {
// 				return console.log(err);
// 			}
// 			else {
// 				console.log(resp);
// 				product.location.longitude = resp.longitude;
// 				product.location.latitude = resp.latitude;
// 				console.log(product.location);
// 				next();
// 			}
// 		});
// 	}
// 	next();
// });

module.exports = mongoose.model('Product', productSchema);
