'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloChecklistsController', ['AuthService', 'TrelloAPIFactory', '$scope', function(AuthService, TrelloAPIFactory, $scope) {
    var vm = this;
    vm.isLoggedIn = AuthService.isLoggedIn();
    vm.user = { };
    
    if (vm.isLoggedIn) {
        vm.trelloAPI = TrelloAPIFactory.with(AuthService.getToken());
        vm.trelloAPI.userDetails(function(user) {     
            vm.user = user;
            $scope.$apply();
        }, function() {

        });
    }

}])