define(['index'], function (index) {
    'use strict';
    
    index.register.controller('EcmConfigurationCtrl',['$scope', '$filter', '$modalInstance', 'EcmConfiguration', 'messageHolder', function ($scope, $filter, $modalInstance, EcmConfiguration, messageHolder) {
        var i18n = $filter('i18n');
        
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
        
        $scope.activeLink = false;
        $scope.currentFolder = {id: 0, description: ''};
        $scope.ecmFolders = [];
        $scope.expandedNodes = [];
        
        //Opção da TREE para informar se o nó é ou não uma "folha".
        $scope.treeOptions = {
            isLeaf: function (node) {
                node.description = node.description || '[Pasta sem descrição]';
                return false;
            }
        };
        
        $scope.startUp = function () {
            EcmConfiguration.getCurrentConfiguration(function (config) {
            
                var alert;
                
                if (config.errorMessage != undefined) {

                    alert = {type:messageHolder.ERROR,title:i18n('ecm-error-config'),detail:config.errorMessage};
                    messageHolder.showNotify(alert);
                    
                } else {
                
                    var node = null;
                    
                    $scope.activeLink = config.activeLink;
                    $scope.ecmFolders = config.ecmFolders;
                    
                    node = findCurrentNode(config.currentFolderId, $scope.ecmFolders);
                    $scope.selectFolder(node);
                }
            });
		};
        
        $scope.selectFolder = function (node) {
            $scope.currentFolder = node;
        };
		
        $scope.close = function () {
            $modalInstance.close();
		};
		
        $scope.save = function () {
            EcmConfiguration.saveConfiguration(
                $scope.activeLink,
                $scope.currentFolder.id,
                $scope.currentFolder.description,
                function (result) {
                    var alert = null;
                    
                    if (result.$resolved) {
                        alert = {type:messageHolder.SUCCESS,title:i18n('ecm-config'),detail:i18n('ecm-config-success')};
                    } else {
                        alert = {type:messageHolder.ERROR,title:i18n('ecm-config'),detail:i18n('ecm-config-error')};
                    }
                    
                    $modalInstance.close();
                    messageHolder.showNotify(alert);
                }
            );
		};
		
        $scope.startUp();
	}]);
    
});