var mongojs = require('mongojs');
var dbUrl = 'phuoc_2';
var collections = ['fooditem'];
var db = mongojs(dbUrl, collections);

module.exports = {
	insert : function insert(foodItem, callbackFail, callbackSuccess) {
		db.fooditem.insert(foodItem, function(err, row) {
			if(!err) {
				callbackSuccess();
			} else {
				callbackFail();
			}
		});
	},
  
	getById: function search(foodId, callbackFail, callbackSuccess) {
		db.fooditem.findOne({foodId: foodId}, function(err, row) {
			if (!err) {
				if (row)
					callbackSuccess(row.nutrition);
				else 
					callbackSuccess({"error": "No record found with that foodId"});
			} else {
				callbackFail();
			}
		})
	}
};