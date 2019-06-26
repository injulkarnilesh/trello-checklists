beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: AuthService', function() {
    var NotificationService, chrome, alarms;
    beforeEach(inject(function(_NotificationService_) {
        NotificationService = _NotificationService_;
        chrome = window.chrome;
        alarms = {
            create: jasmine.createSpy()
        }
        chrome.alarms = alarms;
    }));
  
    it('should create reminder', function() {
        var name = 'remind me';
        var date = new Date();
        
        NotificationService.createReminder(name, date);

        expect(alarms.create).toHaveBeenCalled();
        var alarmArgs = alarms.create.calls.mostRecent().args;
        expect(alarmArgs[0]).toBe(name);
        expect(alarmArgs[1].when).toBe(date.getTime());
    });
});
  