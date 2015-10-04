# Scraper:
Scraper will start searching from http://www.myfitnesspal.com/food/calorie-chart-nutrition-facts, get all popular food tags, then scrape each food tag page for a list of food items and proceed to scrape each food item page.

To run the scraper: 
	`$ node scraper/scraperStart.js`

# MongoDB setup:

* In mongo console, run:

  ```
  > use phuoc_2
  > db.fooditem.createIndex({foodId: 1}, {unique: true})
  ```

 to create a unique index on foodId, so that we don't have to check duplicated foodId in scraper logic

# Elasticsearch setup:

After we have populated data in MongoDB using the scraper:

* Install ES 1.7.2 with elasticsearch-river-mongodb and elasticsearch-mapper-attachments plugins:

	From root folder of elasticsearch:
	
	```
	$ bin/plugin --install com.github.richardwilly98.elasticsearch/elasticsearch-river-mongodb/2.0.9
	$ bin/plugin install elasticsearch/elasticsearch-mapper-attachments/2.7.0
	```
	
* Convert the MongoDB into a Replica Set:

	Modify /etc/mongod.conf, add this line at the end:

		replSet=rs0
		
	Restart mongod, in mongo console:

  ```
  > mongo phuoc_2
  > config = { "_id" : "rs0", "members" : [ { "_id" : 0, "host" : "127.0.0.1:27017" } ] }
  > rs.initiate(config)
  > rs.slaveOk()
  ```

* Start Elasticsearch: `$ bin/elasticsearch`
		
* Index the collection from MongoDB:

  ```
	$ curl -XPUT localhost:9200/_river/phuoc_2/_meta -d '
	{
	  "type": "mongodb",
	  "mongodb": {
	    "servers": [
	      { "host": "127.0.0.1", "port": 27017 }
	    ],
	    "db": "phuoc_2",
	    "collection": "fooditem",
	    "options": { "secondary_read_preference": true },
	    "gridfs": false
	  },
	  "index": {
	    "name": "phuoc_2",
	    "type": "fooditem"
	  }
	}'
	```

# API
* To search for list of items given a name:
    `http://localhost:1337/api/fooditems?name={foodname}`
* To get nutrition info of a food given foodid:
    `http://localhost:1337/api/fooditems?id={foodId}`
* To manually insert food info into database, go to:
    `http://localhost:1337/fooditems`

# Test:
* To run integration test: 
    `$ npm test`
* To run unit tests:
    `$ npm install -g mocha`
    `$ mocha test/unit/**/*.js`

# Autocomplete:
The autocomplete feature is done by searching food items by name with elasticsearch.
