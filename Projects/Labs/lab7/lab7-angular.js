(function(angular) {
   'use strict';
   var app = angular.module('twitApp', []);
   app.controller('tweetCtrl', function($scope, $http, $window, $timeout) {
      //load the first images
      $scope.query = "";
      $scope.count = 10;
      $scope.data = []; //tweets
      $scope.showTweets = false; //for ng-show
      $scope.showMessages = false; //for ng-show
      $scope.filename = ""
      $scope.exportFormat = "json"; // "CSV" or "JSON"
      $scope.messages = [];
      $scope.percentDone = 0;

      var socket = io();

       //get messages sent by server
       socket.on('msg', function(msg){
          $scope.messages.push(msg);
          // console.log(msg);
          // console.log($scope.messages);
          $scope.$apply();
       });

      //get counts sent by server
       socket.on('count', function(count) {
        //console.log(count);
          $scope.percentDone = parseInt(count) / $scope.count * 100;
          $scope.$apply();
          if($scope.percentDone >= 100) {
            $scope.showTweets = true;
            $scope.messages.push("Finished loading tweets!");
          }
       });

      //send post request to get the tweets from API and store them in the database
      $scope.getData = function() {
       delete($scope.messages);
       $scope.messages = [];
       $scope.percentDone = 0;
       $scope.showMessages = true;
       if($scope.query == "" || $scope.query == undefined) {
        $scope.messages.push("Empty query! Please enter a query before clicking Get Data");
       }
       else if($scope.count <= 0) {
          $scope.messages.push("Count must be greater than 0!");
       }
       else {
         $scope.messages.push("Storing " + $scope.count + " tweets about " + $scope.query + " to the database...");
          //send the post request with query and count
         $http.post("/getData", { query: $scope.query, count: $scope.count }).then(function(response) {
             //console.log(response);
         });
       }
      };

      $scope.readData = function() {
        delete($scope.messages);
        $scope.messages = [];

        $scope.showMessages = true;
        //send the post request with query
        $http.post("/readData", { query: $scope.query }).then(function(response) {
         //console.log(response);
         
         if(response != null) {
            $scope.data = response;
            $scope.showTweets = true;
         }
         
        });
      };

      $scope.exportSubmit = function() {
         delete($scope.messages);
         $scope.messages = [];

         $scope.showMessages = true;
         $scope.messages.push("Exporting tweets...");

         if($scope.query == "" || $scope.query == undefined) {
          $scope.messages.push("Empty query! Please enter a query before clicking Get Data");
         }
         //check if user inputted a filename
         else if($scope.filename == "" || $scope.filename == null ) {
          $scope.messages.push("Filename required!");
        }
        else {
           //send post request
           $http.post("/exportData", { query: $scope.query, format: $scope.exportFormat, filename: $scope.filename }).then(function(response) {
               //console.log(response);
               //$scope.data = response;
           });
        }

      };


      //reset function
      $scope.resetAll = function() {
        delete($scope.messages);
        $scope.query = "";
        $scope.count = 10;
        $scope.data = []; //tweets
        $scope.showTweets = false; //for ng-show
        $scope.showMessages = false; //for ng-show
        $scope.filename = ""
        $scope.exportFormat = "json"; // "CSV" or "JSON"
        $scope.messages = [];
        $scope.percentDone = 0;
      }
   });

})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
