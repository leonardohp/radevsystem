define(['index'], function (index) {
    'use strict';

    index.register.factory('CentralDocuments', ['ResourceLoaderService', function (ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/centralDocuments');

        factory.getDocumentsList = function (callback) {
            var call = this.query({ method: 'getDocumentsList' }, {});
            processPromise(call, callback);
        };

        factory.publishDocuments = function (documents, callback) {
            var call = this.save({method: 'publishDocuments', documents: documents}, {});
            processPromise(call, callback);
        };

        factory.removeDocument = function (documents, callback) {
            var call = this.remove({method: 'removeDocument', documents: documents}, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
    
});