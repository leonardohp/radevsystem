define(['index'], function (index) {
    'use strict';
    
    index.register.controller('ObtainDocumentsCtrl', ['$scope', '$modalInstance', '$window', '$filter', 'messageHolder', 'GEDIntegration', 'ModalWindow', 'options', '$rootScope', 'ServiceDownloadFile', function ($scope, $modalInstance, $window, $filter, messageHolder, GEDIntegration, ModalWindow, options, $rootScope, ServiceDownloadFile) {
    	var i18n = $filter('i18n');
	
		$scope.downloadToCentralDocuments = function () {
			var document = options.document;
			GEDIntegration.downloadToDocumentsCentral(document.id, document.version, document.fileName, function (result) {
				if (result.downloaded) {
					$rootScope.getPulseInformation(false);
					if (options.callback) options.callback(true);
					$scope.close();
					
				} else {
					messageHolder.showNotify({type:messageHolder.ERROR,title:i18n('move-central-document'),detail:i18n('error-move-central-document')});					
					$scope.close();
				}
			});
		}
		
		$scope.downloadLocal = function () {
			var document = options.document;
			GEDIntegration.downloadLocal(document.id, document.version, document.fileName, function (result) {
				if (result.fullPathFile.trim() !== "") {
					 if (!window.location.origin) {
						window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
					 }
					 var fullURL = window.location.origin + "/datasul/"  + result.fullPathFile;
					 ServiceDownloadFile.quickDownload(document.fileName, fullURL);
					 $scope.close();
				} else {
					messageHolder.showNotify({type:messageHolder.ERROR,title:i18n('download-document-ecm'),detail:i18n('error-download-document-ecm')});
					$scope.close();
				}				
			});
		}
		
		$scope.close = function() {
			$modalInstance.close();
		}
			
	}]);

});