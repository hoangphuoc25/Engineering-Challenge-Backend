'use strict';
var Xray = require('x-ray');
var Promise = require('bluebird');
var mongojs = require('mongojs');
var _ = require('lodash');
var dbUrl = 'phuoc_2';
var collections = ['fooditem'];
var db = mongojs(dbUrl, collections);
var xray = Xray();

module.exports.getFoodCatogory = getFoodCatogory;
module.exports.getFoodDishPerCategory = getFoodDishPerCategory;
module.exports.getFoodItemPerDish = getFoodItemPerDish;
module.exports.addFoodItem = addFoodItem;
module.exports.invoke = invoke;

//---------------------
function getFoodCatogory() {
  return new Promise(function Promise(resolve, reject) {
    xray('http://myfitnesspal.com/food/calorie-chart-nutrition-facts/', 
         '.tag_cloud ul li', 
         [{link : 'a@href'}])
         (function result(err, foodCategoryArr) {
            if (err) {
              reject(err);  
            } else {
              resolve(foodCategoryArr);
            }
          }); 
  });  
}

function getFoodDishPerCategory(foodCategoryUrl) {
  return new Promise(function Promise(resolve, reject) {
    xray(foodCategoryUrl, 
         '.food_description', 
         [{link: 'a@href'}])
         (function result(err, foodDishArr) {
            if(err){
              reject(err);
            } else{
              resolve(foodDishArr);
            }
          });
  });
}

function getFoodItemPerDish(foodDishUrl) {
  return new Promise(function Promise(resolve, reject) {

    // foodDishUrl -> /food/calories/368431
    //  linkArr -> [food, calories, 368431]
    var linkArr = foodDishUrl.split('/');

    // foodId -> 368431
    var foodId = _.last(linkArr);

    // if {foodId} is not a number, dont process it
    if(!isNaN(foodId)) {
      xray(foodDishUrl, '#main', {
        name : '.food-description',
        company : '#other-info .col-1 .secondary-title',
        nutrition : {
          nutritionName : ['td.col-1'],
          nutritionValue : ['td.col-2'],
        }
      })(function result(err, foodItem) {
        if (!err) {
          resolve({foodId : foodId, foodItem : foodItem});
        } else {
          reject(err);
        }
      });
    } else {
      resolve(null);
    }
  });
}

function addFoodItem(foodId, foodItem) {
  return new Promise(function Promise(resolve, reject) {

    // Ex : {foodItem.company} -> "More from Sonic"
    // after substring -> "Sonic"
    foodItem.company = foodItem.company.substring(10, foodItem.company.length);
    
    // Ex nutrition :
    // nutrition : {nutritionName : ['name1', 'name2'],
    //              nutritionValue : ['value1', 'value2']}
    //              
    // Convert it to :
    // -> nutrition : {name1 : value1, name2 : value2} 
    var keyArr = foodItem.nutrition.nutritionName;
    var valueArr = foodItem.nutrition.nutritionValue;
    var nutritionObj = foodItem.nutrition;

    _.each(keyArr, function each(key, valueArrIndex) {
      if(_.trim(key)) {
        nutritionObj[key] = valueArr[valueArrIndex];  
      }
    }); 

    // remove 2 attributes which we do not want to store in database
    delete nutritionObj.nutritionName;
    delete nutritionObj.nutritionValue;

    db.fooditem.insert(foodItem, function insert(err) {
      if(err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

function invoke() {
  return getFoodCatogory()
    .map(function map(foodCategory) {
      var foodCategoryUrl = foodCategory.link;

      return getFoodDishPerCategory(foodCategoryUrl);
    })
    .then(function then(foodDishArr) {

      // [[{link : 'linkDis1', {link : 'linkDish2'}}]] 
      // -> [{link : 'linkDish1'}, {link : 'linkDish2'}]
      return _.flatten(foodDishArr);
    })
    .map(function map(foodDish) {
      var foodDishUrl = foodDish.link;

      return getFoodItemPerDish(foodDishUrl);
    })
    .map(function map(foodItemObj) {
      if(foodItemObj) {
        var foodId = foodItemObj.foodId;
        var foodItem = foodItemObj.foodItem;

        return addFoodItem(foodId, foodItem);  
      }
    })
    .then(function then() {
      db.close();
    })
    .catch(function error(err) {
      console.log(err.stack);
    });
}