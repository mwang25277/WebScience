(function(angular) {
   'use strict';
   var app = angular.module('myQuiz', []);
   app.controller('quizCtrl', function($scope, $http, $window) {
     $scope.zip = "";
     $scope.refresh = false; //for ng-show
     $scope.myFunc = function() {
      
        //Open Weather Map API Key
        var api_key = "739921e16247cd294ae24e8b96d69ba7";
        var weather_query = 'http://api.openweathermap.org/data/2.5/weather?';
        weather_query += "zip=" + $scope.zip + '&units=metric&';
        weather_query += 'appid=' + api_key;
        $.getJSON(weather_query, function(data) {
          $("#output").text("Current temperature: " + data.main.temp + " degrees Celsius");
          if( data.main.temp <= 0) {
            $("#output").css('color', 'black');
            $("#output").append("<p>It is freezing.</p>");
          }
          else if(data.main.temp > 25) {
            $("#output").css('color', 'red');
            $("#output").append("<p>It is hot.</p>");
          }
          else if(0 < data.main.temp && data.main.temp <= 10.0) {
            $("#output").css('color', 'purple');
            $("#output").append("<p>It is cold.</p>");
          }
          else {
            $("#output").css('color', 'blue');
            $("#output").append("<p>It is warm.</p>");
          }
          $scope.refresh = true;
          $scope.$apply();
        });
     }

     $scope.refreshPage = function() {
      window.location.reload();
     }
   });

})(window.angular);

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
