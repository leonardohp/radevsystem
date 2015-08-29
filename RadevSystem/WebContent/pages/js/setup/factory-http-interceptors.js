define(['index'], function (index) {
    'use strict';
    
    // Responsável por interceptar as requisições HTTP e realizar alguns controles.
    index.factory('appHTTPInterceptors', ['$rootScope', '$q', function ($rootScope, $q) {
        // Inicia um contador para controlar a contagem de requisições ao servidor
        // para apresentar o loading na interface. Para cada requisição é adicionado
        // 1 ao contador, e a cada retorno (considerando erros) é reduzido 1.
        $rootScope.pendingRequests = 0;
        $rootScope.errorConnServer = false;

        // Caso o sistema de notificações esteja implementado e o padrão de retorno 
        // esteja estabelecido realiza o parse da rejeição para o padrão de mensagem.
        var parseRejectionToMessage = function (rejection) {
            var detail;
			
            // Realiza a verificação para montar o detalhe do erro quando vem em forma
            // de httpResponse ou Return.
            if (rejection.data && rejection.data.detail) {
                if (rejection.data.data && rejection.data.data.detail) {
                    detail = rejection.data.data.detail;
                } else {
                    detail = rejection.data.detail;
                }
            }

            // Caso não tenha identificado o erro, considera o próprio corpo do httpResponse.
            if (!detail) {
                detail = rejection.data;
            }
			
            // Retorna um objeto no padrão esperado pelo serviço de notificação.
            return {
                title: undefined,
                text: rejection.statusText,
                help: detail,
                callback: rejection.callback
            };
        };
		
        var onError = function (rejection) {
            $rootScope.pendingRequests--;

            //Verificar se o erro não foi causado por uma requisição pendente
            //(neste caso não exibir a mensagem de erro).
            if (rejection.config.url !== 'resources/gedIntegration/getGEDDocuments' && rejection.config.url !== 'resources/tasks/getPendingTasks') {
                //Jboss Offline
                if (rejection.status == 0 && $rootScope.errorConnServer == false) {
                    var message = 'Erro de comunicação com o servidor! Verifique se o sistema está no ar e operando corretamente.';
                    alert(message);
                    window.location.href = '/menu-html';
                    $rootScope.errorConnServer = true;
                }
            }
            
            // Por convenção os erros 401 e 419 representam sessão expirada (timeout).
            if (rejection.status === 401 || rejection.status === 419) {
				
				rejection.callback = function () {
					location.reload();
				};
				
				rejection.data = "Sua sessão expirou, você deverá fazer o login novamente";
				rejection.statusText = undefined;
				
				$rootScope.$broadcast(TOTVSEvent.showMessage, parseRejectionToMessage(rejection));
				
				return $q.reject(rejection);
			}
			
			// Caso seja especificado no cabeçalho da requisição 'noErrorMessage' o sistema 
			// deve ignorar a mensagem de erro.
			if (rejection.config) {
                if (!rejection.config.hasOwnProperty('noErrorMessage') || !rejection.config.noErrorMessage) {
                    $rootScope.$broadcast(TOTVSEvent.showMessage, parseRejectionToMessage(rejection));
				}
			}
            
            if (rejection.status !== 401 && rejection.status !== 419) {
				return $q.reject(rejection);
			}
		};
        
        return {
            request: function (config) {
                // https://github.com/angular/angular.js/issues/1388
                config.url = config.url.replace(/%2F/gi, '/');
                
                if (config.url.indexOf('html/menu') < 0 && !config.noCountRequest && (!config.params || !config.params.noCountRequest)) {
                    $rootScope.pendingRequests++;
                }
                
                return config || $q.when(config);
			},
            
            equestError: function (rejection) {
                return onError(rejection);
            },
            
            response: function (response) {
                var config = response.config;
                
                if (config.url.indexOf('html/menu') < 0 && !config.noCountRequest && (!config.params || !config.params.noCountRequest)) {
                    $rootScope.pendingRequests--;
                }
				
				if (response.headers('content-type') === 'application/json') {
					if (angular.fromJson(response) == null) {
						return onError(response);
					}
				}
				
				// Caso o container retorne a própria página de login quando a sessão
				// expirar, o reconhecimento pode ser feito da seguinte forma, desde que
				// utilize algum identificador (<body class=\"login\") para constatar que
				// se trata mesmo da página de login. Neste caso, quando identificado é 
				// disparado um erro com o código 419 para que seja identificado o timeout.
				if (typeof response.data === 'string'
					// No lugar <body class=\"login\" coloque algo que identifique a página 
					// de login do container web.
					&& response.data.indexOf('<body class=\"login\"') > 0) {
					
					response.status = 419;
					return onError(response);
				}
				
				return response;
			},
			
            responseError: function (rejection) {
				return onError(rejection);
			}
		};
	}]);
});