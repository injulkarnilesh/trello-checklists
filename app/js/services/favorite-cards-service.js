'use strict';

angular.module('chrome.plugin.trello.checklist')
.service('FavoriteCardsService', ['StorageService', function(StorageService) {
    var FAVORITE_CARDS = 'favorite_cards';
    
    this.getFavoriteCards = function(callBack) {
        StorageService.getStorage(FAVORITE_CARDS, callBack);
    };

    this.favoriteCard = function(cardId, callBack) {
        StorageService.getStorage(FAVORITE_CARDS, function(storedCards) {
            var cards = storedCards? storedCards: [];
            cards.splice(0, 0, cardId);
            StorageService.setStorage(FAVORITE_CARDS, cards, function() {
                callBack();
            });
        });
    };

    this.unFavoriteCard = function(cardId, callBack) {
        StorageService.getStorage(FAVORITE_CARDS, function(storedCards) {
            var index = (storedCards? storedCards: []).indexOf(cardId);
            if(index > -1) {
                storedCards.splice(index, 1);
                StorageService.setStorage(FAVORITE_CARDS, storedCards, function() {
                    callBack();
                });
            }
        });
    };

}]);
