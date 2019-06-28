'use strict';

angular.module('chrome.plugin.trello.checklist')
.directive('trelloCard', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            card: '=',
            favoriteCards: '=',
            reloadFavouriteCards: '&',
            showReminders: '='
        }, 
        bindToController: true,
        controllerAs: 'trelloCardController',
        controller: 'TrelloCardController',
        templateUrl: 'app/js/directives/card/trello-card.html'
    };  
}).controller('TrelloCardController', ['AuthService', 'TrelloAPIFactory', 'FavoriteCardsService', 'mdcDateTimeDialog', 'NotificationService', function(AuthService, TrelloAPIFactory, FavoriteCardsService, mdcDateTimeDialog, NotificationService) {
    var COMPLETE_STATE = 'complete';
    var INCOMPLETE_STATE = 'incomplete';

    var vm = this;
    vm.showCheckLists = false;
    vm.favoriteUpdating = false;
    vm.reminders = {};

    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token);
    

    vm.$onInit = function() {
        trelloAPI.checkLists(vm.card.id, function(checkLists) {
            vm.checkLists = checkLists;
            countComplteItems();
        });
        getReminders();
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

    vm.setReminder = function (item) {
        mdcDateTimeDialog.show({
            minDate: new Date(),
            date: true,
            time: true, 
            showIcon: true,
            autoOk: true, 
            shortTime: true
        }).then(function (selectedDate) {
            NotificationService.createReminder(item.id, reminderName(item), selectedDate, getReminders);
        }, function() {
            console.log('Selection canceled');
        });
    };

    vm.removeReminder = function(item) {
        NotificationService.removeReminder(item.id, reminderName(item), getReminders);
    }

    vm.readableDate = function(stringDate) {
        return NotificationService.readableDate(stringDate);
    }

    vm.isReminderInFuture = function(stringDate) {
        return NotificationService.isDateInFurure(stringDate);
    }

    function getReminders() {
        NotificationService.getReminders(function(reminders) {
            vm.reminders = reminders;
        });
    }

    function reminderName(item) {
        return vm.card.name + ':' + item.name;
    }
    
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