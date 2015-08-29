define(['index'], function (index) {
    'use strict';

    index.register.factory('EcmConfiguration',['ResourceLoaderService', function (ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/ecmConfiguration');

        factory.getCurrentConfiguration = function (callback) {
            var call = this.get({ method: 'getCurrentConfiguration' }, {});
            processPromise(call, callback);
        };

        factory.saveConfiguration = function (activeLink, folderId, folderDescription, callback) {
            var call = this.save({
                method: 'saveConfiguration',
                activeLink: activeLink,
                folderId: folderId,
                folderDescription: folderDescription
            }, {});

            processPromise(call, callback);
        };

        return factory;
    }]);
    
});