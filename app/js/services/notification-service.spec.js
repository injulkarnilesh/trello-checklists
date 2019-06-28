beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: AuthService', function() {
    var NotificationService, chrome, alarms, StorageService;
    var id, name, dateTime, callBack;
    var REMINDERS_KEY='reminders_key';

    beforeEach(function() {
        chrome = window.chrome;
        alarms = {
            create: jasmine.createSpy(),
            clear: jasmine.createSpy()
        }
        chrome.alarms = alarms;

        StorageService = {
            setStorage: jasmine.createSpy(),
            getStorage: jasmine.createSpy()
        };

        id = 'id';
        name = 'someName';
        dateTime = new Date();
        callBack = jasmine.createSpy();

        module(function($provide) {
            $provide.value('StorageService', StorageService);
        });

        inject(function(_NotificationService_) {
            NotificationService = _NotificationService_;
        });
    });
  
    it('create reminder should add alarm', function() {        
        NotificationService.createReminder(id, name, dateTime, callBack);

        expect(alarms.create).toHaveBeenCalled();
        var alarmArgs = alarms.create.calls.mostRecent().args;
        expect(alarmArgs[0]).toBe(name);
        expect(alarmArgs[1].when).toBe(dateTime.getTime());
    });

    it('Create reminder should save reminder when none present', function() {        
        NotificationService.createReminder(id, name, dateTime, callBack);

        expect(StorageService.getStorage).toHaveBeenCalled();
        var getStorageArgs = StorageService.getStorage.calls.mostRecent().args;
        expect(getStorageArgs[0]).toBe(REMINDERS_KEY);
        var storageCallBack = getStorageArgs[1];
        storageCallBack();

        expect(StorageService.setStorage).toHaveBeenCalled();
        var setStorageArgs = StorageService.setStorage.calls.mostRecent().args;
        expect(setStorageArgs[0]).toBe(REMINDERS_KEY);
        expect(setStorageArgs[1][id]).toBe(NotificationService.formatDate(dateTime));
        expect(setStorageArgs[2]).toBe(callBack);
    });

    it('Create reminder should add new one reminder when few already present', function() {        
        var existingReminders = {
            'someId': 'someDate'
        };
        NotificationService.createReminder(id, name, dateTime, callBack);

        expect(StorageService.getStorage).toHaveBeenCalled();
        var getStorageArgs = StorageService.getStorage.calls.mostRecent().args;
        var storageCallBack = getStorageArgs[1];
        storageCallBack(existingReminders);

        expect(StorageService.setStorage).toHaveBeenCalled();
        var setStorageArgs = StorageService.setStorage.calls.mostRecent().args;
        expect(setStorageArgs[1][id]).toBe(NotificationService.formatDate(dateTime));
        expect(setStorageArgs[1]['someId']).toBe('someDate');
    });

    it('should format date', function() {
        dateTime.setMonth(2);
        dateTime.setDate(12);
        dateTime.setYear(2019);
        dateTime.setHours(2);
        dateTime.setMinutes(5);
        var formatedDate = NotificationService.formatDate(dateTime);
    
        expect(formatedDate).toBe(moment(dateTime).format('03/12/19 2:5 A'))
    });

    it('should remove reminder', function() {        
        NotificationService.removeReminder(id, name, dateTime, callBack);

        expect(StorageService.getStorage).toHaveBeenCalled();
        var getStorageArgs = StorageService.getStorage.calls.mostRecent().args;
        var storageCallBack = getStorageArgs[1];
        storageCallBack({id: dateTime});

        expect(StorageService.setStorage).toHaveBeenCalled();
        var setStorageArgs = StorageService.setStorage.calls.mostRecent().args;
        expect(setStorageArgs[0]).toBe(REMINDERS_KEY);
        expect(setStorageArgs[1][id]).toBeUndefined();

        expect(alarms.clear).toHaveBeenCalledWith(name);
    });

    it('Should get reminders', function() {        
        NotificationService.getReminders(callBack);

        expect(StorageService.getStorage).toHaveBeenCalled();
        var getStorageArgs = StorageService.getStorage.calls.mostRecent().args;
        expect(getStorageArgs[0]).toBe(REMINDERS_KEY);
        expect(getStorageArgs[1]).toBe(callBack);
    });

    it('should check if date is in future', function() {
        dateTime.setMinutes(dateTime.getMinutes() + 1);
        var inFuture = NotificationService.isDateInFurure(NotificationService.formatDate(dateTime));
        expect(inFuture).toBe(true);

        dateTime.setMinutes(dateTime.getMinutes() - 1);
        var inFuture = NotificationService.isDateInFurure(NotificationService.formatDate(dateTime));
        expect(inFuture).toBe(false);
    });
});
  