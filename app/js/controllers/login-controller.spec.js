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
            location: {
                reload: jasmine.createSpy()
            }
        };
        $window.location.reload.and.callFake(function() { });
        authService = {
            getUrlToken: jasmine.createSpy(),
            loginNonInteractive: jasmine.createSpy(),
            isLoggedIn: jasmine.createSpy(),
            loginInteractive: jasmine.createSpy(),
            logout: jasmine.createSpy()
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
    });

    it('should not set login required when already logged in', function() {
        authService.isLoggedIn.and.returnValue(true);
        initController();
        expect(controller.loginRequired).toBe(false);
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

    it('should trello login', function() {
        controller.trelloLogin();
        expect(authService.loginInteractive).toHaveBeenCalled();
    });

    it('should trello logout', function() {
        controller.trelloLogout();
        expect(authService.logout).toHaveBeenCalled();
        expect($window.location.reload).toHaveBeenCalled();
    });

    function initController() {
        controller = $controller('TrelloLoginController', {
            $scope: scope,
            AuthService: authService,
            $window: $window
        });
    }

});