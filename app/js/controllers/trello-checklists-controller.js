'use strict';

angular.module('chrome.plugin.trello.checklist')
.controller('TrelloChecklistsController', ['AuthService', 'TrelloAPIFactory', '$mdDialog', 'ThemeService', function(AuthService, TrelloAPIFactory, $mdDialog, ThemeService) {
    var vm = this;
    var reloadFavoritesCallBacks = [];
    
    vm.toolbar = {
        showOptions: false
    };

    ThemeService.getTheme(function(theme) {
        if(theme) {
            vm.theme = theme;
        }
    });

    vm.isLoggedIn = AuthService.isLoggedIn();
    vm.user = { };
    
    if (vm.isLoggedIn) {
        vm.trelloAPI = TrelloAPIFactory.with(AuthService.getToken());
        vm.trelloAPI.userDetails(function(user) {     
            vm.user = user;
        }, function() {

        });
    } 

    vm.login = function() {
        AuthService.toLoginPage();
    };

    vm.logout = function() {
        var confirm = $mdDialog.confirm()
          .title('Logout')
          .textContent('Are you sure you want to logout?')
          .ok('Yes')
          .cancel('No');

        $mdDialog.show(confirm).then(function() {
            AuthService.toLogoutPage();
        }, function() { });   
    };

    vm.reloadFavorites = function() {
        if(reloadFavoritesCallBacks && reloadFavoritesCallBacks.length) {
            reloadFavoritesCallBacks.forEach(function(callBack) {
                callBack();
            })
        }
    };

    vm.registerReloadFavoritesCallBack = function(callBack) {
        reloadFavoritesCallBacks.push(callBack);
    }

    vm.changeTheme = function() {
        vm.theme = ThemeService.toggleTheme(vm.theme);
    }

}])