beforeEach(module('chrome.plugin.trello.checklist'));

describe('Unit: TrelloChecklistsController', function() {
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
            getToken: jasmine.createSpy(),
            isLoggedIn: jasmine.createSpy(),
            logout: jasmine.createSpy(),
            toLoginPage: jasmine.createSpy(),
            toLogoutPage: jasmine.createSpy()
        };
        trelloAPIFactory = {
            with: jasmine.createSpy()
        };
        trelloAPI = {
            userDetails: jasmine.createSpy()
        };
        authService.getToken.and.returnValue(token);
        trelloAPIFactory.with.and.returnValue(trelloAPI);
        initController();
    }));

    it('should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should check if user is logged in', function() {
        authService.isLoggedIn.and.returnValue(true);
        initController();

        expect(controller.isLoggedIn).toBe(true);
        expect(authService.isLoggedIn).toHaveBeenCalled();
    });

    it('should create trello api if logged in', function() {
        authService.isLoggedIn.and.returnValue(true);
        initController();

        expect(trelloAPIFactory.with).toHaveBeenCalledWith(token);
        expect(controller.trelloAPI).toBe(trelloAPI);
    });

    it('should not create trello api if not logged in', function() {
        authService.isLoggedIn.and.returnValue(false);
        initController();

        expect(trelloAPIFactory.with).not.toHaveBeenCalled();
        expect(controller.trelloAPI).toBeUndefined();
    });

    it('should get user details if logged in', function() {
        authService.isLoggedIn.and.returnValue(true);
        initController();

        expect(trelloAPI.userDetails).toHaveBeenCalled();
        var userDetailsArgs = trelloAPI.userDetails.calls.mostRecent().args;
        var successCallback = userDetailsArgs[0];
        var user = someUser();
        successCallback(user);
        expect(controller.user.id).toBe(user.id);
        expect(controller.user.username).toBe(user.username);
        expect(controller.user.fullName).toBe(user.fullName);
        expect(controller.user.email).toBe(user.email);
        expect(controller.user.url).toBe(user.url);
        expect(controller.user.avatarUrl).toBe(user.avatarUrl);
    });

    it('should login with login page', function() {
        controller.login();

        expect(authService.toLoginPage).toHaveBeenCalled();
    });

    it('should logout with logout page', function() {
        controller.logout();

        expect(authService.toLogoutPage).toHaveBeenCalled();
    });

    function someUser() {
        return {
            'id': '2342',
            'username': 'Me',
            'fullName': 'Me You',
            'email': 'me.you@mail.c',
            'url': '/url',
            'avatarUrl': 'avatar'
        };
    }

    function initController() {
        controller = $controller('TrelloChecklistsController', {
            $scope: scope,
            AuthService: authService,
            TrelloAPIFactory: trelloAPIFactory
        });
    }

});