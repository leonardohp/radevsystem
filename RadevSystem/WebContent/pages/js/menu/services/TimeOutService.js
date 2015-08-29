define(['index'], function (index) {
    'use strict';
    
    index.register.service('TimeOut',['$rootScope','ModalWindow','TimeOutMenu',function ($rootScope, ModalWindow, TimeOutMenu) {
        var timeout  = Properties.getProperty(Properties.PROPERTIES,'session.timeout'),
            resource = {
                isInTimeout: false,
                isUserTimeoutExceptionGroup: false,
                timeoutModalWarning: null
            };
        
        resource.serviceStartTimeout = function ($scope, $idle, $modal, ModalWindow) {
            $scope.$on('IdleStart', function() {
                TimeOutMenu.getSitTimeout(Properties.getProperty(Properties.USER, 'sessionID'),function (result) {
                    if (result.sessionIsTimeout == 'true') {
                        resource.timeoutModalWarning = ModalWindow.openWindow('html/menu/timeout-warning-dialog.html',{controller:'TimeoutCtrl'});

                        resource.timeoutModalWarning.result.then(function () {
                            $rootScope.$broadcast("timeoutModalWarningClose");
                        }, function () {
                            $rootScope.$broadcast("timeoutModalWarningClose");
                        });
                    } else {
                        resource.serviceResetTimeout($idle);
                    };
                });
            });

            $scope.$on('IdleTimeout', function($scope) {
                $rootScope.$broadcast("eventIdleTimeout");
            });

            $scope.$on('IdleWarn', function(e, countdown) {
                //Verifica se o Progress voltou a ativa.
                TimeOutMenu.getSitTimeout(Properties.getProperty(Properties.USER, 'sessionID'), function (result) {
                    if (result.sessionIsTimeout == 'false') resource.serviceResetTimeout($idle);
                });

                $rootScope.$broadcast("eventIdleWarn", countdown);
            });

            $scope.$on('IdleEnd', function($scope) {
                resource.serviceResetTimeout($idle);
            });

            //Verifica se o TIMEOUT está ligado, caso contrário não é necessário
            //inicar a verificação de TIMEOUT.
            if (timeout !== undefined && timeout !== null && timeout > 0) $idle.watch();
        };
		
        resource.serviceResetTimeout = function ($idle) {
            resource.timeoutCloseModals();
			$rootScope.$broadcast("resetTimeout");
            $idle.unwatch();
            $idle.watch();
        };
		
        resource.timeoutCloseModals = function () {
            if (resource.timeoutModalWarning != null) {				
                resource.timeoutModalWarning.close();
                resource.timeoutModalWarning = null;
            }
        };

        resource.isTimeoutExceptionGroup = function (userCode) {
            TimeOutMenu.getTimeoutExceptionGroup(userCode,function (result) {
                if (result.userTimeoutExceptionGroup == 'false') {
                    resource.isUserTimeoutExceptionGroup = false;
                } else {
                    resource.isUserTimeoutExceptionGroup = true;
                }

                $rootScope.$broadcast("checkTimeoutExceptionGroup");
            });
        };
        
        return resource;
    }]);
    
});