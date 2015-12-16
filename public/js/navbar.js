'use strict';

app.controller('navBar', ['$scope', 'userService', '$templateCache', '$state', '$stateParams',
    function($scope, userService, $templateCache, $state, $stateParams) {

    $scope.isAuthenticated = function() {
      return userService.isAuthenticated();
    };

    $scope.login = function($event, username, password) {
      $event.preventDefault();
      userService.authenticate({
        username: username,
        password: password });
    }

    $scope.logout = function() {
      userService.logout();
      $templateCache.removeAll();
      if (!$state.current.abstract) {
        $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
        });
      }
    }

    $scope.register = function() {
      $state.go('register');
    }

  }]);
