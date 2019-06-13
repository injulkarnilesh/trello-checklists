beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: TrelloLoginController', function() {
	var controller;
    var authService;
    var $controller;
    var $window;
    var scope;

	beforeEach(inject(function(_$controller_, $rootScope) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        $window = {
            close: jasmine.createSpy()
        };
        $window.close.and.callFake(function() { });
        authService = {
            getUrlToken: jasmine.createSpy(),
            loginNonInteractive: jasmine.createSpy(),
            isLoggedIn: jasmine.createSpy(),
            loginInteractive: jasmine.createSpy(),
            logout: jasmine.createSpy(),
            shouldLogout: jasmine.createSpy()
        }
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should set login required when not logged in', function() {
        authService.isLoggedIn.and.returnValue(false);
        initController();

        expect(controller.loginRequired).toBe(true);
        expect(authService.loginInteractive).toHaveBeenCalled();
    });

    it('should not set login required when already logged in', function() {
        authService.loginInteractive.calls.reset();
        authService.isLoggedIn.and.returnValue(true);
        initController();

        expect(controller.loginRequired).toBe(false);
        expect(authService.loginInteractive).not.toHaveBeenCalled();
    });

    it('should login interactively when token found in URL', function() {
        authService.getUrlToken.and.returnValue('someToken');
        initController();

        expect(authService.loginNonInteractive).toHaveBeenCalled();
    });

    it('should not login interactively when token not found in URL', function() {
        authService.getUrlToken.and.returnValue(undefined);
        initController();

        expect(authService.loginNonInteractive).not.toHaveBeenCalled();
    });

    it('should trello logout', function() {
        controller.trelloLogout();

        expect(authService.logout).toHaveBeenCalled();
        expect($window.close).toHaveBeenCalled();
    });

    it('should logout if requested', function() {
        authService.shouldLogout.and.returnValue(true);
        initController();

        expect(authService.logout).toHaveBeenCalled();
        expect($window.close).toHaveBeenCalled();
    });

    function initController() {
        controller = $controller('TrelloLoginController', {
            $scope: scope,
            AuthService: authService,
            $window: $window
        });
    }

});