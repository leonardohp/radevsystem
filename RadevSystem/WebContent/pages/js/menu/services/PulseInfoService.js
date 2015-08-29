define(['index'], function (index) {
    'use strict';

    index.register.service('ServPulseInfo', ['$rootScope', '$timeout', 'PulseInformation', 'MenuCompany', 'Password', 'TimeOut', function ($rootScope, $timeout, PulseInformation, MenuCompany, Password, TimeOut) {
        var pulseInfo = function () {

            var secondsPulse = 60000;

            PulseInformation.pulseInformation(Properties.getProperty(Properties.USER, 'sessionID'),
                                              TimeOut.isUserTimeoutExceptionGroup,
                                              function (result) {

                if (result.sessionChangeCompany == "true") {

                    MenuCompany.getCompany(function (result) {

                        Properties.setObjectProperty(Properties.USER, 'userCompany', result.company);

                        $rootScope.$broadcast('menuCompanyChange', result.company);

                        console.log(result.company);

                        if ($rootScope.acceleratePulse) {
                            $rootScope.qtdPulse = $rootScope.qtdPulse + 1;

                            if ($rootScope.qtdPulse > 30) { // 15 minutos //
                                $rootScope.acceleratePulse = false;
                            }
                        }
                    });
                }
                
            });
            
            Password.getUserPwdChanged(Properties.getProperty(Properties.USER, 'sessionID'),
            	function (result) {
            		if (result.userPwdChanged == true) {
            			var newUserPwd = result.newUserPwd;
            			Properties.setObjectProperty(Properties.COMPANY, 'password', newUserPwd);
            			
            			if ($rootScope.acceleratePulse) {
                            $rootScope.qtdPulse = $rootScope.qtdPulse + 1;

                            if ($rootScope.qtdPulse > 30) { // 15 minutos //
                                $rootScope.acceleratePulse = false;
                            }
                        }	
            		}
            	});

            if ($rootScope.acceleratePulse) {
                secondsPulse = 30000;
            }

            $timeout(pulseInfo, secondsPulse);
        };

        this.pulseInfo = pulseInfo;
    }]);
    
});