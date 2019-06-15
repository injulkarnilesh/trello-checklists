'use strict';

angular.module('chrome.plugin.trello.checklist')
.directive('showTrelloCards', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            boardId: '=',
            registerForBoardChange: '&'
        }, 
        bindToController: true,
        controllerAs: 'showTrelloCardsController',
        controller: 'ShowTrelloCardsController',
        templateUrl: 'app/js/directives/cards/show-trello-cards.html'
    };  
}).controller('ShowTrelloCardsController', ['AuthService', 'TrelloAPIFactory', function(AuthService, TrelloAPIFactory) {
    var vm = this;
    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token)

    vm.$onInit = function() {
        loadCards(vm.boardId);
        vm.registerForBoardChange({callBack: loadCards});
    };

    function loadCards(boardId) {
        trelloAPI.cards(boardId, function(cards) {
            vm.cards = cards.sort(function(f, s) {
                return (f.dateLastActivity < s.dateLastActivity)? 1 : (f.dateLastActivity > s.dateLastActivity)? -1 : 0;
            });
        });
    }

}]);