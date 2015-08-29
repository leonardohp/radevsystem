define(['index'], function (index) {
    'use strict';

    index.register.factory('GEDIntegration', ['ResourceLoaderService', function (ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/gedIntegration');

        factory.getGEDDocuments = function (callback) {
            var call = this.get({ method: 'getGEDDocuments', noCountRequest: true }, {});
            processPromise(call, callback);
        };

        factory.refreshGEDDocuments = function (callback) {
            var call = this.get({ method: 'refreshGEDDocuments' }, {});
            processPromise(call, callback);
        };

        factory.createSubFolder = function (parentFolderId, folderName, callback) {
            var call = this.save({ method: 'createSubFolder', parentFolderId: parentFolderId, folderName: folderName }, {});
            processPromise(call, callback);
        };

        factory.updateFolder = function (folderId, folderName, callback) {
            var call = this.update({ method: 'updateFolder', folderId: folderId, folderName: folderName }, {});
            processPromise(call, callback);
        };

        factory.removeFolder = function (folderId, callback) {
            var call = this.delete({ method: 'removeFolder', folderId: folderId }, {});
            processPromise(call, callback);
        };

        factory.downloadLocal = function (documentId, version, fileName, callback) {
            var call = this.get({ method: 'downloadLocal', documentId: documentId, version: version, fileName: fileName }, {});
            processPromise(call, callback);
        };

        factory.downloadToDocumentsCentral = function (documentId, version, fileName, callback) {
            var call = this.get({ method: 'downloadToDocumentsCentral', documentId: documentId, version: version, fileName: fileName }, {});
            processPromise(call, callback);
        };

        factory.moveDocument = function (documentIds, folderId, callback) {
            var call = this.update({ method: 'moveDocument', documentIds: documentIds, folderId: folderId }, {});
            processPromise(call, callback);
        };

        factory.removeDocument = function (documentId, callback) {
            var call = this.delete({ method: 'removeDocument', documentId: documentId }, {});
            processPromise(call, callback);
        };

        factory.getToken = function (callback) {
            var call = this.get({ method: 'getToken' }, {});
            processPromise(call, callback);
        };

        return factory;
    }]);
 
});