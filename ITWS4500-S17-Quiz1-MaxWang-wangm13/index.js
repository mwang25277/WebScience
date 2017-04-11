// server init + mods
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static(__dirname));

// server route handler
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function() {
	console.log("Listening");
});
