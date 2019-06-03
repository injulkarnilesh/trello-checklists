beforeEach(module('chrome.plugin.trynew'));

describe('TryNewRootController', function() {
	var scope;
	var controller;
    var storageService;

	beforeEach(inject(function($controller, $rootScope) {
        console.log("##BEFORE", controller);
        scope = $rootScope.$new();
        storageService = {
            getLastTab: jasmine.createSpy(),
            setLastTab: jasmine.createSpy()
        }
        
        controller = $controller('TryNewRootController', {
            $scope: scope,
            StorageService: storageService
        });

        console.log("##CON", controller);
    }));

    it('should not show settings by default', function() {
        expect(controller).toBeDefined();
        expect(controller.view.showSettings).toBeFalsy();  
    });

});