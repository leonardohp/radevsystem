define(['index'], function (index) {
    'use strict';
    
    index.register.controller('MoveDocumentFolderCtrl', ['$scope', '$modalInstance', '$filter', 'messageHolder','GEDIntegration', 'ModalWindow', 'options', '$rootScope', 'EcmConfiguration', function ($scope, $modalInstance, $filter, messageHolder, GEDIntegration, ModalWindow, options, $rootScope, EcmConfiguration) {
        var i18n = $filter('i18n');
		
        $scope.selectedNode = {id: 0, fileName: '', version: '1000', parentId: 0, modificationDate: null};
        $scope.ecmFolders = [];
        $scope.expandedNodes = [];
		$scope.canSelectFolder = true;
		
		//Opção da TREE para informar se o nó é ou não uma "folha".
        $scope.treeOptions = {
            isLeaf: function (node) {
				
                node.fileName = node.fileName || '[Pasta sem descrição]';
                return false;
            }
        };
		
		var findCurrentNode = function (nodeId, folders) {
            var folder;
            
            for (var i = 0, len = folders.length; i < len; i ++) {
                if (folders[i].id === nodeId) {
                    folder = folders[i];
                } else {
                    folder = findCurrentNode(nodeId, folders[i].children || []);
                }
                
                if (folder) {
                    $scope.expandedNodes.push(folders[i]);
                    break;
                }
            }

			return folder;
        };
		
		$scope.startUp = function () {
			EcmConfiguration.getCurrentConfiguration(function (config) {
				var alert;
				if (config.errorMessage != undefined) {
					
					
					if(config.errorMessage.toLowerCase().indexOf("Senha") > 0 &&
					   config.errorMessage.toLowerCase().indexOf("inválida") > 0) {
						var titleEcm = i18n('ecm-error-config');
						var detailEcm = i18n('ecm-password-invalid');
						
						alert = {type:messageHolder.ERROR,title:titleEcm,detail:detailEcm};
						messageHolder.showNotify(alert);
					} else {
						alert = {type:messageHolder.ERROR,title:i18n('ecm-error-config'),detail:config.errorMessage};
						messageHolder.showNotify(alert);
					}
				} else {
					var node = null;
					$scope.ecmFolders = config.ecmFolders;
					node = findCurrentNode(options.document.parentId, $scope.ecmFolders);
					$scope.selectFolder(node);
				}
			});
		};
		
		$scope.onSelectFolder = function() {
			GEDIntegration.moveDocument(options.document.id, $scope.selectedNode.id, function(result) {
				if (result.moved) {
					if (options.callback) options.callback($scope.selectedNode.id);
					$scope.close();
				}				
			});			
		}
		
		$scope.selectFolder = function (node) {
			$scope.selectedNode = node;
			if (options.document.parentId == $scope.selectedNode.id) {
				$scope.canSelectFolder = true;
			} else {
				$scope.canSelectFolder = false;	
			}
        };
		
        $scope.close = function () {
            $modalInstance.close();
		};

		$scope.startUp();  
		
    }]);

});