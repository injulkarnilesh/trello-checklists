beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ShowTrelloBoardsController', function() {
	var controller;
    var authService, trelloAPIFactory, trelloAPI, favoriteCardsService;
    var $controller;
    var scope;
    var token;
    var binding;
    var card;
    var favoriteCards;
    var reloadFavouriteCards;
    var INCOMPLETE_STATE = 'incomplete';
    var COMPLETE_STATE = 'complete';


	beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        token = 'someToken';
        favoriteCards = ['favoriteCard'];
        authService = {
            getToken: jasmine.createSpy()
        };
        trelloAPIFactory = {
            with: jasmine.createSpy()
        };
        favoriteCardsService = {
            favoriteCard: jasmine.createSpy(),
            unFavoriteCard: jasmine.createSpy()
        }
        trelloAPI = {
            checkLists: jasmine.createSpy(),
            toggleCheckListItem: jasmine.createSpy()
        };
        reloadFavouriteCards = jasmine.createSpy();

        card = someCard();
        binding = {
            card: card,
            reloadFavouriteCards: reloadFavouriteCards,
            favoriteCards: favoriteCards
        };
        authService.getToken.and.returnValue(token);
        trelloAPIFactory.with.and.returnValue(trelloAPI);
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should not be favorite updating', function() {
        expect(controller.favoriteUpdating).toBeFalsy();
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

    it('should toggle checklist item state from complete to incomplete', function() {
        controller.checkLists = [someCheckList()];
        var checkListItem = controller.checkLists[0].checkItems[0];

        controller.toggleItem(checkListItem);

        expect(trelloAPI.toggleCheckListItem).toHaveBeenCalled();
        var apiArgs = trelloAPI.toggleCheckListItem.calls.mostRecent().args;
        expect(apiArgs[0]).toBe(card.id);
        expect(apiArgs[1]).toBe(checkListItem.id);
        expect(apiArgs[2]).toBe(INCOMPLETE_STATE);
        var successCallBack = apiArgs[3];
        successCallBack();
        expect(checkListItem.state).toBe(INCOMPLETE_STATE);
        expect(controller.completeItemCount).toBe(0);
    });

    it('should toggle checklist item state from incomplete to complete', function() {
        controller.checkLists = [someCheckList()];
        var checkListItem = controller.checkLists[0].checkItems[1];

        controller.toggleItem(checkListItem);

        expect(trelloAPI.toggleCheckListItem).toHaveBeenCalled();
        var apiArgs = trelloAPI.toggleCheckListItem.calls.mostRecent().args;
        expect(apiArgs[0]).toBe(card.id);
        expect(apiArgs[1]).toBe(checkListItem.id);
        expect(apiArgs[2]).toBe(COMPLETE_STATE);
        var successCallBack = apiArgs[3];
        successCallBack();
        expect(checkListItem.state).toBe(COMPLETE_STATE);
        expect(controller.completeItemCount).toBe(2);
    });

    it('should check if checklist item is complete', function() {
        var checkList = someCheckList();
        var completeItem = checkList.checkItems[0];
        var inCompleteItem = checkList.checkItems[1];

        expect(controller.isComplete(completeItem)).toBeTruthy();
        expect(controller.isComplete(inCompleteItem)).toBeFalsy();
    });

    it('should not have items if no checklists set', function() {
        expect(controller.hasItems()).toBeFalsy();
    });

    it('should not have items if empty checklists', function() {
        controller.checkLists = [];
        
        expect(controller.hasItems()).toBeFalsy();
    });

    it('should not have items if has checklists but no items', function() {
        var emptyCheckList = someCheckList();
        emptyCheckList.checkItems = []
        controller.checkLists = emptyCheckList;
        
        expect(controller.hasItems()).toBeFalsy();
    });

    it('should have items if has checklists with items', function() {
        var checkList = someCheckList();
        controller.checkLists = checkList;
        
        controller.$onInit();
        expect(trelloAPI.checkLists).toHaveBeenCalled();
        var successCallBack = trelloAPI.checkLists.calls.mostRecent().args[1];
        successCallBack([checkList]);
        
        expect(controller.hasItems()).toBeTruthy();
    });

    it('should favorite card', function() {
        controller.favoriteIt();

        expect(controller.favoriteUpdating).toBeTruthy();
        
        expect(favoriteCardsService.favoriteCard).toHaveBeenCalled();
        var args = favoriteCardsService.favoriteCard.calls.mostRecent().args;
        expect(args[0]).toBe(controller.card.id);
        
        var callBack = args[1];
        callBack();
        expect(controller.favoriteUpdating).toBeFalsy();
        expect(reloadFavouriteCards).toHaveBeenCalled();
    });

    it('should un favorite card', function() {
        controller.unFavoriteIt();

        expect(controller.favoriteUpdating).toBeTruthy();
        
        expect(favoriteCardsService.unFavoriteCard).toHaveBeenCalled();
        var args = favoriteCardsService.unFavoriteCard.calls.mostRecent().args;
        expect(args[0]).toBe(controller.card.id);
        
        var callBack = args[1];
        callBack();
        expect(controller.favoriteUpdating).toBeFalsy();
        expect(reloadFavouriteCards).toHaveBeenCalled();
    });

    it('should check if is favorite card', function() {
        expect(controller.isFavorite()).toBeFalsy();
        
        controller.favoriteCards.push(controller.card.id);
        expect(controller.isFavorite()).toBeTruthy();
        
        controller.favoriteCards = undefined;
        expect(controller.isFavorite()).toBeFalsy();
    });

    function someCheckList() {
        return {
            'id': 'checkListId',
            'name': 'SampleCheckList',
            'checkItems': [
                {
                'state': COMPLETE_STATE,
                'id': 'checkItemId1',
                'name': 'CheckItem1'
                },
                {
                'state': INCOMPLETE_STATE,
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
            TrelloAPIFactory: trelloAPIFactory,
            FavoriteCardsService: favoriteCardsService
        }, binding);
    }

});