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
				console.log(err);
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
					callbackSuccess({"error": "no record found"});	
			} else {
				console.log(err);
				callbackFail();
			}
		})
	}
};