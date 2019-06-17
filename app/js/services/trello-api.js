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

  TrelloAPI.prototype.boards = function(success, error) {
    Trello.get('members/me/boards', {'fields': 'name,id,dateLastActivity,closed,url,prefs', 'token': this.token}, this.callBackWithDigest(success), this.callBackWithDigest(error));
  }

  TrelloAPI.prototype.cards = function(boardId, success, error) {
    Trello.get('boards/' + boardId + '/cards', {'fields': 'id,name,closed,dateLastActivity,url', 'token': this.token}, this.callBackWithDigest(success), this.callBackWithDigest(error));
  }

  TrelloAPI.prototype.checkLists = function(cardId, success, error) {
    Trello.get('cards/' + cardId + '/checklists', {'token': this.token}, this.callBackWithDigest(success), this.callBackWithDigest(error));
  }

  TrelloAPI.prototype.toggleCheckListItem = function(cardId, checkListItemId, state, success, error) {
    Trello.put('cards/' + cardId + '/checkItem/' + checkListItemId, {'token': this.token, 'state': state}, this.callBackWithDigest(success), this.callBackWithDigest(error));
  }

  this.with = function(token) {
    return new TrelloAPI(token);
  };

}]);
