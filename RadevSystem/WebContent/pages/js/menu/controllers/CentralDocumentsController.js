define(['index'], function (index) {
    'use strict';

    index.register.controller('CentralDocumentsCtrl', ['$scope', '$filter', '$timeout', '$compile','$window','$rootScope','upload', '$modalInstance', 'CentralDocuments', 'MenuProperties', 'messageHolder', 'GEDIntegration', 'ModalWindow',  function ($scope, $filter, $timeout, $compile, $window, $rootScope, upload, $modalInstance, CentralDocuments, MenuProperties, messageHolder, GEDIntegration, ModalWindow) {
        var i18n = $filter('i18n');
        	
		$scope.titleCentralDocuments = i18n('central-documents');
		
        $scope.documents = [];
        $scope.selection = [];
        
        //Verifica se o ECM está integrado para habilitar o botão de publicação.
        $scope.isEcmActivated = MenuProperties.getProperty('ecm.integrated') === 'true';
        
        $scope.toggleSelection = function (document) {
            var index = $scope.selection.indexOf(document.fileName);

            if (index > -1) {
                $scope.selection.splice(index, 1);
            } else {
                $scope.selection.push(document.fileName);
            }
			if ($scope.selection.length === 0 ) {
				$scope.toggleAll = false;
			}
        };
		
		
		$scope.toggleSelectionAll = function () {
			$scope.selection = [];
			if ($scope.toggleAll) {
				var documents = $scope.documents;
				for(var i = 0; i < documents.length; i++) {
					$scope.toggleSelection(documents[i]);
				}
			} else {
				$scope.selection = [];
			}
        };
        
        $scope.getDocumentsList = function () {
            CentralDocuments.getDocumentsList(function (documents) {
                $scope.documents = documents;
                $scope.selection = [];
            });
        };
        
        $scope.startUploadDocument = function () {
            //Não sei explicar, mas precisa do $timeout para não ocorrer erro!
            $timeout(function() {
                document.getElementById('docfile').click();
            }, 0);
        };
        
        $scope.uploadDocument = function (docfile) {
            //WORKAROUND: o IE-11 está chamando esta função duas vezes seguidas
            //quando o valor do campo é alterado através da função docfile.val().
            if (docfile.value) {
                var fileName = null;
                
                docfile  = angular.element(docfile);
                fileName = docfile.val().replace(/\\/g,'/');
                fileName = fileName.substr(fileName.lastIndexOf('/') + 1);
                upload({
                    url: 'resources/centralDocuments/uploadDocument?name=' + fileName,
                    data: { file: docfile },
                    method: 'POST'
                }).then(function () {
                    docfile.val(undefined);

                    $scope.getDocumentsList();
                    messageHolder.showNotify({type:messageHolder.SUCCESS,title:i18n('new-document'),detail:i18n('new-document-success',fileName)});
                }, function () {
                    messageHolder.showNotify({type:messageHolder.ERROR,title:i18n('new-document'),detail:i18n('new-document-error',fileName)});
                });
            }
        };
        
        $scope.publishDocuments = function () {
            CentralDocuments.publishDocuments($scope.selection, function (result) {
                var alert;
                
                if (result.status) {
                    alert = {type:messageHolder.SUCCESS,title:i18n('documents-published'),detail:i18n('documents-published-ecm')};
                } else {
					var messageError = "";
					if (result.message == "ECM_INTEGRATION_FAILED") {
						messageError = i18n('ecm-integration-failed') + i18n('contact-adm-system');
					} else {
						messageError = i18n('ecm-folder-not-defined');
					}				
					alert = {type:messageHolder.ERROR,title:i18n('documents-not-published'),detail:messageError};
                }
                
                $scope.getDocumentsList();
                messageHolder.showNotify(alert);
            });
        };
        
        $scope.downloadDocument = function () {
            window.open('resources/centralDocuments/downloadDocument?fileName=' + $scope.selection[0],'_blank');
        };
        
        $scope.removeDocuments = function (document) {
            CentralDocuments.removeDocument($scope.selection, function (result) {
                $scope.getDocumentsList();
                messageHolder.showNotify({type:messageHolder.SUCCESS,title:i18n('documents-removed'),detail:i18n('documents-removed-success')});
            });
        };
        
        $scope.title = function (obj) {
			var id = obj.target.attributes.class.value;
			
			if(id == 'datasul') {
				$scope.titleCentralDocuments = i18n('central-documents');
			} else {
				$scope.titleCentralDocuments = i18n('documents-ecm');				
			}
		}
        /*=====================================
			***	 GED Integration ***
        =======================================*/
		$scope.keywords = '';
		$scope.tree_data = [];
		$scope.firstSearch = true;
        $scope.loadingEcm = true;
		
		$scope.getGEDDocuments = function(newRequest) {
			$scope.tree_data = [];
			$scope.loadingEcm = true;
            
            if (newRequest) {
				GEDIntegration.getGEDDocuments(function(result) {
					$scope.gedDocuments = result.documents;
					var myTreeData = $scope.getTree($scope.gedDocuments, 'id', 'parentId');				
					Properties.setProperty(Properties.CENTRAL_DOCUMENTS, myTreeData);
					$scope.tree_data = myTreeData;
					$scope.treeDataDefault = $scope.tree_data;
					$scope.keywords = '';
                    $scope.loadingEcm = false;
				});
			} else {
                var gedDocuments = getDefaultTree();
				
                if (gedDocuments !== undefined) {
					$scope.tree_data = gedDocuments;
					$scope.treeDataDefault = $scope.tree_data;
					$scope.keywords = '';
                    $scope.loadingEcm = gedDocuments.length == 0;
				}
			}
            
		};
		
        $rootScope.$on('gedDocuments', function() {
			$scope.loadingEcm = false;
            $scope.tree_data = getDefaultTree();
			$scope.treeDataDefault = $scope.tree_data;
		});
		
		var tree;    	
		
        $scope.my_tree = tree = {};
		$scope.expanding_property = "fileName";
		$scope.expanding_columnLabel = i18n('file');
		$scope.col_defs = [
			{ field: "id", displayName: i18n('code')},
			{ field: "version", displayName: i18n('version')},
			{ field: "modificationDate", displayName: i18n('date-modified')}			
		];
		
		$scope.getTree = function (data, primaryIdName, parentIdName) {
			if (!data || data.length==0 || !primaryIdName ||!parentIdName)
				return [];

			var tree = [],
				rootIds = [],
				item = data[0],
				primaryKey = item[primaryIdName],
				treeObjs = {},
				parentId,
				parent,
				len = data.length,
				i = 0;

			while (i<len) {
				item = data[i++];
				primaryKey = item[primaryIdName];			
				treeObjs[primaryKey] = item;
				parentId = item[parentIdName];

				if (parentId) {
					parent = treeObjs[parentId];	

					if (parent.children) {
						if (!contains(parent.children, item)) {
							parent.children.push(item);
						}						
					} else {
						parent.children = [item];
					}
				} else {
					rootIds.push(primaryKey);
				}
			}

			for (var i = 0; i < rootIds.length; i++) {
				tree.push(treeObjs[rootIds[i]]);
			};

			return tree;
		}

		function contains(a, obj) {
			var i = a.length;
			while (i--) {
			   if (a[i] === obj) {
				   return true;
			   }
			}
			return false;
		}
		
		$scope.selectDocument = function(document) {
			$scope.selectedDocument =  document;
		}

		function getDefaultTree() {
			$scope.gedDocuments = Properties.getProperty(Properties.CENTRAL_DOCUMENTS);
			return $scope.getTree($scope.gedDocuments, 'id', 'parentId');
		}
		
		$scope.searchMenu = function(keywords) {
			if (keywords === undefined || keywords === '' ) {
				var treeData = getDefaultTree();
				if (!angular.equals($scope.tree_data, treeData)) {
					$scope.my_tree.select_branch(undefined);
					$scope.my_tree.clean_treeData(function() {
						$scope.getGEDDocuments(false);
						$scope.selectedDocument = undefined;
					});
				}	
			} else {
				$scope.my_tree.select_branch(undefined);
				$scope.my_tree.clean_treeData(function() {
					$scope.doSearch(keywords, $scope.treeDataDefault);
					$scope.selectedDocument = undefined;
					$scope.firstSearch = false;
					$scope.loadingEcm = false;
				});
			}
		}
		
		$scope.doSearch = function (keywords, treeDataDefault) {
			$scope.listNodeTreeData = [];			
			$scope.searchTreeData(keywords, treeDataDefault);
			$scope.tree_data = $scope.listNodeTreeData;
		}		
		
		$scope.searchTreeData = function (keywords, tree) {
			$scope.selectedDocument = undefined;
			for (var i = 0; i < tree.length; i ++) {
				var treeData = tree[i];
				if (treeData.fileName != null) {
					if((treeData.fileName.toLowerCase().indexOf(keywords.toLowerCase()) >= 0)) {
						$scope.listNodeTreeData[$scope.listNodeTreeData.length] = treeData;										
					} else if (treeData["children"] !== undefined && treeData.children.length > 0) {
						$scope.searchTreeData(keywords, treeData.children);
					}
				}
			}
		}
		
		$scope.removeGEDDocuments = function () {
			var titleQuestion = i18n('delete-of');
			var msgQuestion = i18n('confirm-remove');
			if ($scope.selectedDocument.documentType == "1") {
				titleQuestion += i18n('folder').toLowerCase();
				msgQuestion += i18n('delete-selected-folder');
			} else {
				titleQuestion += i18n('document').toLowerCase();
				msgQuestion += i18n('delete-selected-document');
			}
			
			messageHolder.showQuestion(titleQuestion, msgQuestion, $scope.answerRemoveQuestion, true, true, true);
		}
			
		$scope.answerRemoveQuestion = function(answer) {
			if (answer) {
				if ($scope.selectedDocument.documentType == "1") {
					GEDIntegration.removeFolder($scope.selectedDocument.id, function (result) {
                        			if (result.removed && result.reason === 'OK') {
							$scope.removeDocumentInTree($scope.selectedDocument, $scope.tree_data);
							$scope.selectedDocument = undefined;
							messageHolder.showNotify({type:messageHolder.SUCCESS,title:i18n('folder-removed'),detail:i18n('folder-removed-success')});							
						} else {
			                            if (result.removed === undefined && result.reason === 'FOLDERNOTALLOWED') {
			                                var title = i18n('folder-not-remove');
			                                var message = i18n('not-possible-remove-folder-integrade-ecm');
			                                var details = undefined;
			                                messageHolder.showMsg(title, message, messageHolder.ERROR, details);

			                            } else {
							var title = i18n('error-remove-folder');
							var message = i18n('not-possible-remove-folder');
							var details = i18n('verify-permision-remove-folder');
						    	messageHolder.showMsg(title, message, messageHolder.ERROR, details);
                            			    }
						}
					});
				} else if ($scope.selectedDocument.documentType == '2') {
					GEDIntegration.removeDocument($scope.selectedDocument.id, function (result) {
						if (result.removed) { 
							$scope.removeDocumentInTree($scope.selectedDocument, $scope.tree_data);
							$scope.selectedDocument = undefined;
							messageHolder.showNotify({type:messageHolder.SUCCESS,title:i18n('document-removed'),detail:i18n('document-removed-success')});							
						} else {
							var title = i18n('error-remove-document');
							var message = i18n('not-possible-remove-document');
							var details = i18n('verify-permision-remove-document');
							messageHolder.showMsg(title, message, messageHolder.ERROR, details);
						}
					});
				}		
			}
		}

		$scope.createOrUpdateFolder = function(option) {
			var title = '';
			if (option === 'create') {
				title = i18n('create-subfolder');
			} else {
				title = i18n('change-folder');
			}			
			
			ModalWindow.openWindow('html/menu/createOrUpdate.html', {
						controller:'CreateOrUpdateFolderCtrl',
						backdrop: 'static',
						keyboard: false,
						confirm: $scope.callbackCreatUpdate,
						title: title,
						size: 'sm',
						selectedDocument: $scope.selectedDocument,
						isNew: (option === 'create') 
			});
		}
		
		$scope.callbackCreatUpdate = function(isNew, result) {
			if (isNew) { //Nova Pasta
				var newFolder = result;
				var newFolder = result;
				$scope.addNewDocumentInTree(newFolder, $scope.tree_data);
			} else { //Alteração de Pasta
				var fileName = result.fileName;
				$scope.updateDocumentInTree(fileName, $scope.tree_data);
			}		
			
		}
		
		$scope.addNewDocumentInTree = function(newDocument, tree) {
			for (var i = 0; i < tree.length; i++) {
				var document = tree[i];
				if (document.id === newDocument.parentId) {
					if (document.children !== undefined && document.children !== null 
						&& document.children.length > 0) {
						$scope.addNewDocumentInTree(newDocument, document.children);
					} else {
						document.children = new Array();
						document.children.push(newDocument);
						break;
					}					
				} else {
					if (document.parentId === newDocument.parentId) {
						tree.splice(0, 0, newDocument);
						break;
					} else {
						if (document.children !== undefined && document.children !== null 
							&& document.children.length > 0) {
							$scope.addNewDocumentInTree(newDocument, document.children);
						}
					}					
				}
			}
		}
		
		$scope.updateDocumentInTree = function(fileName, tree) {
			for (var i = 0; i < tree.length; i++) {
				var document = tree[i];
				if (document.id === $scope.selectedDocument.id) {						
					document.fileName = fileName;
					$scope.selectedDocument.fileName = fileName;
					break;
				} else {
					if (document.children !== undefined && document.children !== null 
						&& document.children.length > 0) {
						$scope.updateDocumentInTree(fileName, document.children);
					}
				}
			}
		}
		
		$scope.removeDocumentInTree = function(removeDocument, tree) {
			for (var i = 0; i < tree.length; i++) {
				var document = tree[i];
				if (document.id === removeDocument.id) {
					tree.splice(i, 1);
					break;
				} else {
					if (document.children !== undefined && document.children !== null 
						&& document.children.length > 0) {
						$scope.removeDocumentInTree(removeDocument, document.children);
					}
				}
			}
		}
		
		$scope.download = function () {
			ModalWindow.openWindow('html/menu/obtainDocument.html', {
				controller:'ObtainDocumentsCtrl',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				document: $scope.selectedDocument,
				callback: $scope.returnFromObtainDocuments
			});
		}
		
		$scope.returnFromObtainDocuments = function(isLoadCentralDocuments) {
			if (isLoadCentralDocuments) {
				$scope.getDocumentsList();
			}
		}
		
		$scope.viewDocument = function () {
			GEDIntegration.getToken(function(result) {
				if (result.token !== undefined && result.token != '') {
					var companyId = Properties.getProperty(Properties.PROPERTIES, 'ecm.totvs.company.id');
					var ecmUrl = Properties.getProperty(Properties.PROPERTIES, 'ecm.url');
					var token = result.token;

					ecmUrl += "/streamcontrol/?WDCompanyId=" + companyId + "&WDNrDocto=" + $scope.selectedDocument.id + "&WDNrVersao=" + $scope.selectedDocument.version + "&token=" + token;        
					$window.open(ecmUrl);
				}
        	});
		}
		
		$scope.moveDocument = function () {
			ModalWindow.openWindow('html/menu/moveDocumentFolder.html', {
				controller:'MoveDocumentFolderCtrl',
				backdrop: 'static',
				keyboard: true,
				size: 'md',
				document: $scope.selectedDocument,
				callback: $scope.moveDocumentFolderCallback
			});
		}
								   
	    $scope.moveDocumentFolderCallback = function(newParentId) {
			$scope.moveDocumentToFolder(newParentId, $scope.tree_data);
		}
		
		$scope.moveDocumentToFolder = function(newParentId, tree) {
			for (var i = 0; i < tree.length; i++) {
				var document = tree[i];
				if (document.id === newParentId) {
					if (document.children !== undefined && document.children !== null 
						&& document.children.length > 0) {
						var selectedDocument = $scope.selectedDocument;
						$scope.removeDocumentInTree(selectedDocument, $scope.tree_data);
						document.children.splice(0, 0, selectedDocument);
						selectedDocument.parentId = document.id;						
						break;
					} else {						
						var selectedDocument = $scope.selectedDocument;
						$scope.removeDocumentInTree(selectedDocument, $scope.tree_data);
						document.children = new Array();
						document.children.push(selectedDocument);
						selectedDocument.parentId = document.id;						
						break;
					}					
				} else {					
					if (document.children !== undefined && document.children !== null 
						&& document.children.length > 0) {
						$scope.moveDocumentToFolder(newParentId, document.children);
					}										
				}
			}
		}
		
        $scope.startUp = function() {
			$scope.getDocumentsList();	
            $scope.getGEDDocuments(false);
		};
        
		$scope.close = function () {
            if (typeof $scope.my_tree.select_branch === 'function') {
                $scope.my_tree.select_branch(undefined);
            }
            $scope.selectedDocument = undefined;
			$modalInstance.close();
        };
        
        $scope.startUp();
    }]);

});