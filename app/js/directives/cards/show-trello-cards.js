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
}).controller('ShowTrelloCardsController', ['AuthService', 'TrelloAPIFactory', 'FavoriteCardsService', function(AuthService, TrelloAPIFactory, FavoriteCardsService) {
    var vm = this;
    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token);
    vm.favoriteCards = [];

    vm.$onInit = function() {
        loadCards(vm.boardId);
        vm.registerForBoardChange({callBack: loadCards});
        vm.loadFavoriteCards();
    };

    function loadCards(boardId) {
        trelloAPI.cards(boardId, function(cards) {
            vm.cards = cards.sort(function(f, s) {
                return (f.dateLastActivity < s.dateLastActivity)? 1 : (f.dateLastActivity > s.dateLastActivity)? -1 : 0;
            });
        });
    }

    vm.loadFavoriteCards = function() {
        FavoriteCardsService.getFavoriteCards(function(cards) {
            vm.favoriteCards = cards? cards: []; 
        });
    }

}]);