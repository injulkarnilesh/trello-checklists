beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ShowFavoriteCardsController', function() {
	var controller;
    var favoriteCardsService;
    var $controller;
    var scope;
    var registerReloadFavoritesCallBack;

	beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        
        favoriteCardsService = {
            getFavoriteCards: jasmine.createSpy()
        }
        
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
        expect(controller.favoriteCards).toEqual(expectedCards);
    });

    it('should register for reload favourte card', function() {
        controller.$onInit();

        expect(registerReloadFavoritesCallBack).toHaveBeenCalled();
        var callBackRegisred = registerReloadFavoritesCallBack.calls.mostRecent().args[0].callBack;
        callBackRegisred();

        expect(favoriteCardsService.getFavoriteCards).toHaveBeenCalledTimes(2);
    });

    function initController() {
        controller = $controller('ShowFavoriteCardsController', {
            $scope: scope,
            FavoriteCardsService: favoriteCardsService
        }, binding);
    }

});