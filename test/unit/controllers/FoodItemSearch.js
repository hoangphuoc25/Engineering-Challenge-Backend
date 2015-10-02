'use strict';
var proxyquire = require('proxyquire');
var mock = require('../mock/mock');
var expect = require('chai').expect;
var sinon = require('sinon');
var FoodItemSearch = proxyquire
  .noCallThru()
  .load('./../../../api/controllers/FoodItemSearch', {
    'elasticsearch' : mock.elasticsearch
  });

describe('[ Unit FoodItemSearch ]', function desc() {
  var searchSpy = mock.elasticsearch.search;
  var data = {
    itemName : 'test_fooditem'
  };

  describe('{ method:search }', function desc() {
    it('should call `client.search` with correct parameter', function test() {
      var expectedData = {
        index : 'phuoc_2',
        type : 'fooditem',
        body : {
          query : {
            match : {
              name : data.itemName
            }
          }
        }
      };

      FoodItemSearch.search(data.itemName);
      expect(searchSpy.calledWith(expectedData)).to.be.true;
    });
  });
});