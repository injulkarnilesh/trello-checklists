beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ShowTrelloBoardsController', function() {
	var controller;
    var authService, trelloAPIFactory, trelloAPI;
    var $controller;
    var scope;
    var token;

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
            userDetails: jasmine.createSpy(),
            boards: jasmine.createSpy()
        };
        authService.getToken.and.returnValue(token);
        trelloAPIFactory.with.and.returnValue(trelloAPI);
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should load cards', function() {
        var expectedBoards = [someBoard(), someBoard()];
        expect(authService.getToken).toHaveBeenCalled();
        expect(trelloAPIFactory.with).toHaveBeenCalledWith(token);

        expect(trelloAPI.boards).toHaveBeenCalled();
        var callBacks = trelloAPI.boards.calls.mostRecent().args;
        var successCallBack = callBacks[0];
        successCallBack(expectedBoards);
        expect(controller.boards).toEqual(expectedBoards);
    });

    it('should list closed boards at end', function() {
        var openBoard = someBoard();
        openBoard.closed = false;
        var closedBoard = someBoard();
        closedBoard.closed = true;
        var boardsResponse = [closedBoard, openBoard];
    
        expect(trelloAPI.boards).toHaveBeenCalled();
        var successCallBack = trelloAPI.boards.calls.mostRecent().args[0];
        successCallBack(boardsResponse);
        expect(controller.boards[0]).toEqual(openBoard);
        expect(controller.boards[1]).toEqual(closedBoard);
    });

    it('should order boards by last activity date descending', function() {
        var latestBoard = someBoard();
        latestBoard.dateLastActivity = '2017-11-11';
        var olderBoard = someBoard();
        olderBoard.dateLastActivity = '2017-07-15';
        var boardsResponse = [olderBoard, latestBoard];
    
        expect(trelloAPI.boards).toHaveBeenCalled();
        var successCallBack = trelloAPI.boards.calls.mostRecent().args[0];
        successCallBack(boardsResponse);
        expect(controller.boards[0]).toEqual(latestBoard);
        expect(controller.boards[1]).toEqual(olderBoard);
    });

    it('should order boards by closed state and then last activity date descending', function() {
        var latestBoard = someBoard();
        latestBoard.dateLastActivity = '2017-11-11';
        latestBoard.closed = false;

        var olderBoardClosed = someBoard();
        olderBoardClosed.dateLastActivity = '2017-07-15';
        olderBoardClosed.closed = true;

        var oldestBoard = someBoard();
        oldestBoard.dateLastActivity = '2011-06-15';
        oldestBoard.closed = false;

        
        var boardsResponse = [olderBoardClosed, latestBoard, oldestBoard];
    
        expect(trelloAPI.boards).toHaveBeenCalled();
        var successCallBack = trelloAPI.boards.calls.mostRecent().args[0];
        successCallBack(boardsResponse);
        expect(controller.boards[0]).toEqual(latestBoard);
        expect(controller.boards[1]).toEqual(oldestBoard);
        expect(controller.boards[2]).toEqual(olderBoardClosed);
    });

    function someBoard() {
        return {
            name: 'MyBoard',
            dateLastActivity: '2018-12-28',
            closed: true,
            id: 'someId',
            url: 'trelloUrl',
            prefs: {
                backgroundColor: 'HEXA-background'
            }
        }
    };

    function initController() {
        controller = $controller('ShowTrelloBoardsController', {
            $scope: scope,
            AuthService: authService,
            TrelloAPIFactory: trelloAPIFactory
        });
    }

});