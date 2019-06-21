beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ShowFavoriteCardsController', function() {
	var controller;
    var favoriteCardsService, trelloAPIFactory, trelloAPI, authService;
    var $controller;
    var scope, token;
    var registerReloadFavoritesCallBack;

	beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope.$new();
        token = 'token';
        $controller = _$controller_;
        
        favoriteCardsService = {
            getFavoriteCards: jasmine.createSpy()
        }
        authService = {
            getToken: jasmine.createSpy()
        };
        trelloAPIFactory = {
            with: jasmine.createSpy()
        };
        trelloAPI = {
            card: jasmine.createSpy()
        };
        authService.getToken.and.returnValue(token);
        trelloAPIFactory.with.and.returnValue(trelloAPI);

        registerReloadFavoritesCallBack = jasmine.createSpy(); 
        binding = {
            'registerReloadFavoritesCallBack': registerReloadFavoritesCallBack
        };
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should load favorite cards', function() {
        var expectedCards = ['cardId'];

        controller.$onInit();

        expect(favoriteCardsService.getFavoriteCards).toHaveBeenCalled();
        var successCallBack = favoriteCardsService.getFavoriteCards.calls.mostRecent().args[0];
        successCallBack(expectedCards);
        expect(controller.favoriteCardIds).toEqual(expectedCards);
    });

    it('should register for reload favourte card', function() {
        controller.$onInit();

        expect(registerReloadFavoritesCallBack).toHaveBeenCalled();
        var callBackRegisred = registerReloadFavoritesCallBack.calls.mostRecent().args[0].callBack;
        callBackRegisred();

        expect(favoriteCardsService.getFavoriteCards).toHaveBeenCalledTimes(2);
    });

    it('should load card details', function() {
        expect(authService.getToken).toHaveBeenCalled();
        expect(trelloAPIFactory.with).toHaveBeenCalled();
        var favoriteCards = ['cardId1', 'cardId2'];
        var card1 = someCard();
        card1.name = 'Card1';
        var card2 = someCard();
        card2.name = card2;

        controller.$onInit();

        expect(favoriteCardsService.getFavoriteCards).toHaveBeenCalled();
        var successCallBack = favoriteCardsService.getFavoriteCards.calls.mostRecent().args[0];
        successCallBack(favoriteCards);
        
        expect(trelloAPI.card).toHaveBeenCalledTimes(2);
        var allCallArgs = trelloAPI.card.calls.all();

        var firstCallArgs = allCallArgs[0].args;
        expect(firstCallArgs[0]).toBe(favoriteCards[0]);
        firstCallArgs[1](card1);
        expect(controller.favoriteCards[0]).toBe(card1);

        var secondCallArgs = allCallArgs[1].args;
        expect(secondCallArgs[0]).toBe(favoriteCards[1]);
        secondCallArgs[1](card2);
        expect(controller.favoriteCards[1]).toBe(card2);
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
        controller = $controller('ShowFavoriteCardsController', {
            $scope: scope,
            FavoriteCardsService: favoriteCardsService,
            AuthService: authService,
            TrelloAPIFactory: trelloAPIFactory
        }, binding);
    }

});