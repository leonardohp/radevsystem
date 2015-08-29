define(['index'], function (index) {
    'use strict';

    index.register.service('ResourceLoaderService', ['$resource', function ($resource) {
        var defaultResources = {
            update: {
                method: 'PUT',
                isArray: false
            },

            batchSave: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'batchSave'
                }
            }
        };
        
        this.loadDefaultResources = function (restURL) {
            return $resource(restURL + '/:method/', {}, defaultResources);
        };

        this.loadSpecificResources = function (restURL, specificResources) {
            angular.extend(specificResources, defaultResources);
            return $resource(restURL + '/:method/', {}, specificResources);
        };
    }]);
    
});