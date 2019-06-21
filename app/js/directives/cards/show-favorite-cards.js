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
}).controller('ShowFavoriteCardsController', ['FavoriteCardsService', function(FavoriteCardsService) {
    var vm = this;
    vm.favoriteCards = [];


    vm.$onInit = function() {
        loadFavoriteCards();
        vm.registerReloadFavoritesCallBack({callBack: loadFavoriteCards});
    };

    function loadFavoriteCards() {
        FavoriteCardsService.getFavoriteCards(function(cards) {
            vm.favoriteCards = cards? cards: []; 
        });
    }
    
}]);