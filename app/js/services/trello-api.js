'use strict';

angular.module('chrome.plugin.trello.checklist')
.service('TrelloAPIFactory', ['AuthService', function(AuthService) {

  function TrelloAPI(token) {
    this.token = token;

    this.userDetails = function(success, error) {
        Trello.get('members/me', {'fields': 'username,fullName,email,url,id,avatarUrl', 'token': token}, success, error);
    };
  }

  this.with = function(token) {
    return new TrelloAPI(token);
  };

}]);
