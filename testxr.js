var Xray = require('x-ray');
var xray = Xray();
var _ = require('lodash');
var Promise = require('bluebird');

var mongojs = require('mongojs');
var dbUrl = 'phuoc_2';
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
	.then(function then(step1Result) {
		step1Result = [].concat.apply([], step1Result);
		console.log(step1Result);
		return step1Result;
	})
	.map(function map(objChild) {
		
			return step3(objChild.link);
		
	})
	.then(function then(arr) {
		db.close()
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
			xray(foodItemUrl, '#main', {
		    name: '.food-description',
		    company: '#other-info .col-1 .secondary-title',
		    nutrition: {
		      nutritionName: ['td.col-1'],
		      nutritionValue: ['td.col-2'],
		    }
			})(function(err, obj) {
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
		// obj.nutritionValue = {foodId: foodId};
		obj.foodId = foodId;
		obj.company = obj.company.substring(10, obj.company.length);
	  // _.map(obj, function map(objValue) {
	  // 	for (var i = 0; i < objValue.keys.length; i++) {
	  // 		if (objValue.keys[i].trim())
	  // 			obj.nutrition[objValue.keys[i]] = objValue.values[i];
	  // 	}
	  // });
		for (var i = 0; i < obj.nutrition.nutritionName.length; i++) {
			if (obj.nutrition.nutritionName[i].trim())
				obj.nutrition[obj.nutrition.nutritionName[i]] = obj.nutrition.nutritionValue[i];
		}
		delete obj.nutrition.nutritionName;
		delete obj.nutrition.nutritionValue;
  	
  	console.log('inserting ', obj);
  	db.fooditem.insert(obj, function(err, row) {
  		if (err) {
  			console.log('error line 108: ', err.stack);
  		} else {
  			console.log(row);
  		}
  	});

	  return obj;
};

function getpages(link) {
	var result = [];
	x(link, '.pagination.alt.padtop', ['a'])(function(err, obj) {
		var max = parseInt(obj[obj.length - 2], 10);
		for (var i = 0; i < max; i++) {
			result.push(link + '/' + i);
		}
		return result;
	});
}

// xray('http://www.myfitnesspal.com/food/calories/6287', '#nutrition-facts tbody tr', [{
// 	keys: ['td.col-1'],
// 	values: ['td.col-2']
// }])(function(err, obj) {
// 	if (!err)
// 		createNutritionObject(obj);
// });