'use strict';
var proxyquire = require('proxyquire');
var mock = require('../mock/mock');
var expect = require('chai').expect;
var sinon = require('sinon');
var FoodItemModel = proxyquire
  .noCallThru()
  .load('./../../../api/controllers/FoodItemModel', {
    'mongojs' : mock.mongojs.func
  });

describe('[ Unit FoodItemModel ]', function desc() {
  var dbStub;
  var insertStub;
  var findOneStub;
  var callbackFailSpy;
  var callbackSuccessSpy;
  var data = { 
    foodItem : {
      foodId : 'test_foodid',
      company : 'robert',
      name : 'pork type 3',
      nutrition : {
        "Calories" : '0',
        "Sodium" : '0',
        "Total Fat" : '0',
        "Potassium" : '0',
        "Saturated" : '0',
        "Total Carbs" : '0',
        "Polyunsaturated" : '0',
        "Dietary Fiber" : '0',
        "Monounsaturated" : '0',
        "Sugars" : '0',
        "Trans" : '0',
        "Protein" : '0',
        "Cholesterol" : '0'
      }
    },

    error : new Error()   
  };

  beforeEach(function beforeEach() {
    callbackFailSpy = sinon.spy();
    callbackSuccessSpy = sinon.spy();
    dbStub = mock.mongojs.db;
  });

  describe('{ method:insert }', function desc() {
    beforeEach(function beforeEach() {
      insertStub = sinon.stub();

      // mock db object in module
      dbStub.fooditem = {
        insert : insertStub
      }
    });

    afterEach(function afterEach() {
      dbStub.fooditem = undefined;
      delete dbStub.fooditem;
    });

    it('should call `db.fooditem.insert` with correct parameter', function test() {
      FoodItemModel.insert(data.foodItem);
      expect(insertStub.calledWith(data.foodItem)).to.be.true;
    });

    it('should invoke success callback when `db.fooditem.insert` returns successfully', function test() {
      FoodItemModel.insert(data.foodItem, callbackFailSpy, callbackSuccessSpy);
      insertStub.callArgWith(1, null);
      expect(callbackSuccessSpy.calledOnce).to.be.true;
      expect(callbackFailSpy.called).to.not.be.true;
    });

    it('should invoke error callback when `db.fooditem.insert` throws error', function test() {
      FoodItemModel.insert(data.foodItem, callbackFailSpy, callbackSuccessSpy);
      insertStub.callArgWith(1, data.error, null);
      expect(callbackFailSpy.calledOnce).to.be.true;
      expect(callbackSuccessSpy.called).to.not.be.true;
    });
  });

  describe('{ method:getById }', function desc() {
    beforeEach(function beforeEach() {
      findOneStub = sinon.stub();

      // mock db object in module
      dbStub.fooditem = {
        findOne : findOneStub
      }
    });

    afterEach(function afterEach() {
      dbStub.fooditem = undefined;
      delete dbStub.fooditem;
    });

    it('should call `db.fooditem.findOne` with correct parameter', function test() {
      FoodItemModel.getById(data.foodItem.foodId);
      expect(findOneStub.calledWith({foodId : data.foodItem.foodId})).to.be.true;
    });

    it('should invoke success callback with correct data response when `db.fooditem.findOne` returns successfully', function test() {
      FoodItemModel.getById(data.foodItem.foodId, callbackFailSpy, callbackSuccessSpy);
      findOneStub.callArgWith(1, null, data.foodItem);
      expect(callbackSuccessSpy.calledOnce).to.be.true;

      // called with correct data
      expect(callbackSuccessSpy.calledWith(data.foodItem.nutrition)).to.be.true;
      expect(callbackFailSpy.called).to.not.be.true;
    });

    it('should invoke error callback when `db.fooditem.findOne` throws error', function test() {
      FoodItemModel.getById(data.foodItem.foodId, callbackFailSpy, callbackSuccessSpy);
      findOneStub.callArgWith(1, data.error, null);
      expect(callbackFailSpy.calledOnce).to.be.true;
      expect(callbackSuccessSpy.called).to.not.be.true;
    });
  });
});