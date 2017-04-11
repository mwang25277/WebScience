Overall, this lab was fairly simple. Node and Express are pretty cool, and using npm twitter was fairly easy.

After user inputs the query and count, I send the POST request with the data to the server. The server GETS the tweets
depending if the query string is empty or not. The server sends the tweets back, and the tweets are output to the page
using Bootstrap Panels, similar to how I did lab 1. For the output file, I just stringify the JSON, and use .writeFile()

To run, use "npm install" then "npm start".