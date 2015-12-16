'use strict';

app.controller('ThreadCtrl', ['$scope', '$http', '$stateParams', 'userService',
  function($scope, $http, $stateParams, userService) {

    $scope.isAuthenticated = function() {
      return userService.isAuthenticated();
    };

    $scope.init = function() {
      $http.get('/api/posts/head/' + $stateParams.headId).then(function(response) {
        $scope.thread = Array.prototype.filter.call(response.data,
          function(post) {
            if (post._id === post.head) {
              $scope.head = post;
              return false;
            }
            else {
              return true;
            }
          });
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.reply = function($event, replyId) {
      $event.preventDefault();
      $http.post('/api/posts', {
        title: $scope.title,
        message: $scope.message,
        reply: replyId,
        head: $stateParams.headId
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
  }
]);

