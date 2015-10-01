'use strict';
var request = require('supertest');
var _ = require('lodash');
var expect = require('chai').expect;
var mongojs = require('mongojs');
var dbUrl = 'phuoc_2';
var collections = ['fooditem'];
var db = mongojs(dbUrl, collections);

describe('E2E Test', function desc() {
	xdescribe('GET /fooditem/:fooditem', function desc() {
		it('should get the correct data when GET fooditem to server', function test(done) { 

      // get fooditem "pork" form server
      request(sails.hooks.http.app)
        .get('/fooditem/pork')
        .expect(200)
        .end(function end(err, res) {
          var responseBody = res.body;
          expect(res.body).not.to.be.empty;
          _.map(responseBody, function map(item) {
            expect(item._source.name).to.exist;
            expect(_.indexOf(item.name, 'pork')).not.to.equal(-1);
          });

          done();
        });
		});
	});

  describe('POST /fooditems', function desc() {
    it('should add new fooditems when POST /fooditems to server', function test(done) {
      request(sails.hooks.http.app)
        .post('/fooditem/insert')
        .send({foodId : 'test_foodid', foodname : 'test_name'})
        .expect(200)
        .end(function end(err, res) {
          db.fooditem.findOne({foodId : 'test_foodid'}, function findOne(err, docs) {
            expect(docs).to.exist;
            console.log(docs);
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