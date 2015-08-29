define(['index'], function (index) {
    'use strict';
    
    index.register.controller('ExecuteProgramWebCtrl', ['$scope', '$modal', '$modalInstance', '$location', 'MenuPrograms', 'ModalWindow', function ($scope, $modal, $modalInstance, $location, MenuPrograms, ModalWindow) {
        $scope.executeProgramWeb = function () {
            $scope.close();
            ModalWindow.openWindow('html/menu/executeProgramWeb.html',{
                controller: 'ExecuteProgramWebCtrl',
                size: ModalWindow.LARGE_WINDOW
            });
        }
        
        $scope.data = {programWebExecute:''};
        
        $scope.execute = function () {
            var url = 'external/webspeed/' + $scope.data.programWebExecute;
            $location.url(url);
            $scope.close();
        }
        
        $scope.close = function () {
            $modalInstance.close();
		};
    }]);
    
});