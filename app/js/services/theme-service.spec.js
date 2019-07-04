beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: ThemeService', function() {
    var ThemeService, StorageService;
    var callBack;
    var KEY = 'theme_key';
    var DARK = 'dark';
    var DEFAULT = 'default';
    
    beforeEach(function() {
      StorageService = {
          getStorage: jasmine.createSpy(),
          setStorage: jasmine.createSpy()
      };
      callBack = jasmine.createSpy();

      module(function($provide) {
        $provide.value('StorageService', StorageService);
      });

      inject(function(_ThemeService_) {
        ThemeService = _ThemeService_;
      });
    });

    it('should get theme', function() {
        ThemeService.getTheme(callBack);
        expect(StorageService.getStorage).toHaveBeenCalledWith(KEY, callBack)
    });

    it('should toggle theme to default if no set', function() {
        var theme = ThemeService.toggleTheme();
        expect(StorageService.setStorage).toHaveBeenCalledWith(KEY, theme);

        expect(theme).toBe(DEFAULT);
    });

    it('should toggle theme to default from dark', function() {
        var theme = ThemeService.toggleTheme(DARK);
        expect(StorageService.setStorage).toHaveBeenCalledWith(KEY, theme);

        expect(theme).toBe(DEFAULT);
    });

    it('should toggle theme to dark from default', function() {
        var theme = ThemeService.toggleTheme(DEFAULT);
        expect(StorageService.setStorage).toHaveBeenCalledWith(KEY, theme);

        expect(theme).toBe(DARK);
    });

});
  