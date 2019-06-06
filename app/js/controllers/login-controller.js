'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloLoginController', ['AuthService', '$window', function(AuthService, $window) {
    var vm = this;
    vm.loginRequired = true;

    var token = AuthService.getUrlToken();
    if (token) {
      AuthService.loginNonInteractive();
    }

    vm.loginRequired = !AuthService.isLoggedIn();  

    vm.trelloLogin = function() {    
        AuthService.loginInteractive();
    };

    vm.trelloLogout = function() {
      AuthService.logout();
      $window.location.reload();
    };
    
}])