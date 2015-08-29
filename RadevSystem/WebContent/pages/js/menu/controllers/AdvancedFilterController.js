define(['index'], function (index) {
    'use strict';
    
    index.register.controller('AdvancedFilterCtrl', ['$scope', '$filter', '$modalInstance', 'messageHolder', function ($scope, $filter, $modalInstance, messageHolder) {
        var i18n = $filter('i18n');
        
        $scope.filterOptions = Properties.getProperty(Properties.FILTER_OPTIONS);

        $scope.getFilterOptionValueByName = function (name) {
            for (var i = 0; i < $scope.filterOptions.length; i++) {
                if ($scope.filterOptions[i].name == name) {
                    return $scope.filterOptions[i].value;
                }
            }
        }

        $scope.data = {
            selectedAll : $scope.getFilterOptionValueByName("all"),
            selectedTasks : $scope.getFilterOptionValueByName("tasks"),
            selectedReports : $scope.getFilterOptionValueByName("reports"),
            selectedConsults : $scope.getFilterOptionValueByName("consults"),
            selectedCruds : $scope.getFilterOptionValueByName("cruds"),
            grpApplications : angular.copy($scope.getFilterOptionValueByName("grpApplications"))
        };
        
        $scope.allGrpAplicatSelected = function () {
            var returnValue = true;
            for (var i = 0; i < $scope.data.grpApplications.length; i++) {
                var grpApplicat = $scope.data.grpApplications[i];
                if (grpApplicat.selected == false){
                    return false;
                }
            }
            return returnValue;
        }
        
        $scope.apps = {
            allSelected : $scope.allGrpAplicatSelected()
        }
        
        $scope.selectAllTipPrograms = function () {
            $scope.data.selectedTasks = $scope.data.selectedAll;
            $scope.data.selectedReports = $scope.data.selectedAll;
            $scope.data.selectedConsults = $scope.data.selectedAll;
            $scope.data.selectedCruds = $scope.data.selectedAll;
        }

        $scope.selectTipProgram = function () {
            $scope.data.selectedAll = $scope.allTipProgramsSelected();
        }

        $scope.allTipProgramsSelected = function () {
            return ($scope.data.selectedTasks && $scope.data.selectedReports &&
                                  $scope.data.selectedConsults && $scope.data.selectedCruds)?true:false;
        }

        $scope.selectAllGrpAplicat = function () {
            for (var i = 0; i < $scope.data.grpApplications.length; i++) {
                var aplicat = $scope.data.grpApplications[i];
                aplicat.selected = $scope.apps.allSelected;
            }
        }

        $scope.selectGrpAplicat = function() {
            $scope.apps.allSelected = $scope.allGrpAplicatSelected();
        }

        $scope.saveOptions = function () {
        
            var lSelect = false;
            
            for (var i = 0; i < $scope.data.grpApplications.length; i++) {
               if ($scope.data.grpApplications[i].selected == true) {
                  lSelect = true;
                  break;
               }
            }
            
            if (lSelect == false) {
                var title = i18n("search-advanced-application-title");
                var details = i18n("search-advanced-application-help");
                messageHolder.showMsg(title, "", messageHolder.ERROR, details);
                return;
            }
            
            if ($scope.data.selectedAll      == false &&
                $scope.data.selectedTasks    == false &&
                $scope.data.selectedReports  == false &&
                $scope.data.selectedConsults == false &&
                $scope.data.selectedCruds    == false) {
                
                var title = i18n("search-advanced-classification-title");
                var details = i18n("search-advanced-classification-help");
                messageHolder.showMsg(title, "", messageHolder.ERROR, details);
                return;
            }
                            
            for (var i = 0; i < $scope.filterOptions.length; i++) {
                if ($scope.filterOptions[i].name == "all") {
                    $scope.filterOptions[i].value = $scope.data.selectedAll;
                } else if ($scope.filterOptions[i].name == "tasks") {
                    $scope.filterOptions[i].value = $scope.data.selectedTasks;
                } else if ($scope.filterOptions[i].name == "reports") {
                    $scope.filterOptions[i].value = $scope.data.selectedReports;
                } else if ($scope.filterOptions[i].name == "consults") {
                    $scope.filterOptions[i].value = $scope.data.selectedConsults;
                } else if ($scope.filterOptions[i].name == "cruds") {
                    $scope.filterOptions[i].value = $scope.data.selectedCruds;
                } else if ($scope.filterOptions[i].name == "grpApplications") {
                    $scope.filterOptions[i].value = $scope.data.grpApplications;
                }
            }
            Properties.setProperty(Properties.FILTER_OPTIONS, $scope.filterOptions);
            $scope.close();
        }
		
		$scope.close = function () {
            $modalInstance.close();            
        };
    }]);
    
});