const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name     : {
		type     : String,
		required : true
	},
	email    : {
		type     : String,
		required : true,
		unique   : true
	},
	password : {
		type     : String,
		required : true
	},
	avatar   : {
		type : String
	},
	date     : {
		type    : Date,
		default : Date.now
	}
});

UserSchema.virtual('selledProducts', {
	ref          : 'selledProduct',
	localField   : '_id',
	foreignField : 'owner'
});
// userSchema.methods.toJSON = function() {
// 	const user = this;
// 	const userObject = user.toObject();

// 	delete userObject.password;
// 	delete userObject.tokens;

// 	return userObject;
// };

// userSchema.methods.generateAuthToken = async function() {
// 	const user = this;
// 	const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');

// 	user.tokens = user.tokens.concat({ token });
// 	await user.save();

// 	return token;
// };

// userSchema.statics.findByCredentials = async (email, password) => {
// 	const user = await User.findOne({ email });

// 	if (!user) {
// 		throw new Error('Unable to login');
// 	}

// 	const isMatch = await bcrypt.compare(password, user.password);

// 	if (!isMatch) {
// 		throw new Error('Unable to login');
// 	}

// 	return user;
// };
// Hash the plain text password before saving
UserSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}

	next();
});

module.exports = User = mongoose.model('user', UserSchema);
