'use strict';

angular.module('chrome.plugin.trello.checklist')
.service('NotificationService', [ function() {

    this.createReminder = function(message, dateTime) {
        chrome.alarms.create(message, {
           when: dateTime.getTime()
        });
    };
}]);
