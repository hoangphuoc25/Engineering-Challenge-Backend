var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
});

module.exports = {
	search : function search(itemName) {
		return client.search({
			index: 'phuoc_2',
			type: 'fooditem',
			body: {
				query: {
				  	match: {
				    	name: itemName
				  	}
				}
			}
		});
	}
} 
