/**
 * SleepController
 *
 * @description :: Server-side logic for managing sleeps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		var params = req.params.all();
		console.log(params);
		Sleep.create(params, function(err, sleep) {
			if (err) 
				return next(err);
			res.status(200);
			res.json(sleep);
		});
	},
	find: function(req, res, next) {
		var id = req.param('id');
		var idShortcut = isShortcut(id);
		if (idShortcut === true) {
			return next();
		}
		if (id) {
			Sleep.findOne(id, function(err, sleep) {
				if (sleep === undefined) return res.notFound();
				if (err) return next(err);
				res.json(sleep);
			});
		} else {
			var where = req.param('where');
			if (_.isString(where)) {
				where = JSON.parse(where);
			}
			var options = {
				limit: req.param('limit') || undefined,
				skip: req.param('skip') || undefined,
				sort: req.param('sort') || undefined,
				where: 'where' || undefined
			};
			console.log('This is the options: ', options);
			Sleep.find(options, function(err, sleep) {

				if (sleep === undefined) return res.notFound();
				if (err) return next(err);
				res.json(sleep);
			});
		}

		function isShortcut(id) {
			if (id === 'find' || id === 'update' || id === 'create' || id === 'destroy') {
				return true
			}
		}
	},
	update: function(req, res, next) {
		var criteria = {};
		criteria = _.merge({}, req.params.all(), req.body);
		console.log(criteria);

		var id = req.param('id');
		console.log(id);
		if (!id) {
			return res.badRequest('No id provided');
		}
		Sleep.update(id, criteria, function(err, sleep) {
			if (sleep.length === 0) return res.notFound();
			if (err) return next(err);
			res.json(sleep);
		});
	},
	destroy: function(req, res, next) {
		var id = req.param('id');
		if (!id) {
			return res.badRequest('No id provided');
		}
		console.log('id ', id);

		Sleep.findOne({id: id}).exec(function(err, result) {
			if (err) {
				console.log('error detected');
				return res.serverError(err);
			}
			console.log(result);
			if (!result) return res.notFound();
			Sleep.destroy({id: id}).exec(function(err) {
				if (err) {
					console.log('error delete');
					return next(err);
				}
				return res.json(result);
			});
		});
	}
};
