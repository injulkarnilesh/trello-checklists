'use strict';

angular.module('chrome.plugin.trello.checklist')
.service('NotificationService', [ 'StorageService', function(StorageService) {
    var REMINDERS_KEY='reminders_key';
    var DATE_FORMAT = 'MM/DD/YY h:m A';

    this.formatDate  = function(date) {
        return moment(date).format(DATE_FORMAT);
    };

    this.createReminder = function(id, message, dateTime, callBack) {
        var service = this;
        chrome.alarms.create(message, {
           when: dateTime.getTime()
        });
        this.getReminders(function(reminders) {
            reminders = reminders? reminders: {};
            reminders[id] = service.formatDate(dateTime);
            StorageService.setStorage(REMINDERS_KEY, reminders, callBack);
        })
    };

    this.removeReminder = function(id, message, callBack) {
        chrome.alarms.clear(message);
        this.getReminders(function(reminders) {
            reminders = reminders? reminders: {};
            delete reminders[id];
            StorageService.setStorage(REMINDERS_KEY, reminders, callBack);
        })
    };

    this.getReminders = function(callBack) {
        StorageService.getStorage(REMINDERS_KEY, callBack);
    };

    this.readableDate = function(stringDate) {
        return moment(stringDate, DATE_FORMAT).calendar();
    }

    this.isDateInFurure = function(stringDate) {
        return moment(stringDate, DATE_FORMAT).isAfter();
    }

}]);
