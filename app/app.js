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
.config(['$compileProvider',function($compileProvider) {   
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|chrome-extension):/);
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|mailto|chrome-extension):/);
  }
])
.config(function($mdIconProvider) {
  $mdIconProvider
    .icon('dots-vertical', 'images/icons/dots-vertical.svg', 24)
    .icon('dots-horizontal', 'images/icons/dots-horizontal.svg', 24)
    .icon('star', 'images/icons/star.svg', 24)
    .icon('close', 'images/icons/close.svg', 24)
    .icon('open', 'images/icons/open-in-new.svg', 12)
    .icon('clear', 'images/icons/clear.svg', 24)
    .icon('expand_less', 'images/icons/expand_less.svg', 24)
    .icon('expand_more', 'images/icons/expand_more.svg', 24)
    .icon('launch', 'images/icons/launch.svg', 24)
    .icon('save', 'images/icons/save.svg', 24);
});