'use strict';

angular.module('chrome.plugin.trello.checklist')
.directive('trelloCard', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            card: '=',
            favoriteCards: '=',
            reloadFavouriteCards: '&'
        }, 
        bindToController: true,
        controllerAs: 'trelloCardController',
        controller: 'TrelloCardController',
        templateUrl: 'app/js/directives/card/trello-card.html'
    };  
}).controller('TrelloCardController', ['AuthService', 'TrelloAPIFactory', 'FavoriteCardsService', function(AuthService, TrelloAPIFactory, FavoriteCardsService) {
    var COMPLETE_STATE = 'complete';
    var INCOMPLETE_STATE = 'incomplete';

    var vm = this;
    vm.showCheckLists = false;
    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token);
    vm.favoriteUpdating = false;

    vm.$onInit = function() {
        trelloAPI.checkLists(vm.card.id, function(checkLists) {
            vm.checkLists = checkLists;
            countComplteItems();
        });
    };

    vm.toggleShowCheckLists = function() {
        vm.showCheckLists = !vm.showCheckLists;
    };

    vm.toggleItem = function(item) {
        var newState = toggleState(item.state);
        trelloAPI.toggleCheckListItem(vm.card.id, item.id, newState, function(res) {
            item.state = newState;
            countComplteItems();
        });
    };

    vm.isComplete = function(item) {
        return item.state === COMPLETE_STATE;
    };

    vm.openCardInTrello = function() {
        chrome.tabs.create({ url: vm.card.url });
    };

    vm.hasItems = function(){
        return vm.checkLists && vm.checkLists.length && vm.totalItemCount;
    };

    vm.favoriteIt = function() {
        vm.favoriteUpdating = true;
        FavoriteCardsService.favoriteCard(vm.card.id, function() {
            vm.favoriteUpdating = false;
            vm.reloadFavouriteCards();
        });
    };

    vm.unFavoriteIt = function() {
        vm.favoriteUpdating = true;
        FavoriteCardsService.unFavoriteCard(vm.card.id, function() {
            vm.favoriteUpdating = false;
            vm.reloadFavouriteCards();
        });
    };

    vm.isFavorite = function() {
        return (vm.favoriteCards? vm.favoriteCards: []).indexOf(vm.card.id) > -1;
    }; 

    function countComplteItems() {
        if(vm.checkLists && vm.checkLists.length) {
            var checkListItems = vm.checkLists.flatMap(function(checkList) {
                return checkList.checkItems;
            });
            vm.totalItemCount = checkListItems.length;
            vm.completeItemCount = checkListItems.filter(vm.isComplete).length;
        }
    }

    function toggleState(currentState) {
        if(currentState === COMPLETE_STATE) {
            return INCOMPLETE_STATE;
        }
        return COMPLETE_STATE;
    }

}]);