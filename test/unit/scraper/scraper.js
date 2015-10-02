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
  var getFoodCatogoryStub;
  var getFoodDishPerCategoryStub;
  var getFoodItemPerDishStub;
  var addFoodItemSpy;
  var addFoodItemStub;
  var dbStub;
  var insertStub;
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

    foodDishArrAlt : [{
      link : '/food/calories/7021'
    }, {
      link : '/food/calories/7287'  
    }],

    foodItem : {
      name : 'Soup - Chicken noodle',
      company : 'More from Generic',
      nutrition : {
        nutritionName : ['Sodium', 'Potassium'],
        nutritionValue : ['569 mg', '95 mg']
      }
    },

    foodId : '6021',
    company : 'Generic'
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
        foodId : data.foodId,
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
    beforeEach(function beforeEach() {
      addFoodItemSpy = sinon.spy(scraper, 'addFoodItem');
      insertStub = sinon.stub();
      dbStub = mock.mongojs.db;

      // mock db object in module
      dbStub.fooditem = {
        insert : insertStub
      };

      dbStub.close = sinon.spy();
    });

    afterEach(function afterEach() {
      addFoodItemSpy.restore();
    });

    it('should call `db.fooditem.insert` with correct parameter', function test() {
      var expectedData = {
        name : data.foodItem.name,
        company : data.company,
        foodId : data.foodId,
        nutrition : {
          "Sodium" : '569 mg',
          "Potassium" : '95 mg'
        }
      };

      scraper.addFoodItem(data.foodId, data.foodItem);
      expect(insertStub.calledWith(expectedData)).to.be.true;
    });

    it('should invoke resolve  when no error happens on xray callback', function test() {
      scraper.addFoodItem(data.foodId, data.foodItem);
      insertStub.callArg(1, null, null);
      expect(addFoodItemSpy.returnedPromise()).to.be.true;
    });

    it('should invoke reject when error happens on xray callback', function test() {
      
      // mock error object
      mock.xray.error = data.error;
      scraper.addFoodItem(data.foodId, data.foodItem).catch(function error() {

        // must handle here due to this method does not handle rejection
      });

      insertStub.callArg(1, data.error, null);
      expect(addFoodItemSpy.returnedPromise(data.error)).to.be.true;
    });
  });

  describe('{ method:invoke }', function desc() {
    beforeEach(function beforeEach() {
      getFoodCatogoryStub = sinon.stub(scraper, 'getFoodCatogory');
      getFoodDishPerCategoryStub = sinon.stub(scraper, 'getFoodDishPerCategory');
      getFoodItemPerDishStub = sinon.stub(scraper, 'getFoodItemPerDish');
      addFoodItemStub = sinon.stub(scraper, 'addFoodItem');
    });

    afterEach(function afterEach() {
      getFoodCatogoryStub.restore();
      getFoodItemPerDishStub.restore();
      getFoodDishPerCategoryStub.restore();
      addFoodItemStub.restore();
    });

    it('should call `getFoodDishPerCategory` with correct parameter', function test(done) {
      getFoodCatogoryStub.resolves(data.foodCategoryArr);

      // must reject so chain will not be passed
      getFoodDishPerCategoryStub.rejects();

      scraper.invoke().then(function then(){
        expect(getFoodDishPerCategoryStub.calledTwice).to.be.true;  
        expect(getFoodDishPerCategoryStub.firstCall.calledWith(data.foodCategoryArr[0].link)).to.be.true;
        expect(getFoodDishPerCategoryStub.secondCall.calledWith(data.foodCategoryArr[1].link)).to.be.true;
        done();
      });
    });

    it('should call `getFoodItemPerDish` with correct parameter', function test(done) {
      var expectedData = [{
        link : '/food/calories/6021'
      }, {
        link : '/food/calories/6287'  
      }, {
        link : '/food/calories/notanumber'
      }, {
        link : '/food/calories/7021'
      }, {
        link : '/food/calories/7287'  
      }];

      getFoodCatogoryStub.resolves(data.foodCategoryArr);
      getFoodDishPerCategoryStub.onFirstCall().resolves(data.foodDishArr);
      getFoodDishPerCategoryStub.onSecondCall().resolves(data.foodDishArrAlt);

      // reject so chain will not be passed
      getFoodItemPerDishStub.rejects();
      scraper.invoke().then(function then() {
        expect(getFoodItemPerDishStub.callCount).to.equal(5);
        expect(getFoodItemPerDishStub.getCall(0).calledWith(expectedData[0].link)).to.be.true;
        expect(getFoodItemPerDishStub.getCall(1).calledWith(expectedData[1].link)).to.be.true;
        expect(getFoodItemPerDishStub.getCall(2).calledWith(expectedData[2].link)).to.be.true;
        expect(getFoodItemPerDishStub.getCall(3).calledWith(expectedData[3].link)).to.be.true;
        expect(getFoodItemPerDishStub.getCall(4).calledWith(expectedData[4].link)).to.be.true;
        done();
      });
    }); 

    it('should call `addFoodItem` with correct parameter', function test(done) {
      var expectedData = [{
        foodId : '6021',
        foodItem : {
          name : 'name1'
        }
      }, {
        foodId : '6287',
        foodItem : {
          name : 'name2'
        }
      }, null, {
        foodId : '7021',
        foodItem : {
          name : 'name3'
        }
      }, {
        foodId : '7287',
        foodItem : {
          name : 'name4'
        }
      }];

      getFoodCatogoryStub.resolves(data.foodCategoryArr);
      getFoodDishPerCategoryStub.onFirstCall().resolves(data.foodDishArr);
      getFoodDishPerCategoryStub.onSecondCall().resolves(data.foodDishArrAlt);
      getFoodItemPerDishStub.onCall(0).resolves(expectedData[0]);
      getFoodItemPerDishStub.onCall(1).resolves(expectedData[1]);
      getFoodItemPerDishStub.onCall(2).resolves(expectedData[2]);
      getFoodItemPerDishStub.onCall(3).resolves(expectedData[3]);
      getFoodItemPerDishStub.onCall(4).resolves(expectedData[4]);

      // stop promise chain
      addFoodItemStub.rejects();
      scraper.invoke().then(function then() {
        expect(addFoodItemStub.callCount).to.equal(4);
        expect(addFoodItemStub.getCall(0).calledWith(expectedData[0].foodId, expectedData[0].foodItem)).to.be.true;
        expect(addFoodItemStub.getCall(1).calledWith(expectedData[1].foodId, expectedData[1].foodItem)).to.be.true;
        expect(addFoodItemStub.getCall(2).calledWith(expectedData[3].foodId, expectedData[3].foodItem)).to.be.true;
        expect(addFoodItemStub.getCall(3).calledWith(expectedData[4].foodId, expectedData[4].foodItem)).to.be.true;
        done();
      });
    });
  });
});