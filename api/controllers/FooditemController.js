/**
 * FooditemController
 *
 * @description :: Server-side logic for managing fooditems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var FoodItem = require('./FoodItemModel');
var FoodItemSearch = require('./FoodItemSearch');
var _ = require('lodash');

module.exports = {

  // 'get /api/fooditems?id=:foodId&name=:name'
	query: function(req, res) {
		var itemName = req.query.name;
    var id = req.query.id;

    // prioritize id over name
    if (id) {
      return FoodItem.getById(id, function error() {
        res.status(400).json({});
      }, function success(data) {
        res.status(200).json(data);
      });
    }
    else {
  		return FoodItemSearch
        .search(itemName)
        .then(function (searchResult) {
  		    var reponseData = searchResult.hits.hits;
          var a = _.map(reponseData, function(item) {
            return {foodId: item._source.foodId, name: item._source.name};
          });
  		    res.status(200).json(a);
    		}, function (error) {
    		  res.status(500).json({});
    		});
    }
	},

  // 'get /fooditems'
	get: function(req, res) {		
		return res.view('addfooditem');
	},

  // 'post /api/fooditems'
	insert: function(req, res) {
    var foodItem = {};

    foodItem.foodId = req.body.foodId;
    foodItem.name = req.body.foodname;
    foodItem.company = req.body.companyname;
    foodItem.nutrition = {};
    foodItem.nutrition["Calories"] = req.body.calories;
    foodItem.nutrition["Sodium"] = req.body.sodium;
    foodItem.nutrition["Total Fat"] = req.body.totalfat;
    foodItem.nutrition["Potassium"] = req.body.sodium;
    foodItem.nutrition["Saturated"] = req.body.potassium;
    foodItem.nutrition["Total Carbs"] = req.body.totalcarbs;
    foodItem.nutrition["Polyunsaturated"] = req.body.polyun;
    foodItem.nutrition["Dietary Fiber"] = req.body.dietfiber;
    foodItem.nutrition["Monounsaturated"] = req.body.monoun;
    foodItem.nutrition["Sugars"] = req.body.sugar;
    foodItem.nutrition["Trans"] = req.body.trans;
    foodItem.nutrition["Protein"] = req.body.protein;
    foodItem.nutrition["Cholesterol"] = req.body.cholesterol;
    foodItem.nutrition["Vitamin A"] = req.body.vitamina;
    foodItem.nutrition["Vitamin C"] = req.body.vitaminc;
    foodItem.nutrition["Calcium"] = req.body.calcium;
    foodItem.nutrition["Iron"] = req.body.iron;
    FoodItem.insert(foodItem, function error() {
      res.status(400).json({});
    }, function success() {
      res.status(200).json({});
    });
	}
};
