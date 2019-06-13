'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloLoginController', ['AuthService', '$window', function(AuthService, $window) {
    var vm = this;
    var token = AuthService.getUrlToken();

    if (token) {
      AuthService.loginNonInteractive();
    }
   
    vm.loginRequired = !AuthService.isLoggedIn();
    if(vm.loginRequired) {
        AuthService.loginInteractive();
    }

    vm.trelloLogout = function() {
      AuthService.logout();
      $window.close();
    };
    
}])