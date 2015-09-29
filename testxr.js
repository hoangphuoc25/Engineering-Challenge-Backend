var Xray = require('x-ray');
var xray = Xray();
var _ = require('lodash');
var Promise = require('bluebird');

var mongojs = require('mongojs');
var dbUrl = 'phuoc';
var collections = ['fooditem'];
var db = mongojs(dbUrl, collections);

function step1() {
	return new Promise(function Promise(resolve, reject) {
		xray('http://myfitnesspal.com/food/calorie-chart-nutrition-facts/', '.tag_cloud ul li', [{
			link: 'a@href'
		}])
		(function(err, obj) {
		  if (err) {
		  	  reject(err);	
		  } else {
		  	// console.log('step1: ', obj);
		  	resolve(obj);
		  }
		});	
	});
}


function step2(foodTypeUrl) {
	return new Promise(function Promise(resolve, reject) {
		xray(foodTypeUrl, '.food_description', [{link: 'a@href'}])(function(err, obj) {
			if(err){
				reject(err);
			} else{
				// console.log('step2: ', obj);
				resolve(obj);
			}
		});
	});
}

step1()
	.map(function map(objChild) {
		return step2(objChild.link);
	})
	.map(function map(objChild) {
		return Promise.map(objChild, function map(objChildChild) {
			return step3(objChildChild.link);
		});
	})
	.then(function then(arr) {
		console.log(arr);
	})
	.catch(function error(err) {
		console.log(err.stack);
	});

function step3(foodItemUrl) {
	return new Promise(function Promise(resolve, reject) {
		var a = foodItemUrl.split('/');
		// console.log('step3: ', foodItemUrl);
		var foodId = a[a.length - 1];
		if (!isNaN(a[a.length - 1])) {
			xray(foodItemUrl, '#nutrition-facts tbody tr', [{
				keys: ['td.col-1'],
				values: ['td.col-2']
			}])(function(err, obj) {
				if (!err) {
					// console.log(foodId);
					var t = createNutritionObject(foodId, obj);
					
					resolve(t);
				} else {
					console.log(err.stack);
				}
			});
		}
	});
};

function createNutritionObject(foodId, obj) {
		obj.nutritionalTable = {foodId: foodId};
		
	  _.map(obj, function map(objValue) {
	  	for (var i = 0; i < objValue.keys.length; i++) {
	  		if (objValue.keys[i].trim())
	  			obj.nutritionalTable[objValue.keys[i]] = objValue.values[i];
	  	}
	  });

  	
  	var testObj = {foodId: foodId};
  	console.log(foodId, ':', obj.nutritionalTable);
  	
  	db.fooditem.find(testObj, {}, function(err, rows) {
  		if (!err) {
  			console.log('no error ', foodId);
  			console.log('insert: ', obj.nutritionalTable);
  			if (foodId === '10147') {
  				console.log('inspecting 10147: ', rows);
  			}
  			if (rows.length == 0) {
					console.log('inserting');
					db.fooditem.insert(obj.nutritionalTable);
				}
  		} else {
  			console.log(err.stack);
  		}
  	});
  	
	  return obj;
};

// xray('http://www.myfitnesspal.com/food/calories/6287', '#nutrition-facts tbody tr', [{
// 	keys: ['td.col-1'],
// 	values: ['td.col-2']
// }])(function(err, obj) {
// 	if (!err)
// 		createNutritionObject(obj);
// });

