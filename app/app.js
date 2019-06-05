'use strict';

angular.module('chrome.plugin.trynew', ['ngMaterial', 'ngMdIcons', 'ngMessages'])
.controller('TryNewRootController', ['AuthService', function(AuthService) {
    var vm = this;
    vm.loginRequired = true;

    var token = AuthService.getUrlToken();
    if (token) {
      AuthService.loginNonInteractive();
    }

    vm.loginRequired = !AuthService.isLoggedIn();  

    vm.trelloLogin = function() {    
        AuthService.loginInteractive();
    };

    vm.trelloLogout = function() {
      AuthService.logout();
      location.reload();
    }
    
}])
.service('AuthService', ['$location', function($location) {
  var TRELLO_TOKEN = 'trello_token';
  function login(isInteractive) {
    Trello.authorize({
      name: 'Trello Checklist',
      interactive: isInteractive,
      persist: true,
      scope: { read: true, write: true, account: true },
      expiration: 'never'
    });
  } 

  this.isLoggedIn = function() {
    return localStorage.getItem(TRELLO_TOKEN);
  };

  this.logout = function() {
    localStorage.removeItem(TRELLO_TOKEN);
  };

  this.loginInteractive = function() {
    login(true);
  };

  this.loginNonInteractive = function() {
    login(false);
  };

  this.getUrlToken =  function() {
    var params = $location.search();
    if(params.token) {
      return params.token;
    }
    var hash = $location.hash();
    if(hash && hash.length) {
      var hashKeyValue = hash.split('=');
      if(hashKeyValue.length == 2) {
        return hashKeyValue[1];
      }
    }
    return undefined;
  };
}])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue');
})
.service('StorageService', [function() {

  function getStorage(key, callback) {
    chrome.storage.sync.get(key, function(data) {
      if(callback) {
        callback(data[key]);
      }
    });
  }
  
  function setStorage(key, objects, callback) {
    var objectList = {};
    objectList[key] = objects;
    chrome.storage.sync.set(objectList, function() {
      if(callback) {
        callback();
      }
    })
  }

}])
.service('ToastService', ['$mdToast', function($mdToast) {
  
  this.showMessage = function(message) {
    $mdToast.show($mdToast.simple()
        .textContent(message)
        .position('bottom right')
        .hideDelay(2500)
      );
  }
  
  this.showMessageWithAction = function(message, action, callback) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action(action)
        .highlightAction(true)
        .position('bottom right');

      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          callback();
        }
      });
  }
  
}])
.config(function($mdIconProvider) {
  $mdIconProvider
    .icon('magnify', 'images/icons/magnify.svg', 24)
    .icon('dots-vertical', 'images/icons/dots-vertical.svg', 24)
    .icon('dots-horizontal', 'images/icons/dots-horizontal.svg', 24)
    .icon('book', 'images/icons/book-open-page-variant.svg', 24)
    .icon('movie-tv', 'images/icons/message-video.svg', 24)
    .icon('music', 'images/icons/music.svg', 24)
    .icon('star', 'images/icons/star.svg', 24)
    .icon('close', 'images/icons/close.svg', 24)
    .icon('goodreads', 'images/icons/goodreads.svg', 12)
    .icon('delete', 'images/icons/delete.svg', 12)
    .icon('open', 'images/icons/open-in-new.svg', 12)
    .icon('add', 'images/icons/plus.svg', 24)
    .icon('clear', 'images/icons/clear.svg', 24)
    .icon('save', 'images/icons/save.svg', 24)
    .icon('settings_black', 'images/icons/settings_black.svg', 24)
    .icon('settings', 'images/icons/settings.svg', 24);
});