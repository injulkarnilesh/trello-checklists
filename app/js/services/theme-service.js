'use strict';

angular.module('chrome.plugin.trello.checklist')
.service('ThemeService', ['StorageService', function(StorageService) {
    var THEME_KEY = 'theme_key';
    var DARK = 'dark';
    var DEFAULT = 'default';
    
    this.getTheme = function(callBack) {
        StorageService.getStorage(THEME_KEY, callBack);
    };

    this.toggleTheme = function(currentTheme) {
        var newTheme = currentTheme === DEFAULT ? DARK: DEFAULT;
        StorageService.setStorage(THEME_KEY, newTheme);
        return newTheme;
    };

}]);
