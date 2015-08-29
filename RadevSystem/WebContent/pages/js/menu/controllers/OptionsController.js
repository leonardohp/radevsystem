define(['index'], function (index) {
    'use strict';
    
    index.register.controller('OptionsCtrl',['$rootScope', '$scope', '$filter', '$modalInstance', '$location','ModalWindow', 'MenuProperties', 'messageHolder', function ($rootScope, $scope, $filter, $modalInstance, $location, ModalWindow, MenuProperties, messageHolder) {
        
        var i18n = $filter('i18n');
        $scope.OPTIONS = {
            CONFIG: 'config',
            EXECUTE_PROGRAM: 'executeprogram',
            EXECUTE_WEBSPEED: 'executewebspeed',
            EXECUTE_MONITOR_ORDER_WEB: 'executemonitorweb',
            ECM_CONFIG: 'ecmconfig',
            FLUIG_IDENTITY_CONFIG: 'fluigidentityconfig',
            ACCESS_PREFERENCES: 'accesspreferences',
            CHANGE_PASSWORD: 'changepassword'
        };
		
        $scope.optionSelected = $scope.OPTIONS.CONFIG;
        $scope.showProgramWeb = (MenuProperties.getProperty('webspeed.active') == 'true');
        $scope.showEcmConfig = (MenuProperties.getProperty('ecm.integrated') == 'true');

        $scope.openOption = function(option) {
            switch (option) {
                case $scope.OPTIONS.CONFIG:
                    $rootScope.openProgramProgress('cdp/cd0149.w', 'cd0149');
                    break;
                case $scope.OPTIONS.EXECUTE_PROGRAM:
                    $rootScope.openProgramProgress('men/men702dc.w', 'men702dc');
                    break;
                case $scope.OPTIONS.EXECUTE_WEBSPEED:
                    ModalWindow.openWindow('html/menu/executeProgramWeb.html', {
                        controller: 'ExecuteProgramWebCtrl',
                        size: ModalWindow.LARGE_WINDOW
                    });
                    break;
                case $scope.OPTIONS.EXECUTE_MONITOR_ORDER_WEB:
                    var url = 'external/webspeed/web/btb/wbtb001aa+p';
                    $location.url(url);
                    break;
                case $scope.OPTIONS.ECM_CONFIG:
                    ModalWindow.openWindow('html/menu/ecmConfig.html', {
                        controller: 'EcmConfigurationCtrl',
                        backdrop: 'static'                        
                    });
                    break;
                case $scope.OPTIONS.FLUIG_IDENTITY_CONFIG:
                    $rootScope.callExternalProgram("fluigconfigurator", "W");
                    break;
                case $scope.OPTIONS.ACCESS_PREFERENCES:
                    ModalWindow.openWindow('html/menu/accessPreferences.html', {
                        controller: 'AccessPreferencesCtrl',
                        backdrop: 'static'                        
                    });
                    break;
                case $scope.OPTIONS.CHANGE_PASSWORD:
                    
                    if ($scope.validateOpenChangeCtrl()) {
                        ModalWindow.openWindow('html/menu/changePassword.html', {
                        controller: 'ChangePasswordCtrl',
                        backdrop: 'static'                        
                        });   
                    } else {
                        /* Não é permitido alterar a senha de usuários externos */
                        messageHolder.showMsg(i18n('change-password'), 
                                              i18n('change-password-not-allowed-msg'), 
                                              messageHolder.ERROR,
                                              i18n('change-password-not-allowed-help'), 
                                              function(){});
                    }
                    break;
            }

            $scope.optionSelected = option;
            $scope.close();
        };
        
        $scope.close = function () {
            $modalInstance.close();
        };
        
        $scope.validateOpenChangeCtrl = function() {
            var userExternal = Properties.getProperty(Properties.USER, "isUserExternal", false);
            if (userExternal === true || userExternal === "true") {
                return false;
            }
            return true;
        }
    }]);
    
});