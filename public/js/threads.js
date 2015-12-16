'use strict';

app.controller('ThreadsCtrl', ['$scope', '$http', 'userService',
  function($scope, $http, userService) {

    $scope.isAuthenticated = function() {
      return userService.isAuthenticated();
    };

    $scope.init = function() {
      $http.get('/api/posts/heads').then(function(response) {
        $scope.threads = response.data;
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.newthread = function($event) {
      $event.preventDefault();
      $http.post('/api/posts', {
        title: $scope.title,
        message: $scope.message
      }).then(function(response) {
        $scope.init();
        $scope.title = '';
        $scope.message = '';
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    }

}]);
