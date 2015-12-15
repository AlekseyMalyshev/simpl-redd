'use strict';

var app = angular.module('Redd', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('threads', {
      url: '/',
      templateUrl: 'templates/threads.html',
      controller: 'ThreadsCtrl'
    });

});
