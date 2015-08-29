define(['index'], function (index) {
    'use strict';
    
    index.register.controller('LoadingController', ['$rootScope', '$scope', '$filter', '$state', '$location', 'messageHolder', 'ModalWindow', 'ServDoLogout', 'ServCheckLicense', 'MenuApplications', 'MenuProperties', function ($rootScope, $scope, $filter, $state, $location, messageHolder, ModalWindow, ServDoLogout, ServCheckLicense, MenuApplications, MenuProperties) {
        // ********************************************************************
        // Não retirar o trecho de código abaixo para não haver qualquer tipo
        // de delay ao renderizar a página de loading
        document.getElementsByTagName("body")[0].removeAttribute("style");
        // ********************************************************************
        var i18n = $filter('i18n');

        // Valida a senha do usuário (se está ou não expirada).
        var validAuthentication = function (confirm, cancel) {
            var userSettings = Properties.getProperty(Properties.USER),
                timeDiff = null,
                daysDiff = null,
                today = new Date(),
                pwdExpirationDate = new Date(userSettings.pwdExpirationDate.replace(/-/g, '/')),
                daysPwdExpiration = userSettings.daysPwdExpiration,
                blockLogin = false,
                isUserExternal = userSettings.isUserExternal;

            $rootScope.sessionID = userSettings.sessionID;

            if (isUserExternal === 'false' || isUserExternal === false) {                

                // Verifica se o LOGIN será bloqueado caso a senha esteja expirada.
                blockLogin = (userSettings.numSenhaSemVigenc !== null && userSettings.numSenhaSemVigenc === 0);

                // Exibe a notificação de troca da senha caso o vencimento seja em até 10 dias.
                today.setHours(0, 0, 0);
                timeDiff = pwdExpirationDate.getTime() - today.getTime();
                daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (daysPwdExpiration >= 0 && daysDiff <= 10) {
                    showExpiredNotification(daysDiff, blockLogin, confirm, cancel);
                } else {
                    confirm();
                }
            } else {
                confirm();
            }
        };

        // Exibe a mensagem de senha expirada do usuário.
        var showExpiredNotification = function (daysDiff, blockLogin, confirm, cancel) {
            var message;

            if (daysDiff < 0) {
                message = i18n('password-expired');
                if (blockLogin) {
                    message += ' ' + i18n('blocked-access');
                }
            } else if (daysDiff === 0) {
                // Apenas efetua LOGOFF se a senha já estiver expirada.
                cancel  = confirm;
                message = i18n('password-expiring-today');
                if (blockLogin) {
                    message += ' ' + i18n('period-blocked-access');
                }
            } else {
                // Apenas efetua LOGOFF se a senha já estiver expirada.
                cancel  = confirm;
                message = i18n('password-expiring-days') + daysDiff + i18n('password-expiring-days-2');
                if (blockLogin) {
                    message += ' ' + i18n('period-blocked-access');
                }
            }
            var doQuestion = (blockLogin) ? (daysDiff >= 0) : true;
            messageHolder.showQuestion(i18n('password-expiration'), message, function (answer) {
                if (answer) {
                    ModalWindow.openWindow('html/menu/changePassword.html', {controller: 'ChangePasswordCtrl', backdrop: 'static', keyboard: false, confirm: confirm, cancel: cancel});
                } else {
                    cancel();
                }
            }, doQuestion);
        };

        // Efetua as requisições síncronas para o servidor.
        var syncRequest = function (method, type, url, params, result, fail) {
            fail = fail || function (jqXHR, textStatus) {
                alert('Não foi possível comunicar-se com o servidor.');
            };

            params = params || {};
            params['noCountRequest'] = true;

            $.ajax(url, {type: method, data: params, dataType: type, async: false}).done(result).fail(fail);
        };

        // Carrega as configurações de acesso do menu.
        $scope.loadConfigurations = function () {
            syncRequest('GET', 'json', 'jsp/loadConfigurations.jsp', null, function (result) {
                Properties.setProperty(Properties.ACCESS_PREFERENCES, result.configs);
            });

            return true;
        };

        // Carrega as propriedades do sistema.
        $scope.loadProperties = function () {
            syncRequest('GET', 'json', 'jsp/loadProperties.jsp', null, function (result) {
                Properties.setProperty(Properties.PROPERTIES, result);
                MenuProperties.setProperties(result);
            });

            return true;
        };

        // Carrega as informações do usuário logado.
        $scope.loadUser = function () {
            var user = {
                sessionID: null,
                userCode: null,
                userName: null,
                userDomain: null,
                userExternal: null,
                dialect: null,
                isUserExternal: null,
                roles: [],
                pwdExpirationDate: null,
                daysPwdExpiration: null,
                numSenhaSemVigenc: null
            };

            syncRequest('POST', 'text', './authentication/EIPFlexSessionAuthenticator', null, function (result) {
                var xmlDoc = $.parseXML(result),
                    xml = $(xmlDoc);

                // Adiciona informações da sessão e dialeto do usuário.
                user.sessionID = xml.find("sessionID").text();
                user.dialect = xml.find("dialect").text();                
                user.datAcesUsuar = xml.find("datAcesUsuar").text();
                user.hraAcesUsuar = xml.find("hraAcesUsuar").text();
                user.ipAcesUsuar = xml.find("ipAcesUsuar").text();                
                Properties.addProperty(Properties.ACCESS_PREFERENCES, "serverName", xml.find("serverName").text());
                Properties.addProperty(Properties.ACCESS_PREFERENCES, "port", xml.find("port").text());
            });

            syncRequest('GET', 'json', 'resources/user/getLoggedUserSettings', null, function (result) {
                // Adiciona informações de gerenciamento do usuário como:
                user.userCode = result.userCode;
                user.userName = result.userName;
                user.userDomain = result.userDomain;
                user.isUserExternal = result.isUserExternal;
                user.roles = result.roles;
                user.pwdExpirationDate = result.pwdExpirationDate;
                user.daysPwdExpiration = result.daysPwdExpiration;
                user.numSenhaSemVigenc = result.numSenhaSemVigenc;
                user.userExternal = result.userExternal;
                user.isUserExternal = result.isUserExternal;
            });

            Properties.setProperty(Properties.USER, user);

            return true;
        };

        // Carrega as informações da empresa do usuário logado.
        $scope.loadCompany = function () {
            syncRequest('GET', 'json', 'jsp/loadCompany.jsp', null, function (result) {
                var sysInfo = {
                    productVersion: result.frameworkVersion,
                    dbType: result.dbtype,
                    webspeedUrl: result.webspeedUrl,
                    productName: result.product,
                    habilitaHTML: result.habilitaHTML
                };

                Properties.setProperty(Properties.COMPANY, result);
                Properties.addProperty(Properties.USER, 'userCompany', result.company);
                Properties.setProperty(Properties.SYSINFO, sysInfo);
            });

            return true;
        };

        // Carrega as aplicações do menu.
        $scope.loadMenu = function () {
            syncRequest('GET', 'json', 'resources/applicationMenu/getApplications', null, function (result) {
                // Define as aplicações de menu na FACTORY MenuApplications.
                MenuApplications.setApplications(result.data);
            });

            return true;
        };

        // Carrega os processos do menu.
        $scope.loadProcesses = function () {
            syncRequest('GET', 'json', 'resources/applicationMenu/getProcesses', null, function (result) {
                Properties.setProperty(Properties.PROCESSES, result.data);
            });

            return true;
        };

        // Inicia o carregamento das informações do menu.
        $scope.init = function () {
            var enabled = false;

            // Carregando propriedades...
            $scope.loadingPct  = 25.62;
            $scope.loadingText = i18n('loading-properties');
            if (!$scope.loadProperties()) return;    

            // Valida se o menu está habilitado
            if (!(enabled = Properties.getProperty(Properties.PROPERTIES, 'menu.html.habilita') === 'true')) {
                messageHolder.showMsg(i18n('menu-html-validate-title'), i18n('menu-html-validate-message'), messageHolder.ERROR, i18n('menu-html-validate-detail'), function() {window.location.assign('/datasul');});
                return false;
            }

            // Verifica o License Server.
            $scope.loadingPct  = 78.72;
            $scope.loadingText = i18n('validating-ls-info');

            ServCheckLicense.check($scope.loadMenuConfig, ServDoLogout.doLogout);
        };

        $scope.loadMenuConfig = function () {
            // Carregando configurações...
            $scope.loadingPct  = 36.24;
            $scope.loadingText = i18n('loading-settings');
            if (!$scope.loadConfigurations()) return;

            // Carregando usuário...
            $scope.loadingPct  = 46.86;
            $scope.loadingText = i18n('loading-user');
            if (!$scope.loadUser()) return;

            // Carregando empresa...
            $scope.loadingPct  = 57.48;
            $scope.loadingText = i18n('loading-company');
            if (!$scope.loadCompany()) return;

            // Valida se a senha do usuário não está expirada.
            $scope.loadingPct = 68.10;
            $scope.loadingText = i18n('validating-user-info');

            validAuthentication($scope.loadUserMenuConfig, ServDoLogout.doLogout);
        };

        $scope.loadUserMenuConfig = function () {
            var showAsTable, pos, previousUrl = $state.previousUrl || '/';

            // Carregando menu do usuário...
            $scope.loadingPct  = 89.34;
            $scope.loadingText = i18n('loading-user-menu');
            if (!$scope.loadMenu()) return;

            // Carregando processos do usuário...
            $scope.loadingPct  = 100;
            $scope.loadingText = i18n('loading-processes-user');
            if (!$scope.loadProcesses()) return;

            Properties.isPropertiesLoaded(true);
            $rootScope.$broadcast('PropertiesLoaded');

            if ((pos = previousUrl.indexOf('showAsTable')) > 0) {
                showAsTable = getParameterByName(previousUrl, 'showAsTable');
                $location.path(previousUrl.substr(0, pos - 1)).search('showAsTable', showAsTable || false);
            } else {
                $location.path(previousUrl);
            }
        };

        $scope.init();
    }]);
});