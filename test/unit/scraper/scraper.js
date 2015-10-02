'use strict';
var proxyquire = require('proxyquire');
var mock = require('../mock/mock');
var expect = require('chai').expect;
var sinon = require('sinon');
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var scraper = proxyquire
  .noCallThru()
  .load('./../../../scraper/scraper', {
    'x-ray' : mock.xray.func,
    'mongojs' : mock.mongojs.func
  });

describe('[ Unit scraper ]', function desc() {
  var xrayStub;
  var getFoodCatogorySpy;
  var getFoodDishPerCategorySpy;
  var getFoodItemPerDishSpy;
  var data = {
    error : new Error(),
    foodCategoryArr : [{
      link : '/tag/show/chicken' 
    }, {
      link : '/tag/show/cheese' 
    }],

    foodDishArr : [{
      link : '/food/calories/6021'
    }, {
      link : '/food/calories/6287'  
    } , {
      link : '/food/calories/notanumber'
    }],

    foodItem : {
      name : 'Soup - Chicken noodle',
      company : 'More from Generic',
      nutrition : {
        nutritionName : ['Sodium', 'Potassium'],
        nutritionValue : ['569 mg', '95 mg']
      }
    }
  };

  beforeEach(function beforeEach() {
    xrayStub = mock.xray.xray;
    mock.xray.error = null;
    mock.xray.dataCallback = {};
  });

  describe('{ method:getFoodCatogory }', function desc() {
    beforeEach(function beforeEach(){
      getFoodCatogorySpy = sinon.spy(scraper, 'getFoodCatogory');
    });

    afterEach(function afterEach() {
      getFoodCatogorySpy.restore();
    });

    it('should call `xray` with correct parameter', function test() {
      scraper.getFoodCatogory();
      expect(xrayStub.calledWith('http://myfitnesspal.com/food/calorie-chart-nutrition-facts/', 
                                 '.tag_cloud ul li', 
                                 [{link : 'a@href'}])).to.be.true;
    });

    it('should invoke resolve with correct reponse data when no error happens on xray callback', function test() {
      mock.xray.dataCallback = data.foodCategoryArr;
      scraper.getFoodCatogory();
      expect(getFoodCatogorySpy.returnedPromise(data.foodCategoryArr)).to.be.true;
    });

    it('should invoke reject when error happens on xray callback', function test() {
      
      // mock error object
      mock.xray.error = data.error;
      scraper.getFoodCatogory().catch(function error() {

        // must handle here due to this method does not handle rejection
      });

      expect(getFoodCatogorySpy.returnedPromise(data.error)).to.be.true;
    });
  });

  describe('{ method:getFoodDishPerCategory }', function desc() {
    beforeEach(function beforeEach() {
      getFoodDishPerCategorySpy = sinon.spy(scraper, 'getFoodDishPerCategory');
    });

    afterEach(function afterEach() {
      getFoodDishPerCategorySpy.restore();
    });

    it('should call `xray` with correct parameter', function test() {
      scraper.getFoodDishPerCategory(data.foodCategoryArr[0].link);
      expect(xrayStub.calledWith(data.foodCategoryArr[0].link, 
                                 '.food_description', 
                                 [{link: 'a@href'}])).to.be.true;
    });

    it('should invoke resolve with correct reponse data when no error happens on xray callback', function test() {
      mock.xray.dataCallback = data.foodDishArr;
      scraper.getFoodDishPerCategory(data.foodCategoryArr[0].link);
      expect(getFoodDishPerCategorySpy.returnedPromise(data.foodDishArr)).to.be.true;
    });

    it('should invoke reject when error happens on xray callback', function test() {
      
      // mock error object
      mock.xray.error = data.error;
      scraper.getFoodDishPerCategory(data.foodCategoryArr[0].link).catch(function error() {

        // must handle here due to this method does not handle rejection
      });

      expect(getFoodDishPerCategorySpy.returnedPromise(data.error)).to.be.true;
    });
  });
  
  describe('{ method:getFoodItemPerDish }', function desc() {
    beforeEach(function beforeEach() {
      getFoodItemPerDishSpy = sinon.spy(scraper, 'getFoodItemPerDish');
    });

    afterEach(function afterEach() {
      getFoodItemPerDishSpy.restore();
    });

    it('should not crawl data if foodDishID is not a valid number', function test() {
      scraper.getFoodItemPerDish(data.foodDishArr[2].link);
      expect(getFoodItemPerDishSpy.returnedPromise(null)).to.be.true;
    });

    it('should call `xray` with correct parameter', function test() {
      scraper.getFoodItemPerDish(data.foodDishArr[0].link);
      expect(xrayStub.calledWith(data.foodDishArr[0].link, '#main', {
        name : '.food-description',
        company : '#other-info .col-1 .secondary-title',
        nutrition : {
          nutritionName : ['td.col-1'],
          nutritionValue : ['td.col-2'],
        }
      })).to.be.true;
    });

    it('should invoke resolve with correct reponse data when no error happens on xray callback', function test() {
      var expectedData = {

        // get from {data.foodDishArr[0].link}
        foodId : '6021',
        foodItem : data.foodItem
      };

      mock.xray.dataCallback = data.foodItem;
      scraper.getFoodItemPerDish(data.foodDishArr[0].link);
      expect(getFoodItemPerDishSpy.returnedPromise(expectedData)).to.be.true;
    });

    it('should invoke reject when error happens on xray callback', function test() {
      
      // mock error object
      mock.xray.error = data.error;
      scraper.getFoodItemPerDish(data.foodDishArr[0].link).catch(function error() {

        // must handle here due to this method does not handle rejection
      });

      expect(getFoodItemPerDishSpy.returnedPromise(data.error)).to.be.true;
    });
  });

  describe('{ method:addFoodItem }', function desc() {
    
  });
});