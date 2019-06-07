beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: TrelloAPIFactory', function() {
    var TrelloAPIFactory, trello;
    var toekn;
    var api, success, error;
    beforeEach(inject(function(_TrelloAPIFactory_) {
        token = 'token';
        success = jasmine.createSpy();
        error = jasmine.createSpy();
        TrelloAPIFactory = _TrelloAPIFactory_;
        trello = window.Trello;
        spyOn(trello, ['get']);

        api = TrelloAPIFactory.with(token);
    }));

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
        expect(apiArgs[2]).toBe(success);
        expect(apiArgs[3]).toBe(error);
    });

});
  