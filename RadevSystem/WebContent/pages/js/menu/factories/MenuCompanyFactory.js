define(['index'], function (index) {
    'use strict';

    index.register.factory('MenuCompany', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/companyMenu');

        factory.getCompany = function(callback) {
            var call = this.get({method: 'getCompany'}, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
    
});