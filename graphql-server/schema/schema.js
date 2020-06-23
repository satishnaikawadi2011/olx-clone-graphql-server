const graphql = require('graphql');
const _ = require('lodash');
const mongoose = require('mongoose');
const User = require('../models/user');
const SelledProduct = require('../models/selledProduct');
const BuyedProduct = require('../models/buyProduct');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const SellProductType = new GraphQLObjectType({
	name   : 'SellProduct',
	fields : () => ({
		id          : { type: GraphQLID },
		category    : { type: GraphQLString },
		brand       : { type: GraphQLString },
		model       : { type: GraphQLString },
		title       : { type: GraphQLString },
		description : { type: GraphQLString },
		state       : { type: GraphQLString },
		city        : { type: GraphQLString },
		locality    : { type: GraphQLString },
		price       : { type: GraphQLInt },
		zip         : { type: GraphQLInt },
		isBuyed     : { type: GraphQLBoolean },
		ownerId     : { type: GraphQLID },
		owner       : {
			type    : UserType,
			resolve(parent, args) {
				// return _.find(users, { id: parent.ownerId });

				return User.findById(parent.ownerId);
			}
		}
	})
});

const UserType = new GraphQLObjectType({
	name   : 'User',
	fields : () => ({
		id             : { type: GraphQLID },
		name           : { type: GraphQLString },
		email          : { type: GraphQLString },
		password       : { type: GraphQLString },
		selledProducts : {
			type    : new GraphQLList(SellProductType),
			resolve(parent, args) {
				// return _.filter(selledProducts, { ownerId: parent.id });
				return SelledProduct.find({ ownerId: parent.id });
			}
		},
		buyedProducts  : {
			type    : new GraphQLList(BuyProductType),
			resolve(parent, args) {
				// return _.filter(selledProducts, { ownerId: parent.id });
				return BuyedProduct.find({ customerId: parent.id });
			}
		}
		// title       : { type: GraphQLString },
		// description : { type: GraphQLString },
		// state       : { type: GraphQLString },
		// city        : { type: GraphQLString },
		// locality    : { type: GraphQLString },
		// price       : { type: GraphQLInt },
		// zip         : { type: GraphQLInt },
		// isBuyed     : { type: GraphQLBoolean }
	})
});

const BuyProductType = new GraphQLObjectType({
	name   : 'BuyProduct',
	fields : () => ({
		id         : { type: GraphQLID },
		state      : { type: GraphQLString },
		city       : { type: GraphQLString },
		locality   : { type: GraphQLString },
		mobile     : { type: GraphQLString },
		zip        : { type: GraphQLInt },
		customerId : { type: GraphQLID },
		productId  : { type: GraphQLID },
		customer   : {
			type    : UserType,
			resolve(parent, args) {
				// return _.find(users, { id: parent.ownerId });

				return User.findById(parent.customerId);
			}
		},
		product    : {
			type    : SellProductType,
			resolve(parent, args) {
				// return _.find(users, { id: parent.ownerId });

				return SelledProduct.findById(parent.productId);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name   : 'RootQueryType',
	fields : {
		selledProduct  : {
			type    : SellProductType,
			args    : { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(selledProducts, { id: args.id });
				return SelledProduct.findById(args.id);
			}
		},
		user           : {
			type    : UserType,
			args    : { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(users, { id: args.id });
				return User.findById(args.id);
			}
		},
		buyedProduct   : {
			type    : SellProductType,
			args    : { id: { type: GraphQLID } },
			resolve(parent, args) {
				// return _.find(selledProducts, { id: args.id });
				return BuyedProduct.findById(args.id);
			}
		},
		selledProducts : {
			type    : new GraphQLList(SellProductType),
			resolve(parent, args) {
				// return selledProducts;
				return SelledProduct.find({});
			}
		},
		users          : {
			type    : new GraphQLList(UserType),
			resolve(parent, args) {
				// return users;
				return User.find({});
			}
		},
		buyedProducts  : {
			type    : new GraphQLList(SellProductType),
			resolve(parent, args) {
				// return selledProducts;
				return BuyedProduct.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name   : 'Mutation',
	fields : {
		addUser    : {
			type    : UserType,
			args    : {
				name     : { type: new GraphQLNonNull(GraphQLString) },
				email    : { type: new GraphQLNonNull(GraphQLString) },
				password : { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				// console.log(existingProduct);
				const user = new User({
					name     : args.name,
					password : args.password,
					email    : args.email
				});

				return user.save();
			}
		},
		addProduct : {
			type    : SellProductType,
			args    : {
				category    : { type: new GraphQLNonNull(GraphQLString) },
				brand       : { type: new GraphQLNonNull(GraphQLString) },
				model       : { type: new GraphQLNonNull(GraphQLString) },
				title       : { type: new GraphQLNonNull(GraphQLString) },
				description : { type: new GraphQLNonNull(GraphQLString) },
				state       : { type: new GraphQLNonNull(GraphQLString) },
				city        : { type: new GraphQLNonNull(GraphQLString) },
				locality    : { type: new GraphQLNonNull(GraphQLString) },
				price       : { type: new GraphQLNonNull(GraphQLInt) },
				zip         : { type: new GraphQLNonNull(GraphQLInt) },
				ownerId     : { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				const product = new SelledProduct({
					category    : args.category,
					model       : args.model,
					title       : args.title,
					description : args.description,
					price       : args.price,
					zip         : args.zip,
					state       : args.state,
					city        : args.city,
					locality    : args.locality,
					brand       : args.brand,
					ownerId     : args.ownerId
				});
				return product.save();
			}
		},
		buyProduct : {
			type    : BuyProductType,
			args    : {
				state      : { type: new GraphQLNonNull(GraphQLString) },
				city       : { type: new GraphQLNonNull(GraphQLString) },
				locality   : { type: new GraphQLNonNull(GraphQLString) },
				mobile     : { type: new GraphQLNonNull(GraphQLString) },
				zip        : { type: new GraphQLNonNull(GraphQLInt) },
				customerId : { type: new GraphQLNonNull(GraphQLID) },
				productId  : { type: new GraphQLNonNull(GraphQLID) }
			},
			async resolve(parent, args) {
				try {
					const existingProduct = SelledProduct.find({ _id: args.productId }, (err, obj) => {
						if (obj[0].isBuyed) {
							throw new Error('The product has been already buyed');
						}
					});
					const product = new BuyedProduct({
						zip        : args.zip,
						state      : args.state,
						city       : args.city,
						locality   : args.locality,
						mobile     : +args.mobile,
						customerId : args.customerId,
						productId  : args.productId
					});

					await SelledProduct.findByIdAndUpdate({ _id: args.productId }, { isBuyed: true });
					// console.log(typeof id);
					return product.save();
				} catch (err) {
					console.log(err.message);
				}
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query    : RootQuery,
	mutation : Mutation
});
