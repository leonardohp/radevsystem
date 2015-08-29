define(['index'], function (index) {
    'use strict';

    index.register.service('License', ['$rootScope', '$resource', 'ResourceLoaderService', function($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/license');

        factory.consumeLicense = function(sessionId, module, routine, callback) {
            var operatingSystem = navigator.platform;
            var browse          = navigator.appName;
            var browseVersion   = navigator.appVersion;
            
            var call = this.save({method: 'consumeLicense', sessionId: sessionId,
                                                            module: module,
                                                            routine: routine,
                                                            operatingSystem: operatingSystem,
                                                            browse: browse,
                                                            browseVersion: browseVersion}, {});
            processPromise(call, callback);
        };
        
        factory.releaseLicense = function(sessionId, module, routine, callback) {
            
            var call = this.save({method: 'releaseLicense', sessionId: sessionId,
                                                            module: module,
                                                            routine: routine}, {});
            processPromise(call, callback);
        };

        factory.killLicense = function(sessionId, callback) {
            var call = this.save({method: 'killLicense', sessionId: sessionId}, {});
            processPromise(call, callback);
        };
        
        factory.checkLicense = function(sessionId, callback) {
            var call = this.get({method: 'checkLicense', sessionId: sessionId, noCountRequest: true}, {});
            processPromise(call, callback);
        }
        
        return factory;
    }]);
    
});