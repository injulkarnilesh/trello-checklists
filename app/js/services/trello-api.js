'use strict';

angular.module('chrome.plugin.trello.checklist')
.service('TrelloAPIFactory', ['$timeout', function($timeout) {
  
  function TrelloAPI(token) {
    this.token = token;
  }

  TrelloAPI.prototype.callBackWithDigest =  function(callback) {
    return function(resp) {
      $timeout(function() {
        callback(resp);
      });
    }
  };

  TrelloAPI.prototype.userDetails = function(success, error) {
    Trello.get('members/me', {'fields': 'username,fullName,email,url,id,avatarUrl', 'token': this.token}, this.callBackWithDigest(success), this.callBackWithDigest(error));
  };

  this.with = function(token) {
    return new TrelloAPI(token);
  };

}]);
