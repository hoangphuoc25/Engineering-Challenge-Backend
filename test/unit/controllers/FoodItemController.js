'use strict';
var proxyquire = require('proxyquire');
var mock = require('../mock/mock');
var expect = require('chai').expect;
var sinon = require('sinon');
var FoodItemController = proxyquire
	.noCallThru()
	.load('./../../../api/controllers/FooditemController', {
		'./FoodItemModel' : mock.FoodItemModel,
		'./FoodItemSearch' : mock.FoodItemSearch
	});

describe('[ Unit FooditemController ]', function desc() {
  var searchStub;
  var thenStub;
  var getByIdStub;
  var insertStub;
  var resStatusStub;
  var resJsonStub;
  var resViewStub;
  var searchStub;
  var searchThenStub;
  var data = {
    foodItemName : 'test_name',
    searchResult : {
      hits : {
        hits : []
      }
    },

    id : 'test_foodid',

    // mock a single foodItem data
    foodItem : {
      foodId : 'test_foodid',
      foodname: 'pork type 3',
      companyname: 'robert',
      calories: '0',
      sodium: '0',
      totalfat: '0',
      potassium: '0',
      saturated: '0',
      totalcarbs: '0',
      polyun: '0',
      dietfiber: '0',
      monoun: '0',
      sugar: '0',
      trans: '0',
      protein: '0',
      cholesterol: '0' 
    },

    listFoodItem : [{
      _source : {
        foodId : 'test_foodid1',
        name : 'test_foodname1'
      }
    }, {
      _source : {
        foodId : 'test_foodid2',
        name : 'test_foodname2'
    }}] 
  };

  beforeEach(function beforeEach() {
    resStatusStub = mock.res.status;
    resJsonStub = mock.res.json;
  });

  //-------------------- QUERY
	describe('{ method:query }', function desc() {
    describe('{ request:foodItemId }', function desc() {
      beforeEach(function beforeEach() {

        // mock req to contains `id` query
        // so that `FoodItem.getById` is invoked
        mock.req.query.id = data.id;
        getByIdStub = mock.FoodItemModel.getById;
      });

      afterEach(function afterEach() {
        mock.req.query.id = undefined;
      });

      it('should search for `foodItemId` and called `FoodItem.getById` with correct parameter', function test() {

        // call controller
        FoodItemController.query(mock.req, mock.res);
        expect(getByIdStub.calledWith(data.id)).to.be.true;
      });

      it('should respond 200 with correct data if `foodId` can be found or not be found inside database', function test() {
        FoodItemController.query(mock.req, mock.res);
        
        // invoke success callback which is
        // 2nd arg in list function params
        getByIdStub.callArgWith(2, data.foodItem);
        expect(resStatusStub.calledWith(200)).to.be.true;
        expect(resJsonStub.calledWith(data.foodItem)).to.be.true;
      }); 

      it('should respond 400 if error happens when retrieve `foodItem` inside database', function test() {
        FoodItemController.query(mock.req, mock.res);

        // invoke error callback which is 
        // 1st arg in list function params
        getByIdStub.callArg(1);
        expect(resStatusStub.calledWith(400)).to.be.true;
        expect(resJsonStub.calledWith({})).to.be.true;
      }); 
    });

    describe('{ request:foodItemName }', function dec() {
      beforeEach(function beforeEach() {

        // mock req to contains `name` query
        mock.req.query.name = data.foodItemName;
        searchStub = mock.FoodItemSearch.search;
        searchThenStub = mock.FoodItemSearch.then;
      });

      afterEach(function afterEach() {
        mock.req.query.name = undefined;
      });

      it('should search for `foodItemName` and called `FoodItemSearch.search` with correct parameter', function test() {
        FoodItemController.query(mock.req, mock.res);
        expect(searchStub.calledWith(data.foodItemName)).to.be.true;
      });

      it('should respond 200 with correct reponse data when `FoodItemSearch.search` return list `foodItem` successfully', function test() {
        var expectedResponse = [{
          foodId : data.listFoodItem[0]._source.foodId,
          name : data.listFoodItem[0]._source.name
        }, {
          foodId : data.listFoodItem[1]._source.foodId,
          name : data.listFoodItem[1]._source.name
        }];

        var searchResultMock = {
          hits : {
            hits : data.listFoodItem
          }
        };

        FoodItemController.query(mock.req, mock.res);
        
        // invoke success callback
        searchThenStub.callArgWith(0, searchResultMock);
        expect(resStatusStub.calledWith(200)).to.be.true;
        expect(resJsonStub.calledWith(expectedResponse)).to.be.true;
      });

      it('should respond 500 if `FoodItemSearch.search` throw any errors', function test() {
        FoodItemController.query(mock.req, mock.res);

        // invoke error callback
        searchThenStub.callArg(1);
        expect(resStatusStub.calledWith(500)).to.be.true;
        expect(resJsonStub.calledWith({})).to.be.true;
      });
    });
	});
  
  //----------------- GET
  describe('{ method:get }', function desc() {
    beforeEach(function beforeEach() {
      resViewStub = mock.res.view;
    });

    it('should get the correct foodItem page when this method is invoked', function test() {
      FoodItemController.get(mock.req, mock.res);
      expect(resViewStub.calledWith('addfooditem')).to.be.true;
    });
  }); 

  //------------------ INSERT
  describe('{ method:insert }', function desc() {
    beforeEach(function beforeEach() {
      insertStub = mock.FoodItemModel.insert;
      mock.req.body = data.foodItem;
    });

    afterEach(function afterEach() {
      mock.req.body = undefined;
    });

    it('should call `FoodItemModel.insert` with correct parameter', function test() {
      var expectedData = {
        foodId : data.foodItem.foodId,
        company : data.foodItem.companyname,
        name : data.foodItem.foodname,
        nutrition : {
          "Calories" : data.foodItem.calories,
          "Sodium" : data.foodItem.sodium,
          "Total Fat" : data.foodItem.totalfat,
          "Potassium" : data.foodItem.potassium,
          "Saturated" : data.foodItem.saturated,
          "Total Carbs" : data.foodItem.totalcarbs,
          "Polyunsaturated" : data.foodItem.polyun,
          "Dietary Fiber" : data.foodItem.dietfiber,
          "Monounsaturated" : data.foodItem.monoun,
          "Sugars" : data.foodItem.sugar,
          "Trans" : data.foodItem.trans,
          "Protein" : data.foodItem.protein,
          "Cholesterol" : data.foodItem.cholesterol
        }
      };

      FoodItemController.insert(mock.req, mock.res);
      expect(insertStub.calledWith(expectedData)).to.be.true;
    });

    it('should respond 200 if `FoodItemModel.insert` return successfully', function test() {
      FoodItemController.insert(mock.req, mock.res);

      // invoke success callback
      insertStub.callArg(2);
      expect(resStatusStub.calledWith(200)).to.be.true;
      expect(resJsonStub.calledWith({})).to.be.true;
    });

    it('should respond 400 if `FoodItemModel.insert` throws any errors', function test() {
      FoodItemController.insert(mock.req, mock.res);

      // invoke error callback
      insertStub.callArg(1);
      expect(resStatusStub.calledWith(400)).to.be.true;
      expect(resJsonStub.calledWith({})).to.be.true;
    });    
  });
});