const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const HttpError = require('./models/http-error');
const myGeocoder = require('./utils/location');
const productRoutes = require('./routes/products-routes');
// /Users/satish/mongodb/bin/mongod.exe  --dbpath=/users/satish/mongodb-data
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/products', productRoutes);

// middleware for route request which doesn't exist
app.use((req, res, next) => {
	const error = new HttpError('Could not find this route', 404);
	throw error;
});

// error handling midleware
app.use((err, req, res, next) => {
	if (res.headerSent) {
		return next(err);
	}
	res.status(err.code || 500);
	res.json({ message: err.message || 'An unknown error occurred' });
});

// myGeocoder('Mumbai', (err, res) => {
// 	if (err) {
// 		return console.log(err);
// 	}
// 	else {
// 		console.log(res);
// 	}
// });

// Serve static assets in production

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
