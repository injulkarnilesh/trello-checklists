'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloChecklistsController', ['AuthService', 'TrelloAPIFactory', '$mdDialog', function(AuthService, TrelloAPIFactory, $mdDialog) {
    var vm = this;
    vm.toolbar = {
        showOptions: false
    };

    vm.isLoggedIn = AuthService.isLoggedIn();
    vm.user = { };
    
    if (vm.isLoggedIn) {
        vm.trelloAPI = TrelloAPIFactory.with(AuthService.getToken());
        vm.trelloAPI.userDetails(function(user) {     
            vm.user = user;
        }, function() {

        });
    } 

    vm.login = function() {
        AuthService.toLoginPage();
    };

    vm.logout = function() {
        var confirm = $mdDialog.confirm()
          .title('Logout')
          .textContent('Are you sure you want to logout?')
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
            AuthService.toLogoutPage();
        }, function() { });   
    };

}])