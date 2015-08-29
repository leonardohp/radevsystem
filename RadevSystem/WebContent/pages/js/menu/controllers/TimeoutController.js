define(['index'], function (index) {
    'use strict';
	
    index.register.controller('TimeoutCtrl',['$scope','$modal','$modalInstance','MenuProperties','ServDoLogout',function($scope,$modal,$modalInstance,MenuProperties,ServDoLogout) {
        $scope.sessionExpired = false;
        
        $scope.$on('eventIdleWarn', function (event, countdown) {
            $scope.timeoutCountdown = countdown;
            $scope.$apply();
        });
		
        $scope.$on('eventIdleTimeout', function () {
            $scope.sessionExpired = true;
            $scope.$apply();
            
            //Encerra as atividades do DI.
            ServDoLogout.killDI();
		});
        
        $scope.$on('timeoutModalWarningClose', function () {
            if ($scope.sessionExpired) ServDoLogout.logout();
        });
        
        $scope.close = $modalInstance.close;
        
        $scope.timeoutMessage = MenuProperties.getProperty('session.timeout.message') * 60;
		$scope.timeoutCountdown = $scope.timeoutMessage;
    }]);
    
});