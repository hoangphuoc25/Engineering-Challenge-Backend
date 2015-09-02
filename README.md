# Backend-Developer-Challenge

`version 1.0`
`challenge status: open`

Welcome! We've been expecting you. Holmusk is a big data based high tech company specializing in healthcare in Singapore. 

If you're someone who bleeds code and aches to make a difference in the world, then you are at the right place. You will be part of a world‑class team working on the most exciting ground‑breaking technology in an inspiring and collaborative environment.

####Javascript in this document usually means node.js

## Basics

This is the Holmusk backend developer challenge. The rules of the challenge are very simple and are as follows

* You are required to code in javascript
* You will be able to submit the challenge anytime you are ready provided the challenge is still open
* Your code should be neatly commented
* You are required to fork this repo and submit a pull request
* If you wish to not make public, your submission, please complete the code in your local repository and email a patch file to careers@holmusk.com
* Please note that you will also be judged on the elegance of your code, level of abstraction and technical skills presented in the implementation. For more details, refer to the Judging Criteria section below.

## The Challenge 

### What You'll need to build
* You'll need to build a scraper, that will scrape myfitnesspal's foods and store them in a database.   
(e.g [MyFitnessPal Food](http://www.myfitnesspal.com/food/calories/179990009) )
* You will then need to provide an endpoint using [SailsJS](http://sailsjs.com) to provide autocomplete data for queries. 
* Using a food id sent to the frontend using the autocomplete request. There should be an endpoint for to show us the nutritional information of the particular food.
* Also write tests (for example with Mocha, Sinon...)
 

### Bits and Pieces to take note of

#### Scraper
* the scraper can be written in any language (Bonus points for being written in javascript! :D)  
* the scraper should store - 
	* Food Name
	* Food Company (if available)
	* All nutritional information provided in the [nutritional table](http://puu.sh/hExfZ/611b665ef4.png).

	
#### API
* You have to build an end point to accept a query, q, which will return the 10 foods (return only name and "food_id") with the most similar name.[See: Autocomplete](http://en.wikipedia.org/wiki/Autocomplete)  
The end point should return the food titles in JSON format
* You will have to also build an api endpoint to then retrive the nutritional information for a given food id.
* There should also be an endpoint to manually insert data into the database.

### Autocomplete
* The autocomplete must use one of the state of the art technologies (e.g. Elastic search)

### Testing
* Write both integration & unit tests, especially the code for scrapping food data

## Judging Criteria 
* What you have produced will determine your final outcome. You will be scored based upon your coding style and the ability to follow "good code" [See: Google Javascript Guidelines](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* More than your ability to code we want to see your ability to learn. So you are encouraged to ask questions. [Shubham](mailto:shubham.goyal@holmusk.com) or [Manak](mailto:manak.kapoor@holmusk.com)
