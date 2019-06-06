'use strict';

angular.module('chrome.plugin.trello.checklist', ['ngMaterial', 'ngMdIcons', 'ngMessages'])
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