// server init + mods
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');

//used to parse request data
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Twitter = require('twitter');

app.use(express.static(__dirname));

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/lab5.html');
});

http.listen(3000, function() {
	console.log("Listening");
});

var client = new Twitter({
	consumer_key: 'phZb3wdglG0hGTL6HVBiOq6JJ',
	consumer_secret: 'M1AdQ83jODtgcdZoOB5WuNXK66Z6DD2UMVBKntmEoS0KOkGfeT',
  	access_token_key: '308847496-0nbJ35KiHNjMrK76NIBVZQWdtOQ3TGT4p3RS08bz',
 	access_token_secret: '8FUrTIhSoRHkPaMOYin7SrMKYRYGqnn7HZyEf8QtGqKOu'
});

app.post('/tweets', function(req, res){
	//console.log(req.body.query);
	var params;
	//if no query is given, search around RPI area
	if(req.body.query == "" || req.body.query == null) {
		console.log("Empty query");
		params = { q: "", count: req.body.count, geocode: "42.73,-73.67,2mi" };
	}
	else {
		params = { q: req.body.query, count: req.body.count };
	}
	client.get("/search/tweets.json?", params, function(error, tweets, response) {
		if(!error) {
			//console.log(tweets.statuses);
			//output to file
			//http://gyandeeps.com/json-file-write/
			var json = JSON.stringify(tweets.statuses, null, 2);
			fs.writeFile('wangm13-tweets.json', json, function(err) {
				if(!err) {
					console.log("Created wangm13-tweets.json successfully.")
				}
				else {
					console.log("Failed to write to file.")
				}
			});

			//send the response
			res.send(tweets.statuses);
		}
		else {
			console.log("Error getting tweets");
		}
	});


});
