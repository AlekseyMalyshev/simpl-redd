'use strict';

app.controller('ThreadsCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.init = function() {
      $http.get('/api/posts/heads').then(function(response) {
        console.log(response.data);
        $scope.threads = response.data;
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.newthread = function($event, title, message) {
      $event.preventDefault();
      $http.post('/api/posts', {
        title: title,
        message: message
      }).then(function(response) {
        $scope.init();
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    }

}]);
