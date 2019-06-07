beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: AuthService', function() {
    var AuthService, fakeStorage, $location, trello;
    beforeEach(inject(function(_AuthService_, _$location_) {
      AuthService = _AuthService_;
      $location = _$location_;
      fakeStorage = createFakeLocalStorage();
      trello = window.Trello;
      spyOn(trello, 'authorize');
    }));
  
    it('should not be logged in', function() {
        expect(AuthService.isLoggedIn()).toBeFalsy();
    });

    it('should be logged in if local storage key set', function() {
        localStorage.setItem('trello_token', 'anything');
        expect(AuthService.isLoggedIn()).toBeTruthy();
    });

    it('should get token if set', function() {
        localStorage.setItem('trello_token', 'someToken');
        expect(AuthService.getToken()).toBe('someToken');
    });

    it('should not get token if not set', function() {
        expect(AuthService.getToken()).toBeFalsy();
    });

    it('should logout', function() {
        localStorage.setItem('trello_token', 'anything');
        expect(AuthService.isLoggedIn()).toBeTruthy();

        AuthService.logout();
        expect(AuthService.isLoggedIn()).toBeFalsy();
    });

    it('should get url token if found in search param', function() {
        var someToken = 'someToken';
        $location.search('token', someToken);

        expect(AuthService.getUrlToken()).toBe(someToken);
    });

    it('should get url token if found in hash', function() {
        var someToken = 'someToken';
        $location.hash('#token=' + someToken);

        expect(AuthService.getUrlToken()).toBe(someToken);
    });

    it('should not get url token if not found in hash or param', function() {
        expect(AuthService.getUrlToken()).toBeUndefined();
    });

    it('should authorize with trello interactively', function() {
        AuthService.loginInteractive();
        
        expect(trello.authorize).toHaveBeenCalled();
        verifyTrelloAuthorizationWithInteractiveModeAs(true);
    });

    it('should authorize with trello non interactively', function() {
        AuthService.loginNonInteractive();
        
        expect(trello.authorize).toHaveBeenCalled();
        verifyTrelloAuthorizationWithInteractiveModeAs(false)
    });

    function createFakeLocalStorage() {
        var fakeStorage = {};
        var localStorage = window.localStorage;
        spyOn(localStorage, 'getItem').and.callFake(function (key) {
            return fakeStorage[key];
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return fakeStorage[key] = value + '';
        });
        spyOn(localStorage, 'removeItem').and.callFake(function (key) {
            delete fakeStorage[key];
        });
        return fakeStorage;
    }

    function verifyTrelloAuthorizationWithInteractiveModeAs(isInteracive) {
        var loginParams = trello.authorize.calls.mostRecent().args[0];
        expect(loginParams.name).toBe('Trello Checklist');
        expect(loginParams.interactive).toBe(isInteracive);
        expect(loginParams.persist).toBe(true);
        expect(loginParams.expiration).toBe('never');
        expect(loginParams.scope).toEqual({ read: true, write: true, account: true });
    }
});
  