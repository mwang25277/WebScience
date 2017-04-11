// server init + mods
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

var json2csv = require('json2csv');

var builder = require('xmlbuilder'); //https://github.com/oozcitak/xmlbuilder-js

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
//mongod --dbpath=/data --port 27017


//used to parse request data
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Twit = require('twit');

app.use(express.static(__dirname));

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/lab7.html');
});


var client = new Twit({
  consumer_key:         'phZb3wdglG0hGTL6HVBiOq6JJ',
  consumer_secret:      'M1AdQ83jODtgcdZoOB5WuNXK66Z6DD2UMVBKntmEoS0KOkGfeT',
  access_token:         '308847496-0nbJ35KiHNjMrK76NIBVZQWdtOQ3TGT4p3RS08bz',
  access_token_secret:  '8FUrTIhSoRHkPaMOYin7SrMKYRYGqnn7HZyEf8QtGqKOu',
  //timeout_ms:           100*1000,  // optional HTTP request timeout to apply to all requests. 
})


http.listen(3000, function() {
	console.log("Listening");
});

//gets twitter data and stores tweets into database
app.post('/getData', function(req, res){
	//console.log(req.body.query);
	//parse request
	var query = req.body.query;
	var count = req.body.count;
	var filetype = req.body.format;
	var filename = req.body.filename + "." + filetype;
	var twitStream;

	//start stream
	twitStream = client.stream('statuses/filter', {track: query});
	
    var counter = 0; //counts tweets received
    var tweets = [];

    //when a tweet is received
	twitStream.on('tweet', function(tweet) {
		counter++;
		io.emit('count', counter);
		tweets.push(tweet);

		//when enough tweets are received
		if(counter >= count) {
			counter = 0;
			twitStream.stop(); //stop stream

			// Connect to the db
			MongoClient.connect("mongodb://localhost:27017/lab7", function(err, db) {
			  if(err) { return console.dir(err); }

			  var collection = db.collection(query);
			  collection.remove(); //remove any existing tweets
			  //parse tweets
				for(aTweet in tweets) {
					var parsed = {
						created_at: tweets[aTweet].created_at,
						id: tweets[aTweet].id,
						text: tweets[aTweet].text,
						user_id: tweets[aTweet].user.id,
						user_name: tweets[aTweet].user.name,
						user_screen_name: tweets[aTweet].user.screen_name,
						user_location: tweets[aTweet].user.location,
						user_followers_count: tweets[aTweet].user.followers_count,
						user_friends_count: tweets[aTweet].user.friends_count,
						user_created_at: tweets[aTweet].user.created_at,
						user_time_zone: tweets[aTweet].user.time_zone,
						user_profile_background_color: tweets[aTweet].user.profile_background_color,
						user_profile_image_url: tweets[aTweet].user.profile_image_url,
						geo: tweets[aTweet].geo,
						coordinates: tweets[aTweet].coordinates,
						place: tweets[aTweet].place
					}
					collection.insert(parsed);
				}
			});

			//res.send(tweets);
			console.log("Finished creating database");
			res.send("Finished creating database");
			io.emit('msg', "Finished creating database");
		}
	});
	twitStream.on('error', function(error) {
	  console.log(error);
	});


});

//displays tweets from the collection with the same string as the query
app.post("/readData", function(req, res) {
	
	var query = req.body.query;
	//connect to the db
	MongoClient.connect("mongodb://localhost:27017/lab7", function(err, db) {
	  if(err) { return console.dir(err); }
	  console.log("Read Data: Connected to database");

	  //error handling: check if name exists or if there are any collections
	  var collectionNames = [];
	   db.listCollections().toArray(function(err, collections) {
	   	if(!err) {
	   		//get all collection names
	  		for(var i = 0; i < collections.length; i++) {
	  			collectionNames.push(collections[i].name);
	  			console.log(collections[i].name);
	  		}

	  		if(collectionNames.length == 0) {
			  	console.log("Empty");
			  	io.emit('msg', "No collections created yet. Please enter a query and click Get Data.");
			  	//res.send(null);
			  	return;
			}

			//console.log(collectionNames);
			var collection;
			//if query is empty, just use the first name as the collection
			if(query == "" || query == undefined) {
				collection = db.collection(collectionNames[0]);
			}
			else if(collectionNames.indexOf(query) == -1) {
				io.emit('msg', "There is no collection associated with that query. Please click Get Data first.");
			    return;
			}
			else {
			    collection = db.collection(query);
			}

			//stream data from database
			var tweets = [];
			var stream = collection.find().stream();
			stream.on("data", function(item) {
			    tweets.push(item);
			});
			stream.on("end", function() {
			    res.send(tweets);
			});
	   	  }
	   });
	});
});

