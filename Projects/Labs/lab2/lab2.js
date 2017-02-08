$(document).ready(function() {
	//Open Weather Map API Key
	var api_key = "739921e16247cd294ae24e8b96d69ba7";
	var latitude;
	var longitude;
	var weather_strings = Array();
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

	  //open weather map api call to get current weather data
	  var weather_query = 'http://api.openweathermap.org/data/2.5/weather?';
	  weather_query +=  'lat=' + latitude + '&lon=' + longitude + '&units=imperial&';
	  weather_query += 'appid=' + api_key;
	  var weather_data = $.getJSON(weather_query, function(data) {
	  	$("#today h3").append(data.name + ":");
	  	$("#today").append("<ul><li><i class='wi wi-fw wi-owm-" + data.weather[0].id + "'></i></li></ul>");
	  	$("#today").append("<ul id='loc'></ul>");
	  	$("#loc").append("<li>Current Temp: " + data.main.temp + '&#8457;</li>');
	  	$("#loc").append("<li>Today's High: " + data.main.temp_max + '&#8457;</li>');
	  	$("#loc").append("<li>Today's Low: " + data.main.temp_min + '&#8457;</li>');

	  	console.log(data);

	  	//stores 2 sets of data: [0] = temperatures, [1] = other data
	  	weather_strings.push($("#loc").html());
	  	//console.log(weather_strings[0]);
	  	var other_string = "<li>" + data.weather[0].description + "</li>";
	  	other_string += "<li>Cloudiness: " + data.clouds.all + "%</li>";
	  	other_string += "<li>Wind Speed: " + data.wind.speed + "mph</li>";
	  	weather_strings.push(other_string);
	  });

	  var i = 0;
	  //set the 3 second interval to replace content
	  var timer = setInterval(function() {
		//transitions
		$("#loc").hide( "drop", {direction: "down"}, 150 );
		$("#loc").show( "drop", {direction: "up"}, 150 );
		//change HTML in the middle of transition
		i += 1;
		var timeout = setTimeout(function() {
			if (i % 2 == 0) {
				$("#loc").html(weather_strings[0]);
			}
			else {
				$("#loc").html(weather_strings[1]);
			}
		}, 100);

		//stop after 90 changes
		if(i >= 90) {
			clearInterval(timer);
		}
	}, 3000);

	//api call to get 5 day forecast
	var forecast_query = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
	forecast_query +=  'lat=' + latitude + '&lon=' + longitude + '&units=imperial&cnt=5&';
	forecast_query += 'appid=' + api_key;
	var weather_data = $.getJSON(forecast_query, function(data) {

	 	for(var i = 0; i < 5; i++) {
	  		$("#fiveday").append('<div class="col-md-2 col-sm-6 hero-feature" id="day'+i+'">');
	  		$("#day"+i).append("<ul></ul>")
	  		var day = data.list[i];
	  		$("#day"+i+" ul").append("<li><i class='wi wi-fw wi-owm-" + day.weather[0].id + "'></i></li>");
	  		$("#day"+i+" ul").append("<li>High: " + day.temp.max + "&#8457;</li>");
	  		$("#day"+i+" ul").append("<li>Low: " + day.temp.min + "&#8457;</li>");
	  		$("#day"+i+" ul").append("<li>" + day.weather[0].description + "</li>");
	  		$("#day"+i).append("</div>")

	  	}
	  	console.log(data);
	  });
	  
	  //$("#loc").innerHTML += "Current: " + weather_data.main.temp + '&deg;F<br/>';

	}



});


