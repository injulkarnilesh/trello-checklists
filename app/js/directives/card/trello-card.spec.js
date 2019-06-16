beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ShowTrelloBoardsController', function() {
	var controller;
    var authService, trelloAPIFactory, trelloAPI;
    var $controller;
    var scope;
    var token;
    var binding;
    var card;

	beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        token = 'someToken';
        authService = {
            getToken: jasmine.createSpy()
        };
        trelloAPIFactory = {
            with: jasmine.createSpy()
        };
        trelloAPI = {
            checkLists: jasmine.createSpy()  
        };
        card = someCard();
        binding = {
            card: card
        };
        authService.getToken.and.returnValue(token);
        trelloAPIFactory.with.and.returnValue(trelloAPI);
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should load checkLists', function() {
        var expectedCheckLists = [someCheckList(), someCheckList()];
        expect(authService.getToken).toHaveBeenCalled();
        expect(trelloAPIFactory.with).toHaveBeenCalledWith(token);
        
        controller.$onInit();

        expect(trelloAPI.checkLists).toHaveBeenCalled();
        var apiArguments = trelloAPI.checkLists.calls.mostRecent().args;
        expect(apiArguments[0]).toBe(card.id);
        var successCallBack = apiArguments[1];
        successCallBack(expectedCheckLists);
        expect(controller.checkLists).toEqual(expectedCheckLists);
    });

    it('should count complete and total items of all checlists', function() {
        var checkLists = [someCheckList(), someCheckList()];
        controller.$onInit();
        expect(trelloAPI.checkLists).toHaveBeenCalled();
        var successCallBack = trelloAPI.checkLists.calls.mostRecent().args[1];
        successCallBack(checkLists);
        expect(controller.completeItemCount).toBe(2);
        expect(controller.totalItemCount).toBe(4);
    });

    it('should toggle show checklist items', function() {
        expect(controller.showCheckLists).toBeFalsy();
        
        controller.toggleShowCheckLists();
        expect(controller.showCheckLists).toBeTruthy();

        controller.toggleShowCheckLists();
        expect(controller.showCheckLists).toBeFalsy();
    });

    function someCheckList() {
        return {
            'id': 'checkListId',
            'name': 'SampleCheckList',
            'checkItems': [
                {
                'state': 'complete',
                'id': 'checkItemId1',
                'name': 'CheckItem1'
                },
                {
                'state': 'incomplete',
                'id': 'checkItemId2',
                'name': 'CheckItem2'
                }
            ]
        }
    }

    function someCard() {
        return {
            name: 'MyCard',
            dateLastActivity: '2018-12-28',
            closed: true,
            id: 'someId',
            url: 'trelloUrl'
        }
    };

    function initController() {
        controller = $controller('TrelloCardController', {
            $scope: scope,
            AuthService: authService,
            TrelloAPIFactory: trelloAPIFactory
        }, binding);
    }

});