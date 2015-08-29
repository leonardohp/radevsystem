define(['index'], function (index) {
    'use strict';

    index.register.controller('HeaderController',['$rootScope','$scope','MenuSettings','ServDoLogout', function ($rootScope, $scope, MenuSettings, ServDoLogout) {
        $scope.data = {
            segmentCode: null,
            segmentDesc: null,
            environment: null,
            userName:    null,
            userCompany: null,
            ambientType: null
        };
        
        $rootScope.$on('PropertiesLoaded', function () {
            $scope.data.segmentCode = Properties.getProperty(Properties.LICENSE,'segmentCode');
            $scope.data.segmentDesc = Properties.getProperty(Properties.LICENSE,'segmentDesc');
            $scope.data.environment = MenuSettings.getSetting('environment');
            $scope.data.userName    = MenuSettings.getSetting('userName');
            $scope.data.userCompany = MenuSettings.getSetting('userCompany');
            $scope.data.ambientType = MenuSettings.getSetting('ambientType');
        });

        $scope.$on('menuCompanyChange', function(event, userCompany) {
            $scope.data.userCompany    = userCompany;
            $rootScope.acceleratePulse = false;
        });
        
        $scope.$on('menuSegmentChange', function(event, segmentCode, segmentDesc) {
            $scope.data.segmentCode = segmentCode;
            $scope.data.segmentDesc = segmentDesc;
        });

        $scope.callLogout = ServDoLogout.callLogout;
    }]);

});