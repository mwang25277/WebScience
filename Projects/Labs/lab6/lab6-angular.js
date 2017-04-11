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

      //lab 5
      $scope.formSubmit = function() {
        //send the post request with query and count
       $http.post("/tweets", { query: $scope.query, count: $scope.count }).then(function(response) {
           //console.log(response);
           $scope.data = response;
           $scope.showTweets = true;
       });
      };

      //lab 6
      $scope.exportSubmit = function() {

        //trying to empty the array....
         while($scope.messages.length) {
          $scope.messages.pop();
         }
         $scope.messages.length = 0;
         $scope.messages = [];


         var socket = io();
         $scope.showMessages = true;
         $scope.messages.push("Loading tweets...");

         //get messages sent by server
         socket.on('msg', function(msg){
            $scope.messages.push(msg);
            // console.log(msg);
            // console.log($scope.messages);
            $scope.$apply();
         });

         //get counts sent by server
         socket.on('count', function(count) {
          console.log(count);
            $scope.percentDone = parseInt(count) / $scope.count * 100;
            $scope.$apply();
            if($scope.percentDone >= 100) {
              $scope.showTweets = true;
              $scope.messages.push("Finished loading tweets!");
            }
         });

         //check if user inputted a filename
         if($scope.filename != "" && $scope.filename != null ) {
            //send post request
           $http.post("/exportTweets", { query: $scope.query, count: $scope.count, format: $scope.exportFormat, filename: $scope.filename }).then(function(response) {
               console.log(response);
               $scope.data = response;
           });
         }
         else {
          console.log("Filename required");
         }
      };
   });

})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
