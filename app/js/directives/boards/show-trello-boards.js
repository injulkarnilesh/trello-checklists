'use strict';

angular.module('chrome.plugin.trello.checklist')
.directive('showTrelloBoards', function() {
    return {
        restrict: 'E',
        replace: true,
        controllerAs: 'showTrelloBoardsController',
        controller: 'ShowTrelloBoardsController',
        templateUrl: 'app/js/directives/boards/show-trello-boards.html'
    };  
}).controller('ShowTrelloBoardsController', ['AuthService', 'TrelloAPIFactory', function(AuthService, TrelloAPIFactory) {
    var vm = this;
    vm.selectedBoard = undefined;
    var token = AuthService.getToken();
    var trelloAPI = TrelloAPIFactory.with(token);

    trelloAPI.boards(function(boards) {
        vm.boards = boards.sort(function(f, s) {
            return (f.dateLastActivity < s.dateLastActivity)? 1 : (f.dateLastActivity > s.dateLastActivity)? -1 : 0;
        }).sort(function(f, s) {
            return f.closed - s.closed;
        }); 
    });

}]);