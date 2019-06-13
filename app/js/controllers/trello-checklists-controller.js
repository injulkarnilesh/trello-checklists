'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloChecklistsController', ['AuthService', 'TrelloAPIFactory', function(AuthService, TrelloAPIFactory) {
    var vm = this;
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

}])