var request = require('supertest');

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
});