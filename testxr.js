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
		  	resolve(obj);
		  }
		});	
	});
}


function step2(foodTypeUrl) {
	return new Promise(function Promise(resolve, reject) {
		xray(foodTypeUrl, '.food_description', [
			'a@href'
		])(function(err, obj) {
			if(err){
				reject(err);
			} else{
				resolve(obj);
			}
		});
	});
}

step1()
	.map(function map(objChild) {
		return step2(objChild.link);
	}, {concurrency : 500})
	.map(function map(objChild) {
		return Promise.map(objChild, function map(objChildChild) {
			return step3(objChildChild);
		}).catch(function error(err) {
			console.log(err.stack);
		});
	}, {concurrency : 500})
	.then(function then(arr) {
		console.log(arr);
	})
	.catch(function error(err) {
		console.log(err.stack);
	});

function step3(foodItemUrl) {
	return new Promise(function Promise(resolve, reject) {
		var a = foodItemUrl.split('/');
		
		if (!isNaN(a[a.length - 1])) {
			console.log(foodItemUrl);
			var foodId = parseInt(a[a.length - 1]);
			xray(foodItemUrl, '#nutrition-facts tbody tr', [{
				keys: ['td.col-1'],
				values: ['td.col-2']
			}])(function(err, obj) {
				if (!err) {
					console.log(foodId);
					// var t = createNutritionObject(foodId, obj);
					// resolve(t);
				} else {
					// console.log(err.stack);
				}
			});
		}
	});
};

function createNutritionObject(foodId, obj) {
		obj.nutritionalTable = {foodId: foodId};
		
	  _.map(obj, function map(objValue) {
	  	for (var i = 0; i < objValue.keys.length; i++) {
	  		obj.nutritionalTable[objValue.keys[i]] = objValue.values[i];	
	  	}
	  	//console.log(obj.nutritionalTable);
	  	delete obj._id;
	  	console.log(obj.nutritionalTable);
	  	db.fooditem.insert(obj.nutritionalTable);	  	
	  });
	  
	  delete obj.nutritionalTable;
	  // console.log(obj);
	  return obj;
};

// xray('http://www.myfitnesspal.com/food/calories/6287', '#nutrition-facts tbody tr', [{
// 	keys: ['td.col-1'],
// 	values: ['td.col-2']
// }])(function(err, obj) {
// 	if (!err)
// 		createNutritionObject(obj);
// });

