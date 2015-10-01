/**
* Sleep.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: 'mysql',
  attributes: {
  	id: {type: 'integer', primaryKey: true, autoIncrement: true},
  	slept_hours: {type: 'string'},
  	sleep_quality: {type: 'string'}
  }
};

