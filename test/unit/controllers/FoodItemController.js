/*
describe('FooditemController', function() {

  describe('#login()', function() {
    it('should redirect to /mypage', function (done) {
      request(sails.hooks.http.app)
        .post('/fooditem/insert')
        .send({ foodId: '123456789',
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
			  tran: '0',
			  protein: '0',
			  cholesterol: '0' })
        .expect(200)
        .expect('location','/mypage', done);
    });
  });
});*/
var proxyquire = require('proxyquire');
var mock = require('../mock/mock');
var expect = require('chai').expect;
var sinon = require('sinon');
var FoodItemController = proxyquire
	.noCallThru()
	.load('./../../../api/controllers/FooditemController', {
		'FoodItem' : mock.FoodItemModel,
		'FoodItemSearch' : mock.FoodItemSearch
	});

describe('Unit FooditemController', function desc() {
	describe('method:query', function desc() {
		var searchStub;
		var thenStub;
		var data = {
			name : 'testName',
			searchResult : {
				hits : {
					hits : []
				}
			}
		}

		beforeEach(function beforeEach() {
			searchStub = sinon.stub(mock.FoodItemSearch, 'search').returnThis();
			thenStub = sinon.stub(mock.FoodItemSearch, 'then');
			mock.req.query.name = data.name;
		});

		it('should call `FoodItemSearch.search` with correct parameter', function test() {
			FooditemController.query(mock.req, mock.res);
			expect(searchStub.calledWith(data.name)).to.equal(true); 
		});

		it('should respond 200 if `FoodItemSearch.search` retrieves data successfully', function test() {	
			FooditemController.query(mock.req, mock.res);
			expect();
		});
	});
});