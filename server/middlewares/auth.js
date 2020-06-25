const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('config');
const HttpError = require('../models/http-error');

const auth = async (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		// console.log(config.get('jwtSecret'));
		// const token = req.header('Authorization').replace('Bearer ', '');
		const token = req.headers.authorization.split(' ')[1];
		// console.log(token);
		const decoded = jwt.verify(token, config.get('jwtSecret'));
		console.log(decoded);
		const user = await User.findOne({ _id: decoded._id });

		if (!user) {
			throw new Error('Authentication failed !');
		}

		req.token = token;
		req.user = user;
		next();
	} catch (e) {
		const error = new HttpError('Authentication failed ,please authenticate !', 500);
		return next(error);
	}
};

module.exports = auth;
