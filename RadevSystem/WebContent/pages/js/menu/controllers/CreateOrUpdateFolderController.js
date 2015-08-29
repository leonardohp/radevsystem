define(['index'], function (index) {
    'use strict';
    
    index.register.controller('CreateOrUpdateFolderCtrl', ['$scope', '$modalInstance', 'messageHolder', 'GEDIntegration', 'options', '$rootScope', '$filter', function ($scope, $modalInstance, messageHolder, GEDIntegration, options, $rootScope, $filter) {
    	var i18n = $filter('i18n');
		
		$scope.title = options.title;
		
		if (options.isNew) {
			$scope.fileName = '';
		} else {
			$scope.fileName = options.selectedDocument.fileName;
		}
		
	 	$scope.close = function () {
            $modalInstance.close();
        };
		
		$scope.confirm = function() {
			if (options.isNew) {
				GEDIntegration.createSubFolder(options.selectedDocument.id, $scope.fileName, function (result) {
					if (result.folderId > 0) {
						var result = {id: result.folderId, 'fileName': $scope.fileName, 'version': "1000", modificationDate: null, parentId: options.selectedDocument.id, documentType: 1};

						if (options.confirm) options.confirm(true, result);
						$scope.close();						
					} else {
						var title = i18n('error-update-folder');
						var message = i18n('not-possible-update-folder');
						var details = i18n('verify-permision-update-folder');
				messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {$scope.callActivePage();});
						
					}
				});				
			} else {
				GEDIntegration.updateFolder(options.selectedDocument.id, $scope.fileName, function (result) {
					if (result.updated) {
						var result = {fileName: $scope.fileName};

						if (options.confirm) options.confirm(false, result);
						$scope.close();
					} else {
						var title = i18n('error-update-folder');
						var message = i18n('not-possible-update-folder');
						var details = i18n('verify-permision-update-folder');
						messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {$scope.callActivePage();});
						
					}
				});
			}			
		}		

	}]);
    
});