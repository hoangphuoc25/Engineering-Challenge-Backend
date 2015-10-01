module.exports = {

	// mock some objects for testing
	req : {
		query : {},
		body : {}
	},

	res : {
		status : function() {
			return this;
		},

		json : function() {
			return this;
		}
	},

	FoodItemModel : {
		insert : function insert() {
			return this;
		},

		then : function then() {
			return this;
		}
	},

	FoodItemSearch : {
		search : function search() {

		}
	}
}