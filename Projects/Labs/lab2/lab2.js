$(document).ready(function() {
	var api_key = "739921e16247cd294ae24e8b96d69ba7";
	var latitude;
	var longitude;

	if (navigator.geolocation)
	{
	  // Get the user's location
	  navigator.geolocation.getCurrentPosition(displayLocation);
	}
	// Display message if user's browswer doesn't support geolocation
	else {
	  $("#loc").html("Your browswer does not support geolocation.");
	}
	function displayLocation(position) {
	  // Place coordinates in the p element with ID 'usersLocation'
	  // which replaces the HTML of the element
	  //$("#usersLocation").html("Latitude: " + position.coords.latitude + "<br />Longitude: " + position.coords.Longitude);
	  latitude = position.coords.latitude;
	  longitude = position.coords.longitude;

	  var query_string = 'http://api.openweathermap.org/data/2.5/weather?';
	  query_string +=  'lat=' + latitude + '&lon=' + longitude + '&units=imperial&';
	  query_string += 'appid=' + api_key;
	  var weather_data = $.getJSON(query_string, function(data) {
	  	$("#loc").append("Weather For: " + data.main.temp + '<br/>');
	  	console.log(data);
	  });
	  
	  //$("#loc").innerHTML += "Current: " + weather_data.main.temp + '&deg;F<br/>';

	}



});


