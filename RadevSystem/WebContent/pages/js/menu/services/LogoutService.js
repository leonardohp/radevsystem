define(['index'], function (index) {
    'use strict';

    index.register.service('ServDoLogout',['$rootScope', '$filter', '$location', 'License', 'messageHolder', 'ExecuteProgram', function ($rootScope, $filter, $location, License, messageHolder, ExecuteProgram) {
        var i18n = $filter('i18n'),
            loggedOut = false,
            service = this;
        
        this.callLogout = function() {
            messageHolder.showQuestion(i18n('logout-title-question'), i18n('logout-msg-question'), function (answer) {
                if(answer) service.logout();
            }, true, true);
        };
        
        //Função para efetuar o LOGOUT do usuário (sem mensagem).
        this.logout = function () {
            service.killDI(service.doLogout);
        };
        
        //Função para finalizar o DI.
        this.killDI = function (callback) {
            License.killLicense($rootScope.sessionID, function(result) {
                ExecuteProgram.quitDI($rootScope.sessionID, function(result) {
                    if (result.DIquitted) {
                        var configs = Properties.getProperty(Properties.ACCESS_PREFERENCES);

                        closeSessionGoglobal(configs.serviceContext, $rootScope.sessionID);
                        window.menuClosed = false;

                        if (callback) callback();
                    }
                });
            });
        };
        
        //Efetua a chamada da função de LOGOUT.
        this.doLogout = function () {
            //Realiza o logout no contexto /datasul caso esteja com alguma tela Flex aberta no menu HTML
            if (document.getElementById('flexIframe') !== undefined 
                || document.getElementById('flexIframe') !== null) {
                service.doFlexLogoff();
            }
            //Força o PATHNAME no IE, pois quando abre o FLEX por algum motivo
            //o JOSSO se perde e redireciona para o /datasul.
            if (BrowserUtil.BROWSER_NAME === BrowserUtil.IE) window.location.pathname = '/menu-html/josso_logout';
            
            //Não utilizar AJAX para executar o LOGOUT, pois dá problema quando
            //integrado ao IDENTITY.
            window.location.assign('jsp/logout.jsp');
        };
        
        this.doFlexLogoff = function() {
            var data = {method: "doFlexLogoff"};
            menuPostMessage(data, '*', document.getElementById('flexIframe'));
        }
        
    }]);

});