define(['index'], function (index) {
    'use strict';
    
    index.register.factory('ExecuteProgram', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/execProgram');

        factory.returnParamsLocalExecute = function(sessionId, localShortcut, callback) {
            var call = this.get({method: 'returnParamsLocalExecute',sessionId: sessionId,localShortcut: localShortcut}, {});
            processPromise(call, callback);
        };
        
        factory.returnParamsRemoteExecute = function(sessionId, callback) {
            var call = this.get({method: 'returnParamsRemoteExecute',sessionId: sessionId}, {});
            processPromise(call, callback);
        };
        
        factory.execProgress = function(sessionId, program, params, programID, callback) {
            var call = this.get({method: 'execProgress',sessionId: sessionId, program: program, params: params, programID: programID}, {});
            processPromise(call, callback);
        };
        
        factory.quitDI = function(sessionId, callback) {
            var call = this.get({method: 'quitDI',sessionId: sessionId}, {});
            processPromise(call, callback);
        };
        
        factory.sendLicenseData = function(sessionId, callback) {
            var call = this.save({method: 'sendLicenseData',sessionId: sessionId}, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
    
});