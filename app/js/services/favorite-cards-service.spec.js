beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: FavoriteCardsService', function() {
    var FavoriteCardsService, StorageService;
    var callBack;
    var KEY = 'favorite_cards';
    
    beforeEach(function() {
      StorageService = {
          getStorage: jasmine.createSpy(),
          setStorage: jasmine.createSpy()
      };
      callBack = jasmine.createSpy();

      module(function($provide) {
        $provide.value('StorageService', StorageService);
      });

      inject(function(_FavoriteCardsService_) {
        FavoriteCardsService = _FavoriteCardsService_;
      });
    });
  
    it('should get favorite cards', function() {
        FavoriteCardsService.getFavoriteCards(callBack);
        
        expect(StorageService.getStorage).toHaveBeenCalledWith(KEY, callBack);
    });

    it('should favorite card when none is', function() {
      var cardId = 'someCardId';
      
      FavoriteCardsService.favoriteCard(cardId, callBack);

      verifyGetCards(undefined);
      verifySetCards([cardId]);
    });

    it('should favorite card when already few are', function() {
      var cardId = 'someCardId';
      var anotherCardId = 'anotherCardId';
      var yetAnotherCardId = 'yetAnotherCardId';
      var existingCardIds = [anotherCardId, yetAnotherCardId];
      
      FavoriteCardsService.favoriteCard(cardId, callBack);

      verifyGetCards(existingCardIds);
      verifySetCards([cardId, anotherCardId, yetAnotherCardId]);
    });

    it('should unfavorite card when found', function() {
      var cardId = 'someCardId';
      var anotherCardId = 'anotherCardId';
      var yetAnotherCardId = 'yetAnotherCardId';
      var existingCardIds = [anotherCardId, cardId, yetAnotherCardId];
      
      FavoriteCardsService.unFavoriteCard(cardId, callBack);

      verifyGetCards(existingCardIds);
      verifySetCards([anotherCardId, yetAnotherCardId]);
    });

    it('should not unfavorite card when not found', function() {
      var cardId = 'someCardId';
      var anotherCardId = 'anotherCardId';
      var yetAnotherCardId = 'yetAnotherCardId';
      var existingCardIds = [anotherCardId, yetAnotherCardId];
      
      FavoriteCardsService.unFavoriteCard(cardId, callBack);

      verifyGetCards(existingCardIds);
      expect(StorageService.setStorage).not.toHaveBeenCalled();
    });

    it('should not unfavorite card when none found', function() {
      var cardId = 'someCardId';
      var existingCardIds = undefined;
      
      FavoriteCardsService.unFavoriteCard(cardId, callBack);

      verifyGetCards(existingCardIds);
      expect(StorageService.setStorage).not.toHaveBeenCalled();
    });

    function verifyGetCards(existingCardIds) {
      expect(StorageService.getStorage).toHaveBeenCalled();
      var getArgs = StorageService.getStorage.calls.mostRecent().args;
      expect(getArgs[0]).toBe(KEY);
      var getCallBack = getArgs[1];
      getCallBack(existingCardIds);
    }

    function verifySetCards(setCards) {
      expect(StorageService.setStorage).toHaveBeenCalled();
      var setArgs = StorageService.setStorage.calls.mostRecent().args;
      
      expect(setArgs[0]).toBe(KEY);
      
      var cardIdArray = setArgs[1];
      expect(cardIdArray).toBeDefined();
      expect(cardIdArray.length).toBe(setCards.length);
      expect(cardIdArray).toEqual(setCards);
      
      var setCallBack = setArgs[2];
      setCallBack();
      expect(callBack).toHaveBeenCalled();
    }
});
  