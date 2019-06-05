'use strict';

angular.module('chrome.plugin.trynew', ['ngMaterial', 'ngMdIcons', 'ngMessages'])
.controller('TryNewRootController', ['StorageService', function(StorageService) {
    var vm = this;
    vm.trelloLogin = function() {
      Trello.authorize({
        name: 'Trello Checklist',
        interactive: true,
        persist: true,
        scope: { read: true, write: true, account: true },
        expiration: 'never', 
        success: function() {
          console.log('SUCCESS LOGIN');
        },
        error: function(err) {
          console.error('LOGIN ERR', err);
        }
      });
    };
    
}])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue');
})
.service('StorageService', [ function() {
  var book_key = 'TryNewBooks';
  var movie_key = 'TryNewMovies';
  var music_key = 'TryNewMusic';
  var tab_key = 'TryNewTab';
  var misc_item_key = 'MiscItemKey';
  
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
  
  this.getBooks = function(callBack) {
    getStorage(book_key, callBack);
  };
  
  this.setBooks = function(books, callBack) {
    setStorage(book_key, books, callBack);
  }
  
  this.getMovies = function(callBack) {
    getStorage(movie_key, callBack);
  };
  
  this.setMovies = function(movies, callBack) {
    setStorage(movie_key, movies, callBack);
  }
  
  this.setMusic = function(music, callBack) {
    setStorage(music_key, music, callBack);
  }
  
  this.getMusic = function(callBack) {
    getStorage(music_key, callBack);
  }
  
  this.setMiscItems = function(items, callBack) {
    setStorage(misc_item_key, items, callBack);
  }
  
  this.getMiscItems = function(callBack) {
    getStorage(misc_item_key, callBack);
  }
  
  this.setLastTab = function(tabDetails) {
    setStorage(tab_key, tabDetails);
  }
  
  this.getLastTab = function(callback) {
    getStorage(tab_key, callback);
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