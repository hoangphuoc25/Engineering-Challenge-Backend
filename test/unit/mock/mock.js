'use strict';
var sinon = require('sinon');
var sinonBluebird = require('sinon-bluebird');

module.exports = {

	// mock some objects for testing
	req : {
		query : {},
		body : {}
	},

	res : {
		status : sinon.stub().returnsThis(),
		json : sinon.stub().returnsThis(),
    view : sinon.stub().returnsThis()
	},

	FoodItemModel : {
		insert : sinon.stub(),
    getById : sinon.stub()
	},

	FoodItemSearch : {
		search : sinon.stub().returnsThis(),
    then : sinon.stub().returnsThis()
	},

  mongojs : {
    db : {},
    func : function func() {
      return module.exports.mongojs.db
    }
  },

  elasticsearch : {
    search : sinon.spy(),
    Client : function Client() {
      this.search = module.exports.elasticsearch.search;
    }
  },

  xray : {
    error : null,
    dataCallback : {},
    xray : sinon.stub().returns(function callback(cb) {
      cb(module.exports.xray.error, module.exports.xray.dataCallback);
    }),

    func : function() {
      return module.exports.xray.xray;
    }
  }
}