chrome.alarms.onAlarm.addListener(function(alarm) {
    var alarmName = alarm.name;
    chrome.notifications.create(alarmName, {
        type: 'basic',
        iconUrl: 'images/icon.png',
        title: 'Trello Checklists',
        message: alarmName
    });
});