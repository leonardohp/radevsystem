define(['index'], function (index) {
    'use strict';

    index.register.factory('Tasks', ['ResourceLoaderService', function(ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/tasks');

        factory.getPendingTasks = function (callback) {
            var call = this.get({method: 'getPendingTasks', noCountRequest: true}, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
    
});