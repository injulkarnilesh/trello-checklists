'use strict';

angular.module('chrome.plugin.trello.checklist')
.directive('trelloCard', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            card: '=',
        }, 
        bindToController: true,
        controllerAs: 'trelloCardController',
        controller: 'TrelloCardController',
        templateUrl: 'app/js/directives/card/trello-card.html'
    };  
}).controller('TrelloCardController', ['AuthService', 'TrelloAPIFactory', function(AuthService, TrelloAPIFactory) {
    var vm = this;
    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token)

    vm.$onInit = function() {
        trelloAPI.checkLists(vm.card.id, function(checkLists) {
            vm.checkLists = checkLists;
        });
    };


}]);