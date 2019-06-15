beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ShowTrelloBoardsController', function() {
	var controller;
    var authService, trelloAPIFactory, trelloAPI;
    var $controller;
    var scope;
    var token, boardId;
    var binding;
    var registerForBoardChange;

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
            cards: jasmine.createSpy()
        };
        authService.getToken.and.returnValue(token);
        trelloAPIFactory.with.and.returnValue(trelloAPI);
        boardId = 'someBoardId';
        registerForBoardChange = jasmine.createSpy(); 
        binding = {
            'boardId': boardId,
            'registerForBoardChange': registerForBoardChange
        };
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should take boardId', function() {
        expect(controller.boardId).toBe(boardId);
    });

    it('should load cards', function() {
        var expectedCards = [someCard(), someCard()];
        expect(authService.getToken).toHaveBeenCalled();
        expect(trelloAPIFactory.with).toHaveBeenCalledWith(token);
        
        controller.$onInit();
        expect(trelloAPI.cards).toHaveBeenCalled();
        var apiArguments = trelloAPI.cards.calls.mostRecent().args;
        expect(apiArguments[0]).toBe(boardId);
        var successCallBack = apiArguments[1];
        successCallBack(expectedCards);
        expect(controller.cards).toEqual(expectedCards);
    });

    it('should order cards by last activity date descending', function() {
        var latestCard = someCard();
        latestCard.dateLastActivity = '2017-11-11';
        var olderCard = someCard();
        olderCard.dateLastActivity = '2017-07-15';
        var boardsResponse = [olderCard, latestCard];
    
        controller.$onInit();
        expect(trelloAPI.cards).toHaveBeenCalled();
        var successCallBack = trelloAPI.cards.calls.mostRecent().args[1];
        successCallBack(boardsResponse);
        expect(controller.cards[0]).toEqual(latestCard);
        expect(controller.cards[1]).toEqual(olderCard);
    });

    it('should register for board change', function() {
        var someOtherBoardId = 'someOtherBoardId';
        controller.$onInit();
        
        expect(registerForBoardChange).toHaveBeenCalled();
        var callBackRegistered = registerForBoardChange.calls.mostRecent().args[0].callBack;
        callBackRegistered(someOtherBoardId);
        expect(trelloAPI.cards).toHaveBeenCalled();
        var apiArguments = trelloAPI.cards.calls.mostRecent().args;
        expect(apiArguments[0]).toBe(someOtherBoardId);
    });

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
        controller = $controller('ShowTrelloCardsController', {
            $scope: scope,
            AuthService: authService,
            TrelloAPIFactory: trelloAPIFactory
        }, binding);
    }

});