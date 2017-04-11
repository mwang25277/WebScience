(function(angular) {
   'use strict';
   var app = angular.module('twitApp', []);
   app.controller('tweetCtrl', function($scope, $http, $window) {
      //load the first images
      $scope.query = "";
      $scope.count = 10;
      $scope.data = null; //tweets
      $scope.showTweets = false; //for ng-show
      $scope.formSubmit = function() {
        //send the post request with query and count
       $http.post("/tweets", { query: $scope.query, count: $scope.count }).then(function(response) {
           //console.log(response);
           $scope.data = response;
           $scope.showTweets = true;
       });
     }
   });

})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
