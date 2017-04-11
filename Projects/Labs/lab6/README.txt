Q: Where would it be better to place the CSV conversion code, in the node server or in an Angular controller? Why?

It's better to place the CSV conversion code in the node server because the server-side code handles all the data manipulation/file writing. 
The Angular-side should only be displaying the data.


Comments:

Overall, this lab was fairly simple. Node and Express are pretty cool, and using npm twit was fairly easy.

I kept my lab 5 portion the same, using the Search REST API. I added the Export button and filetype input fields for lab 6, and
used the Streaming API to collect the tweets.

I tried using the jsonexport Node package to convert to CSV, but found their output for newlines to be inconsistent/incorrect.
I submitted an issue to their GitHub here: https://github.com/kauegimenes/jsonexport/issues/21 Then, I swtiched to using json2csv to get the correct output.

Made this a little more user-friendly by allowing the user to determine the filename. Before, I was just creating wangm13-tweets.json/csv every time
without any prompts about overwriting and I thought that was bad.

To inform the user, I emit messages and update the progress bar based on the number of tweets received.
BUG: I got an ngRepeat: dupes error, which I tried to fix by using "track by $index" (https://docs.angularjs.org/error/ngRepeat/dupes), but that printed duplicate messages, even though I empty the array beforehand. As a result, it is best if you refresh the page after submitting.

To run, use "npm install" then "npm start".

