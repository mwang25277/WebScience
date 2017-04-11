I DIDN'T FORGET THE README.

I prepared a bit before the quiz and got my server running, so I just used the default index.js, and not Quiz1Server. Sorry.

The server stuff is pretty simple, just listened on port 3000 and served the index.html file. The only package necessary is Express.
For the weather portion, I used the Open Weather Map API as I did in lab2. When the Run button is clicked, I use jQuery's .getJSON to get the data, and jQuery
selectors to modify the html and text color of the output. I use ng-model to store the zip and ng-show to display the refresh button.

To run, "npm install" then "npm start" should do the trick (hopefully)?.