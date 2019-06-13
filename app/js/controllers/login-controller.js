'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloLoginController', ['AuthService', '$window', function(AuthService, $window) {
    var vm = this;

    vm.trelloLogout = function() {
      AuthService.logout();
      $window.close();
    };

    var token = AuthService.getUrlToken();
    if (token) {
      AuthService.loginNonInteractive();
    }
   
    vm.loginRequired = !AuthService.isLoggedIn();
    if(vm.loginRequired) {
        AuthService.loginInteractive();
    }
    
    if(AuthService.shouldLogout()) {
      vm.trelloLogout();
    }
    
}])