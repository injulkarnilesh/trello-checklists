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
    var COMPLETE_STATE = 'complete';
    var INCOMPLETE_STATE = 'incomplete';

    var vm = this;
    vm.showCheckLists = false;
    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token)

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
    }

    vm.hasItems = function(){
        return vm.checkLists && vm.checkLists.length && vm.totalItemCount;
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
    };


}]);