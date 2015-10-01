/**
 * FooditemController
 *
 * @description :: Server-side logic for managing fooditems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});

var mongojs = require('mongojs');
var dbUrl = 'phuoc_2';
var collections = ['fooditem'];
var db = mongojs(dbUrl, collections);

module.exports = {
	query: function(req, res) {
		var obj = req.query.name;
		console.log('query: ', obj);
		client.search({
			index: 'phuoc_2',
			type: 'fooditem',
			body: {
				query: {
				  	match: {
				    	name: obj
				  	}
				}
			}
		}).then(function (body) {
		  var hits = body.hits;
		  // console.log('body: ', body);
		  res.status(200);
		  res.json(body.hits.hits);
		}, function (error) {
		  console.trace(error.message);
		});
	},
	post: function(req, res) {
		console.log(JSON.stringify(req.body));
		res.status(200);
		res.json(JSON.stringify(req.body))
	},
	get: function(req, res) {		
		return res.view('homepage_sleep', {name: "phuoc", age: 21});
	},
	insert: function(req, res) {
		console.log(req.body);
		newObj = {};
		newObj.foodId = req.body.foodId;
		newObj.name = req.body.foodname;
		newObj.company = req.body.companyname;
		newObj.nutrition = {}
		newObj.nutrition["Calories"] = req.body.calories;
  		newObj.nutrition["Sodium"] = req.body.sodium;
		newObj.nutrition["Total Fat"] = req.body.totalfat;
		newObj.nutrition["Potassium"] = req.body.sodium;
		newObj.nutrition["Saturated"] = req.body.potassium;
		newObj.nutrition["Total Carbs"] = req.body.totalcarbs;
		newObj.nutrition["Polyunsaturated"] = req.body.polyun;
		newObj.nutrition["Dietary Fiber"] = req.body.dietfiber;
		newObj.nutrition["Monounsaturated"] = req.body.monoun;
		newObj.nutrition["Sugars"] = req.body.sugar;
		newObj.nutrition["Trans"] = req.body.trans;
		newObj.nutrition["Protein"] = req.body.protein;
		newObj.nutrition["Cholesterol"] = req.body.cholesterol;
		console.log('inserting: ', newObj);
		db.fooditem.insert(newObj, function(err, row) {
		 	if (!err) {
		 		console.log('inserted');
		  		res.status(200);
		  		res.json(JSON.stringify(row));
		  	} else {
		  		res.status(400);
		  		res.json(JSON.stringify({error: "foodId must be unique"}));
		  	}
		});
	}
};

