To parse the JSON file, I used AJAX, since that's what I've learned to do in Intro and WebSys.
To store all the data, I decided to create a class for TwitterUsers, so instead of having 3 arrays, I only need 1.
Each TwitterUser stores their screenname, tweet text, number of followers, and any media from the tweet.

I display the user's screenname and tweet at the top of the page, and the pictures from the data set below that.
For the users' transition, I drop the odd indexed panels up, and the even ones down. For the images, I use
fading to try to make each image fade in after the previous one.