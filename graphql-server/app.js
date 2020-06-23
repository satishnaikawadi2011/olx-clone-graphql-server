const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

const schema = require('./schema/schema');

// connect database
connectDB();

const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql : true
	})
);

app.listen(4000, () => {
	console.log('server running on port 4000');
});
