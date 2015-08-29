
define(['index'], function (index) {
    'use strict';
    
    index.register.factory('ConfigManager', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/configManager');

        factory.getConfig = function(nomConfigur, desLocalizConfigur, callback) {
            var call = this.get({method: 'getConfig', nomConfigur: nomConfigur, desLocalizConfigur: desLocalizConfigur}, {});
            processPromise(call, callback);
        };

        factory.saveConfig = function(nomConfigur, desLocalizConfigur, desConfigur, desValConfigur, callback) {
            var call = this.save({method: 'saveConfig', nomConfigur: nomConfigur, desLocalizConfigur: desLocalizConfigur, desConfigur: desConfigur, desValConfigur: desValConfigur}, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
    
});