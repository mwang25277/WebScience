// server init + mods
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);

var json2csv = require('json2csv');

//used to parse request data
//https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var Twit = require('twit');

app.use(express.static(__dirname));

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/lab6.html');
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

//lab 5
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
	client.get("/search/tweets", params, function(error, tweets, response) {
		if(!error) {
			//console.log(tweets.statuses);
			//output to file
			//http://gyandeeps.com/json-file-write/
			var json = JSON.stringify(tweets.statuses, null, 2);
			fs.writeFile('wangm13-tweets.json', json, function(err) {
				if(!err) {
					console.log("Created wangm13-tweets.json successfully.");
				}
				else {
					console.log("Failed to write to file.");
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


//lab 6
app.post('/exportTweets', function(req, res){
	//console.log(req.body.query);
	var query;
	var count = req.body.count;
	var filetype = req.body.format;
	var filename = req.body.filename + "." + filetype;
	//console.log(filename);
	//if no query is given, search around RPI area
	if(req.body.query == "" || req.body.query == null) {
		console.log("Empty query");
		twitStream = client.stream('statuses/filter', {locations: "42.73,-73.67"});
	}
	else {
		query = req.body.query;
	}

	//start stream
	var twitStream = client.stream('statuses/filter', {track: query});
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
			var parsedTweets = [];

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
				parsedTweets.push(parsed);
			}

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
			else {
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
			
			res.send(tweets);
		}
	});
	twitStream.on('error', function(error) {
	  console.log(error);
	});


});
