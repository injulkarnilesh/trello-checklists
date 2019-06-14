beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: TrelloAPIFactory', function() {
    var TrelloAPIFactory, trello;
    var token;
    var api, success, error, timeout;
    beforeEach(function() {
        token = 'token';
        success = jasmine.createSpy();
        error = jasmine.createSpy();
        timeout = jasmine.createSpy();
        
        trello = window.Trello;
        spyOn(trello, ['get']);

        module(function ($provide) {
            $provide.value('$timeout', timeout);
        });

        inject(function(_TrelloAPIFactory_) {
            TrelloAPIFactory = _TrelloAPIFactory_;
        });

        api = TrelloAPIFactory.with(token);
    });

    it('should create TrelloAPI with token', function() {
        expect(api.token).toBe(token);
    });

    it('shuould get user details', function() {
        api.userDetails(success, error);

        expect(trello.get).toHaveBeenCalled();
        var apiArgs = trello.get.calls.mostRecent().args;
        expect(apiArgs[0]).toBe('members/me');
        expect(apiArgs[1].fields).toContain('username');
        expect(apiArgs[1].fields).toContain('fullName');
        expect(apiArgs[1].fields).toContain('email');
        expect(apiArgs[1].fields).toContain('url');
        expect(apiArgs[1].fields).toContain('id');
        expect(apiArgs[1].fields).toContain('avatarUrl');
        expect(apiArgs[1].token).toBe(token);

        expectCallBackToHaveBeenCalled(apiArgs[2], success);
        expectCallBackToHaveBeenCalled(apiArgs[3], error);
    });

    it('should get boards', function() {
        api.boards(success, error);

        expect(trello.get).toHaveBeenCalled();
        var apiArgs = trello.get.calls.mostRecent().args;
        expect(apiArgs[0]).toBe('members/me/boards');

        expect(apiArgs[1].fields).toContain('name');
        expect(apiArgs[1].fields).toContain('id');
        expect(apiArgs[1].fields).toContain('dateLastActivity');
        expect(apiArgs[1].fields).toContain('closed');
        expect(apiArgs[1].token).toBe(token);

        expectCallBackToHaveBeenCalled(apiArgs[2], success);
        expectCallBackToHaveBeenCalled(apiArgs[3], error); 
    });

    function expectCallBackToHaveBeenCalled(callBackArgument, callBack) {
        callBackArgument();
        var timeoutCall = timeout.calls.mostRecent().args[0];
        timeoutCall();
        expect(callBack).toHaveBeenCalled();
    }

});
  