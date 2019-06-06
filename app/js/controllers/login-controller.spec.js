beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: TrelloLoginController', function() {
	var scope;
	var loginController;
    var authService;
    var controller;
    var $window;

	beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller;
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
        expect(loginController).toBeDefined();
    });

    it('should set login required when not logged in', function() {
        authService.isLoggedIn.and.returnValue(false);
        initController();
        expect(loginController.loginRequired).toBe(true);
    });

    it('should not set login required when already logged in', function() {
        authService.isLoggedIn.and.returnValue(true);
        initController();
        expect(loginController.loginRequired).toBe(false);
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
        loginController.trelloLogin();
        expect(authService.loginInteractive).toHaveBeenCalled();
    });

    it('should trello logout', function() {
        loginController.trelloLogout();
        expect(authService.logout).toHaveBeenCalled();
        expect($window.location.reload).toHaveBeenCalled();
    });

    function initController() {
        loginController = controller('TrelloLoginController', {
            $scope: scope,
            AuthService: authService,
            $window: $window
        });
    }

});