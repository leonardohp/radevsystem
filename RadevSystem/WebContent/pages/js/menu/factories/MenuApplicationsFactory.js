define(['index'], function (index) {
    'use strict';

    index.register.factory('MenuApplications', ['ResourceLoaderService', function (ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/applicationMenu/:methodName/:moduleId');
        
        factory.getApplicationByModule = function (moduleId, callback) {
            var call = this.get({methodName: 'getApplicationByModule', moduleId: moduleId});
            processPromise(call, callback);
        };

        factory.setApplications = function (applications) {
            this.applications = applications;
        };
            
        factory.getApplications = function (applications) {
            return this.applications || [];
        };
        
        return factory;
    }]);
    
});