app.post("/exportData", function(req, res) {
	
	var query = req.body.query;
	var filetype = req.body.format;
	var filename = req.body.filename + "." + filetype;
	var collection;
	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/lab7", function(err, db) {
	  if(err) { return console.dir(err); }
	  var collectionNames = [];
	  //same error handling as above
	  db.listCollections().toArray(function(err, collections) {
	   	if(!err) {
	      for(var i = 0; i < collections.length; i++) {
	  		collectionNames.push(collections[i].name);
	  		//console.log(collections[i].name);
	  	  }

	  	  if(collectionNames.length == 0) {
		   	console.log("Empty");
			io.emit('msg', "No collections created yet. Please enter a query and click Get Data.");
			//res.send(null);
			return;
		  }
		  if(collectionNames.indexOf(query) == -1) {
		    io.emit('msg', "There is no collection associated with that query. Please click Get Data first.");
			return;
		  }
		  else {
		    collection = db.collection(query);
		  }
		  var stream = collection.find().stream();
		  var parsedTweets = [];
	  
		  stream.on("data", function(item) {
		  	parsedTweets.push(item);
		  });
		  stream.on("end", function() {
		  	//check filetype
			if(filetype == "json") {
				var json = JSON.stringify(parsedTweets, null, 2);

				///check if file exists
				if(fs.existsSync(filename)) {
					console.log("Overwriting " + filename);
					io.emit('msg', "Overwriting " + filename);
				}

				//write to file
				fs.writeFile(filename, json, function(err) {
					if(!err) {
						console.log("Created " + filename + " successfully.");
						io.emit('msg', "Created " + filename + " successfully.");
					}
					else {
						console.log("Failed to write to file.");
					}
				});
			}
			else if(filetype =="csv"){
				//https://www.npmjs.com/package/json2csv
				var fields = [ "created_at",
					"id",
					"text",
					"user_id",
					"user_name",
					"user_screen_name",
					"user_location",
					"user_followers_count",
					"user_friends_count",
					"user_created_at",
					"user_time_zone",
					"user_profile_background_color",
					"user_profile_image_url",
					"geo",
					"coordinates",
					"place" ];
				var csv = json2csv({ data: parsedTweets, fields: fields});
				if(fs.existsSync(filename)) {
					console.log("Successfully overwrote " + filename);
					io.emit('msg', "Successfully overwrote " + filename);
				}
				fs.writeFile(filename, csv, function(err) {
					if(!err) {
						console.log("Created " + filename + " successfully.");
						io.emit('msg', "Created " + filename + " successfully.");	
					}
					else {
						console.log("Failed to write to file.");
					}
				});
			}
			else { //xml
				var xmlRoot = builder.create("tweets", {allowSurrogateChars: true});
				for(aTweet in parsedTweets) {
					var tweet = xmlRoot.ele("tweet");
					tweet.ele("created_at", parsedTweets[aTweet].created_at);
					tweet.ele("id", parsedTweets[aTweet].id);
					tweet.ele("text", parsedTweets[aTweet].text);
					tweet.ele("user_id", parsedTweets[aTweet].user_id);
					tweet.ele("user_name", parsedTweets[aTweet].user_name);
					tweet.ele("user_screen_name", parsedTweets[aTweet].user_screen_name);
					tweet.ele("user_location", parsedTweets[aTweet].user_location);
					tweet.ele("user_followers_count", parsedTweets[aTweet].user_followers_count);
					tweet.ele("user_friends_count", parsedTweets[aTweet].user_friends_count);
					tweet.ele("user_created_at", parsedTweets[aTweet].user_created_at);
					tweet.ele("user_time_zone", parsedTweets[aTweet].user_time_zone);
					tweet.ele("user_profile_background_color", parsedTweets[aTweet].user_profile_background_color);
					tweet.ele("user_profile_image_url", parsedTweets[aTweet].user_profile_image_url);
					tweet.ele("geo", parsedTweets[aTweet].geo);
					tweet.ele("coordinates", parsedTweets[aTweet].coordinates);
					tweet.ele("place", parsedTweets[aTweet].place);
					tweet.end({pretty: true});
				}
				xmlRoot.end({pretty: true});

				if(fs.existsSync(filename)) {
					console.log("Successfully overwrote " + filename);
					io.emit('msg', "Successfully overwrote " + filename);
				}
				fs.writeFile(filename, xmlRoot, function(err) {
					if(!err) {
						console.log("Created " + filename + " successfully.");
						io.emit('msg', "Created " + filename + " successfully.");	
					}
					else {
						console.log("Failed to write to file.");
					}
				});

				//res.send(xmlRoot);
			}
		  });
		}
	  });
	  
	});
});





			