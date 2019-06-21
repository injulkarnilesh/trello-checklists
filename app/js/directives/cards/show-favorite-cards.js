'use strict';

angular.module('chrome.plugin.trello.checklist')
.directive('showFavoriteCards', function() {
    return {
        restrict: 'E',
        scope: {
            registerReloadFavoritesCallBack: '&'
        },
        bindToController: true,
        replace: true,
        controllerAs: 'showFavoriteCardsController',
        controller: 'ShowFavoriteCardsController',
        templateUrl: 'app/js/directives/cards/show-favorite-cards.html'
    };  
}).controller('ShowFavoriteCardsController', ['FavoriteCardsService', 'AuthService', 'TrelloAPIFactory', function(FavoriteCardsService, AuthService, TrelloAPIFactory) {
    var vm = this;
    vm.favoriteCardIds = [];
    vm.favoriteCards = [];
    var trelloAPI = TrelloAPIFactory.with(AuthService.getToken());

    vm.$onInit = function() {
        vm.loadFavoriteCards();
        vm.registerReloadFavoritesCallBack({callBack: vm.loadFavoriteCards});
    };

    vm.loadFavoriteCards = function() {
        FavoriteCardsService.getFavoriteCards(function(cardIds) {
            vm.favoriteCardIds = cardIds? cardIds: [];
            vm.favoriteCards = []; 
            vm.favoriteCardIds.forEach(function(cardId, index) {
                trelloAPI.card(cardId, function(card) {
                    vm.favoriteCards[index] = card; 
                });
            })
        });
    }
    
}]);