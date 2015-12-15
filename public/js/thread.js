'use strict';

app.controller('ThreadCtrl', ['$scope', '$http', '$stateParams',
  function($scope, $http, $stateParams) {

    $scope.init = function() {
      $http.get('/api/posts/head/' + $stateParams.headId).then(function(response) {
        console.log(response.data);
        $scope.threads = response.data;
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.newthread = function($event, title, message, replyId) {
      $event.preventDefault();
      $http.post('/api/posts', {
        title: title,
        message: message,
        reply: replyId,
        head: $stateParams.headId
      }).then(function(response) {
        $scope.init();
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    }

}]);
