'use strict';

app.controller('RegCtrl', ['$scope', '$state', 'userService', '$templateCache', '$http',
    function($scope, $state, userService, $templateCache, $http) {

    $scope.isAuthenticated = function() {
      return userService.isAuthenticated();
    };

    $scope.register = function($event, username, password, passwordOK) {
      $event.preventDefault();
      if (!passwordOK) {
        return;
      }
      userService.register({
        username: username,
        password: password }, function() {
          $state.go('threads');
        });
    };

  }]);
