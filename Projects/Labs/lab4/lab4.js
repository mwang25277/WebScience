(function(angular) {
   'use strict';
   var app = angular.module('awwReddit', []);
   app.controller('redCtrl', function($scope, $http, $window) {
      //load the first images
       $http.get("https://www.reddit.com/r/aww/.json?sort=new?limit=25?").then(function(response1) {
           $scope.data = response1.data.data.children;
           //console.log(response1);
           $scope.after = response1.data.data.after;
           $scope.count = 4;

           //button to paginate
           $scope.next = function() {
               //console.log("https://www.reddit.com/r/aww/.json?sort=new?limit=25&after=" + $scope.after + "&count=" + $scope.count);
               $http.get("https://www.reddit.com/r/aww/.json?sort=new?limit=25&after=" + $scope.after + "&count=" + $scope.count).then(function(response2) {
                  //console.log(response2);
                  $scope.data = response2.data.data.children;
                  $scope.after = response2.data.data.after;
                  $scope.count += 4;
                  //console.log($scope.data);
                  $window.scrollTo(0,0);
               });
           };
       });
   });


   //filter to filter out nsfw posts and gifs
   //from http://thirdknife.github.io/2015/11/09/angularjs-reddit/
   app.filter('nsfw', function() {
    return function(list) {
        if(!list){return};
        var result = [];
        var i;
        for(i = 0; i < list.length; i++) {
            if(list[i].data.preview.images[0].source.url.indexOf(".gif") == -1  && list[i].data.thumbnail != 'nsfw'){
                result.push(list[i]);
            }
        }
        return result;
        }
    });
})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
