'use strict';

angular.module('chrome.plugin.trello.checklist')
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
    return this.getToken();
  };

  this.getToken = function() {
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