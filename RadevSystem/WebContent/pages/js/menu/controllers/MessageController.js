define(['index'], function (index) {
    'use strict';

    index.register.controller('MessageCtrl',['$scope','$modalInstance','message',function ($scope, $modalInstance, message) {
        if (message.title === undefined) message.title = 'TOTVS';
        
        $scope.questionForm = message.questionForm;
        $scope.title = message.title;
        $scope.text = message.text;
        $scope.details = message.details;
        $scope.showDetails = (message.details !== null && message.details !== undefined);
        
        if ($scope.questionForm) {
            $scope.showConfirm = message.showConfirm;
            $scope.showCancel = message.showCancel;
        }
        
        $scope.cancel = function () {
            $modalInstance.close('cancel');
            if (message.callback) message.callback(false);
        };
                
        $scope.confirm = function () {
            $modalInstance.close('confirm');
            if (message.callback) message.callback(true);
        };
        
        $scope.ok = function () {
            $modalInstance.close();
            if (message.onClick) message.onClick();
        };
    }]);

});