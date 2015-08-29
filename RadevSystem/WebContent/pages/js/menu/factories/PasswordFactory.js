define(['index'], function (index) {
    'use strict';
    
    index.register.factory('Password', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/password');

        factory.getLoginIntegrSo = function(callback) {
            var call = this.get({method: 'getLoginIntegrSo'}, {});
            processPromise(call, callback);
        };

        factory.changePassword = function(userData, callback) {
            var call = this.update({method: 'changePassword', userData: userData}, {});
            processPromise(call, callback);
        };
        
        factory.getUserPwdChanged = function (sessionId, callback) {
        	var call = this.get({ method: 'getUserPwdChanged', sessionId:sessionId, noCountRequest: true }, {});
        	processPromise(call, callback);
        };

        return factory;
    }]);
    
});