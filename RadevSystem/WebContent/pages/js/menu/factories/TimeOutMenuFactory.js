define(['index'], function (index) {
    'use strict';

    index.register.factory('TimeOutMenu', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/timeoutMenu');

        factory.getSitTimeout = function(sessionId, callback) {
            var call = this.get({method: 'getSitTimeout', sessionId: sessionId, noCountRequest: true}, {});
            processPromise(call, callback);
        };

        factory.getTimeoutExceptionGroup = function(userCode, callback) {
            var call = this.get({method: 'getTimeoutExceptionGroup', userCode: userCode, noCountRequest: true}, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
    
});