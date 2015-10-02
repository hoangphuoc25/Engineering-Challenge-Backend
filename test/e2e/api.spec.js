'use strict';
var request = require('supertest');
var _ = require('lodash');
var expect = require('chai').expect;
var mongojs = require('mongojs');
var dbUrl = 'phuoc_2';
var collections = ['fooditem'];
var db = mongojs(dbUrl, collections);

describe('E2E Test', function desc() {
	describe('GET /api/fooditems?name=:name', function desc() {
		it('should get the correct data when GET fooditem `name` to server', function test(done) { 

      // get fooditem "pork" form server
      request(sails.hooks.http.app)
        .get('/api/fooditems?name=pork')
        .expect(200)
        .end(function end(err, res) {
          expect(res.body).not.to.be.empty;
          _.map(res.body, function map(item) {
            expect(item.name).to.exist;
            expect(item.name.toLowerCase()).to.contain('pork');
          });

          done();
        });
		});

    it('should get the correct data when get fooditem `id` to server', function test(done) {
      request(sails.hooks.http.app)
        .get('/api/fooditems?id=11047')
        .expect(200)
        .end(function end(err, res) {
          var responseBody = res.body;
          var expectedData = {
            "Calories": "342",
            "Sodium": "309 mg",
            "Total Fat": "8 g",
            "Potassium": "624 mg",
            "Saturated": "0 g",
            "Total Carbs": "58 g",
            "Polyunsaturated": "2 g",
            "Dietary Fiber": "8 g",
            "Monounsaturated": "4 g",
            "Sugars": "20 g",
            "Trans": "0 g",
            "Protein": "8 g",
            "Cholesterol": "1 mg",
            "Vitamin A": "11%",
            "Calcium": "43%",
            "Vitamin C": "13%",
            "Iron": "5%"
          };

          expect(res.body).to.exist;
          expect(res.body).to.deep.equal(expectedData);
          done();
        });
    });
	});

  describe('POST /api/fooditems', function desc() {
    it('should add new fooditems when POST /fooditems to server', function test(done) {
      request(sails.hooks.http.app)
        .post('/api/fooditems')
        .send({foodId : 'test_foodid', foodname : 'test_name'})
        .expect(200)
        .end(function end(err, res) {
          db.fooditem.findOne({foodId : 'test_foodid'}, function findOne(err, docs) {
            expect(docs).to.exist;;
            expect(docs.foodId).to.equal('test_foodid');
            expect(docs.name).to.equal('test_name');

            // remove records
            db.fooditem.remove({foodId : 'test_foodid'}, function remove() {
              done();
            });
          });
        });
    });
  });
});