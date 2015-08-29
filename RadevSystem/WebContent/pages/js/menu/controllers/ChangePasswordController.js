define(['index'], function (index) {
    'use strict';

    index.register.controller('ChangePasswordCtrl', ['$scope','$filter','$modalInstance','Password','messageHolder','options', 'ServDoLogout', function($scope,$filter,$modalInstance,Password,messageHolder,options,ServDoLogout) {
        var i18n = $filter('i18n');
        
        $scope.form = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            numMinCharsPwd: '',
            numMinPwdCharSet: ''
        };
        
        $scope.numMinCharsPwd = 8;

        // Recupera a quantidade mínima de caracteres necessários e
        // a quantidade de conjuntos de caracteres que a senha deve possuir.
        Password.getLoginIntegrSo(function(result) {
            $scope.numMinCharsPwd = result.numMinCharsPwd;
            $scope.numMinPwdCharSet = result.numMinPwdCharSet;
        });

        $scope.save = function () {
            var alert = null,
                changePswd = null,
                currentPassword = null,
                newPassword = null,
                confirmNewPassword = null;

            if ($scope.form.newPassword !== $scope.form.confirmNewPassword) {
                alert = {type:messageHolder.ERROR,title:i18n('not-matching-password'),detail:i18n('not-matching-password-text')}; 
                messageHolder.showNotify(alert);
            } else {
                if (navigator.appVersion.indexOf("MSIE 9") == -1){
                    currentPassword = btoa($scope.form.currentPassword);
                    newPassword = btoa($scope.form.newPassword);
                    confirmNewPassword = btoa($scope.form.confirmNewPassword); 
                } else {
                    currentPassword = Base64Converter.encode($scope.form.currentPassword);
                    newPassword = Base64Converter.encode($scope.form.newPassword);
                    confirmNewPassword = Base64Converter.encode($scope.form.confirmNewPassword);
                }
                changePswd = {
                        userId: Properties.getProperty(Properties.USER, "userCode"),
                        currentPassword: currentPassword,
                        newPassword: newPassword,
                        confirmNewPassword: confirmNewPassword
                };

                Password.changePassword(JSON.stringify(changePswd), function(result) {
                	var minCharsPwdMsg = i18n('min-chars-password-text_1') + ' ' + $scope.numMinCharsPwd + ' ' + i18n('min-chars-password-text_2');
                	var minPwdCharSetMsg = i18n('special-char-password-text_1') + ' ' + $scope.numMinPwdCharSet + ' ' + i18n('special-char-password-text_2');
                	
                    if (result.response !== 'OK') {
                        if (result.value == "PASSWORD_NOK") {
                            alert = {type:messageHolder.ERROR,title:i18n('invalid-password'),detail:i18n('inform-valid-password')};
                        } else if (result.value === "DIFFERENT_PASSWORD_NOK") {
                            alert = {type:messageHolder.ERROR,title:i18n('invalid-password'),detail:i18n('wrong-password')};
                        } else if (result.value === "SHORT_PASSWORD_NOK") {
                            alert = {type:messageHolder.ERROR,title:i18n('invalid-password'),detail:minCharsPwdMsg};
                        } else if (result.value === "NOT_CONTAINS_SC_NOK") {
                            alert = {type:messageHolder.ERROR,title:i18n('invalid-password'),detail:minPwdCharSetMsg};
                        } else if (result.value === "CHANGE_PASSWORD_NOK") {
                        	alert = {type:messageHolder.ERROR,title:i18n('invalid-password'),detail:result.messages[0].detail};
                        }
                    } else {
                        alert = {type:messageHolder.SUCCESS,title:i18n('password-changed'),detail:i18n('password-changed-success')};
                        Properties.setObjectProperty(Properties.COMPANY, 'password', result.value);
                        $modalInstance.close();
                        if (options.confirm) options.confirm();
                    }
                    
                    if (result.messages !== undefined 
                        && result.messages[0].code !== undefined 
                        && result.messages[0].code === "54420") { //Usuário bloqueado por ultrapassar as tentativas parametrizadas no programa sec000zd
                        messageHolder.showMsg(alert.title, alert.title, messageHolder.ERROR, alert.detail, function() {
                            ServDoLogout.doLogout();
                        });
                    } else {
                        messageHolder.showNotify(alert);
                    }
                });
            }
        };
        
        $scope.close = function () {
            $modalInstance.close();
            if (options.cancel) options.cancel();
        };
    }]);

});