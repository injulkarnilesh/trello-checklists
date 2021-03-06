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
        spyOn(trello, ['put']);

        module(function($provide) {
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

        expectTrelloCalledWith('get')
            .withPath('members/me')
            .withFields(['username', 'fullName', 'email', 'url', 'id', 'avatarUrl'])
            .withToken(token)
            .withSuccessCallBack(success)
            .withErrorCallBack(error);
    });

    it('should get boards', function() {
        api.boards(success, error);

        expectTrelloCalledWith('get')
            .withPath('members/me/boards')
            .withFields(['name', 'id', 'dateLastActivity', 'closed', 'url', 'prefs'])
            .withToken(token)
            .withSuccessCallBack(success)
            .withErrorCallBack(error);
    });

    it('should get cards', function() {
        var boardId = 'someBoardId';
        
        api.cards(boardId, success, error);

        expectTrelloCalledWith('get')
            .withPath('boards/' + boardId + '/cards')
            .withFields(['id', 'name', 'closed', 'dateLastActivity', 'url'])
            .withToken(token)
            .withSuccessCallBack(success)
            .withErrorCallBack(error);
    });

    it('should get card', function() {
        var cardId = 'someCardId';
        
        api.card(cardId, success, error);

        expectTrelloCalledWith('get')
            .withPath('cards/' + cardId)
            .withFields(['id', 'name', 'closed', 'dateLastActivity', 'url'])
            .withToken(token)
            .withSuccessCallBack(success)
            .withErrorCallBack(error);
    });

    it('should get card checklists', function() {
        var cardId = 'cardId';

        api.checkLists(cardId, success, error);

        expectTrelloCalledWith('get')
            .withPath('cards/' + cardId + '/checklists')
            .withToken(token)
            .withSuccessCallBack(success)
            .withErrorCallBack(error);
    });

    it('should complete checklist item', function() {
        var cardId = 'cardId';
        var checkListItemId = 'itemId';
        var state = 'complete';

        api.toggleCheckListItem(cardId, checkListItemId, state, success, error);

        expectTrelloCalledWith('put')
            .withPath('cards/' + cardId + '/checkItem/' + checkListItemId)
            .withToken(token)
            .withParam('state', 'complete')
            .withSuccessCallBack(success)
            .withErrorCallBack(error);
    });

    function expectTrelloCalledWith(method) {
        expect(trello[method]).toHaveBeenCalled();
        var apiArgs = trello[method].calls.mostRecent().args;
        
        return {
            withPath: function(expectedPath) {
                expect(apiArgs[0]).toBe(expectedPath);
                return this;        
            },
            withFields: function(expectedFields) {
                expectFields(apiArgs[1].fields, expectedFields);
                return this;        
            },
            withParam: function(param, paramValue) {
                expect(apiArgs[1][param]).toBe(paramValue);
                return this;        
            },
            withToken: function(expectedToken) {
                expect(apiArgs[1].token).toBe(expectedToken);
                return this;        
            },
            withSuccessCallBack: function(expectedSuccess) {
                expectCallBackToHaveBeenCalled(apiArgs[2], expectedSuccess);
                return this;
            },
            withErrorCallBack: function(expectedError) {
                expectCallBackToHaveBeenCalled(apiArgs[3], expectedError); 
                return this;
            }
        };
    }

    function expectFields(fields, expectedFields) {
        expectedFields.forEach(function(expectField) {
            expect(fields).toContain(expectField); 
        });
    }

    function expectCallBackToHaveBeenCalled(callBackArgument, callBack) {
        callBackArgument();
        var timeoutCall = timeout.calls.mostRecent().args[0];
        timeoutCall();
        expect(callBack).toHaveBeenCalled();
    }

});
  