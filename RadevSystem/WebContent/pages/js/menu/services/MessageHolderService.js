define(['index'], function (index) {
    'use strict';

    index.register.service('messageHolder',['$modal', '$filter', 'toaster', 'menuNotifications', function ($modal, $filter, toaster, menuNotifications) {
        this.INFO = 'info';
        this.WARNING = 'warning';
        this.ERROR = 'error';
        this.SUCCESS = 'success';
        
        /**
         * showNotify
         * Exibe uma pergunta para o usuário no modo de um TOASTER.
         *
         * @param alerts Lista com mas ensagens que serão apresentadas, esta
         * lista deve possuir objetos de mensagens com os atributos:
         *   - title:  Título da mensagem;
         *   - detail: Texto com a mensagem; e
         *   - type:   Tipo da mensagem (INFO, WARNING, ERROR ou SUCCESS).
         */
        this.showNotify = function (alerts) {
            var timeout = 0,
                type = null,
                body = null;
            
            //Valida se o parâmetro alerts é um Array.
            if (!(alerts instanceof Array)) alerts = [alerts];
                
            for (var i = 0, len = alerts.length; i < len; i++) {
                timeout = 10000;
                type = alerts[i].type.toLowerCase();
                
                if (alerts[i].detail && alerts[i].detail.indexOf('<') > -1 && alerts[i].detail.indexOf('>') > -1) {
                    body = 'trustedHtml';
                } else {
                    body = '';
                }
                
                toaster.pop(type, alerts[i].title, alerts[i].detail, timeout, body, alerts[i].callback);
                
                //Inclui a mensagem de alerta na lista de notificações exibidas.
                menuNotifications.push(alerts[i]);
            }
        };
        
        /**
         * showQuestion
         * Exibe uma pergunta para o usuário em uma modal.
         *
         * @param title Título da pergunta.
         * @param question Texto com a pergunta.
         * @param callback Função executada ao confirmar ou cancelar a pergunta,
         * será enviado por parâmetro um booleano conforme ação do usuário.
         * @param confirmLabel Descrição do botão confirmar.
         * @param cancelLabel Descrição do botão cancelar.
         */
        this.showQuestion = function (title, question, callback, showConfirm, showCancel, enableEsc) {
            if (showConfirm === undefined) showConfirm = true;
            if (showCancel === undefined) showCancel = true;
            if (enableEsc === undefined) enableEsc = true;
            
            var modalInstance = $modal.open({
                templateUrl: 'html/menu/message.html',
                controller: 'MessageCtrl',
                resolve: {
                    message: function () {
                        return {
                            title: title,
                            text: question,
                            callback: callback,
                            questionForm: true,
                            showConfirm: showConfirm,
                            showCancel: showCancel
                        }
                    }
                },
                backdrop: 'static',
                keyboard: enableEsc
            });
            /*Setando o focu para o botão confirmar das modais de question*/
            modalInstance.opened.then(function() {
                setTimeout(function() {
                    angular.element('#msg-confirm').focus();
                }, 300);
            });
        };
        
        /**
         * showMsg
         * Exibe uma mensagem para o usuário em uma modal.
         *
         * @param title Título da pergunta.
         * @param message Texto da mensagem.
         * @param type Tipo da mensagem (INFO, WARNING ou ERROR).
         * @param details Texto com mais detalhes da mensagem.
         * @param onClick Função executada ao fechar a mensagem.
         */
        this.showMsg = function (title, message, type, details, onClick) {
            $modal.open({
                templateUrl: 'html/menu/message.html',
                controller: 'MessageCtrl',
                resolve: {
                    message: function (){
                        return {
                            title: title,
                            text: message,
                            type: type,
                            details: details,
                            onClick: onClick,
                            questionForm: false
                        }
                    }
                },
                backdrop: (onClick !== undefined) ? 'static' : '',
                keyboard: (onClick !== undefined) ? false : true
            });
        };
    }]);

});