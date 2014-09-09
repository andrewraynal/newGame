'use strict';

var app = angular
.module('testApp', [ 
    'ngAnimate', 
    'ngCookies', 
    'ngRoute',
  ]);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'GameController'
    });
})
