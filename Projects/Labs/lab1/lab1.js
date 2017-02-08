//TwitterUser class to store user data
class TwitterUser {
	constructor(user, tweet, imgUrl) {
		this.user = user;
		this.tweet = tweet;
		this.imgUrl = imgUrl;
	}

	//accessor functions
	getUser() {
		return this.user;
	}

	getTweet() {
		return this.tweet;
	}

	getImgUrl() {
		return this.imgUrl;
	}
}

$(document).ready(function() {
	var users = Array(); //array of TwitterUsers
	var imgs = 0;
	$.ajax({ //use ajax to parse and store json into users Array
		url: "TwitterTweets17.json",
		dataType: "json",
		async: false,
		success: function(data) {
			for(var i = 0; i < data.length; i++) {
				if(data[i].text != null) { //skip undefined tweets
					var name = data[i].user.screen_name;
					var tweet = data[i].text;
					var imgUrl = null;
					if(data[i].entities.media != undefined) {
						//console.log(data[i].entities.media);
						imgs++;
						imgUrl = data[i].entities.media[0].media_url;
					}
					users.push(new TwitterUser(name, tweet, imgUrl));
				}
			}
		}
	});

	//preload the first 5 users' info
	var i = 1;
	for(var x = 1; x < 6; x++) { //loop for each of the next 5 users
		document.getElementById("user" + x).innerHTML = "@" + users[i].getUser() + ":";
		document.getElementById("tweet" + x).innerHTML = users[i].getTweet();
		i++;
	}

	//preload the first 5 images
	var x = 1;
	i = 1;
	while (i < users.length) {
		if(users[i].getImgUrl() != null) {
			imgStr = '<img src="' + users[i].getImgUrl() + 
			         '" class="img-thumbnail img-responsive" alt="">';
			//console.log(imgStr);
			document.getElementById("img" + x).innerHTML = imgStr;
			x++;
			//if we found 5 images
			if(x == 6) {
				break;
			}
		}
		i++;
	}

	//function to replace user/tweet
	var fillHtml = function(users, i) {
		var x = 1;

		while(x < 6) { //loop for each of the next 5 users
			document.getElementById("user" + x).innerHTML = "@" + users[i].getUser() + ":";
			document.getElementById("tweet" + x).innerHTML = users[i].getTweet();
			x++;
			i++;
		}
	}

	//function to replace images
	var fillImgs = function(users, i) {
		var x = 1;
		while (i < users.length) {
			if(users[i].getImgUrl() != null) {
				imgStr = '<img src="' + users[i].getImgUrl() + 
						 '" class="img-thumbnail img-responsive" alt="">';
				//console.log(imgStr);
				document.getElementById("img" + x).innerHTML = imgStr;
				x++;
				if(x == 6) {
					break;
				}
			}
			i++;
			//so it keeps going in an endless cycle
			if(i == users.length) {
				i = 0;
			}
		}
		return i;

	}

	//set the 3 second interval to replace content
	var timer = setInterval(function() {
		//transitions
		for(var x = 1; x < 6; x++) {
			if(x % 2 == 0) {
				$("#panel" + x).hide( "drop", {direction: "down"}, 150 );
				$("#panel" + x).show( "drop", {direction: "up"}, 150 );
			}
			else {
				$("#panel" + x).hide( "drop", {direction: "up"}, 150 );
				$("#panel" + x).show( "drop", {direction: "down"}, 150 );
			}
		}
		//change HTML in the middle of transition
		var timeout = setTimeout(function() {
			fillHtml(users, i)
		}, 200);
		i += 5;

		//if at the end of users array, stop the interval
		if(i >= 90) {
			clearInterval(timer);
		}
	}, 3000);

	var x = 5;
	//5 second interval for images since there are only 14
	var timer2 = setInterval(function() {
		//sorry if this is bad coding style, i tried the for loop below but it didn't work
		// var timer = 4800;
		// for(var num = 1; num < 6; num++) {
		// 	var imgTrans = setTimeout(function() {
		// 		$("#img" + num).fadeOut();
		// 		$("#img" + num).fadeIn();
		// 	}, timer);
		// 	timer+=50;
		// }

		//transitions to fade imgs one after the other
		var imgOneTrans = setTimeout(function() {
			$("#img1").fadeOut();
			$("#img1").fadeIn();
		}, 0);
		var imgTwoTrans = setTimeout(function() {
			$("#img2").fadeOut();
			$("#img2").fadeIn();
		}, 50);

		var imgThreeTrans = setTimeout(function() {
			$("#img3").fadeOut();
			$("#img3").fadeIn();
		}, 100);

		var imgFourTrans = setTimeout(function() {
			$("#img4").fadeOut();
			$("#img4").fadeIn();
		}, 150);

		var imgFiveTrans = setTimeout(function() {
			$("#img5").fadeOut();
			$("#img5").fadeIn();
		}, 200);

		var imgFill = setTimeout(function() {
			x = fillImgs(users, x+1);
		}, 150);
	}, 5000);

});


