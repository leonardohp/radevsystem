define(['index'], function (index) {

	// Alguns sistemas de backend (provedores de serviços) podem especificar um padrão
	// para retorno de todas as chamadas de serviços. Nestes casos é preciso customizar
	// o retorno das requisições HTTP para que fiquem adequadas ao padrão REST:
	// - https://docs.angularjs.org/api/ngResource/service/$resource
	// 
	// No sample está sendo utilizado um dos padrões identificados, no qual todas as 
	// requisições HTTP (REST) para serviços de dados com retorno no formato JSON
	// são encapsuladas em um objeto do tipo Return contendo a seguinte estrutura:
	// - data: objeto genérico que pode conter um único objeto ou uma lista de objetos.
	// - length: utilizado normalmente para quando o objeto contido no 'data' é do
	//			 tipo lista e possui paginação; neste caso a propriedade length 
	//			 recebe a quantidade total de registros da consulta;
	// - messages: lista de mensagens de erro ou informativo resultante do serviço.
	//		- type: danger, error, warning, question e info;
	//		- code: titulo ou código da mensagem;
	//		- detail: detalhamento ou texto da mensagem.
	//
	// Obs.: Notificação de erros e alertas. Devido a padronização do retorno das 
	// requisições é possivel identificar quando a requisição retorno alguma 
	// notificação, exumindo o desenvolvedor de ter que tratar a exibição manualmente.
	appHTTPConfig.$inject = ['$httpProvider'];
	function appHTTPConfig($httpProvider) {
		
		$httpProvider.defaults.transformResponse = function (data, headers) {

			// Todas as requisições que não retornem o resultado no padrão JSON
			// devem ser desconsideradas. Outros tipos de protocolos devem ser 
			// tratados separadamente.
			if (headers('content-type') === null || 
				headers('content-type').indexOf('application/json') < 0) return data;

			// Realiza o parser do resultado para um objeto do tipo JSON;
			var decodeddata = $("<div/>").html(data).text();
			var obj = angular.fromJson(decodeddata);

			// Verifica se o objeto possui um atributo do tipo messages.
			if (obj.hasOwnProperty('messages')) {

				var eventError = false;

				// Realiza o tratamento automático para display das mensagens decorrentes
				// da requisição HTTP.
				if (obj.messages.length > 0) {
					
					// Procura por alguma mensagem do tipo 'error'. Neste caso, as mensagens
					// do tipo 'error' deve ser exibidas como modal impedindo a continuidade
					// da operação que estava sendo realizada. Normalmente está atrelada a 
					// inconsistências no modelo de dados e/ou exceções técnicas.
					for (var i = 0; i < obj.messages.length && !eventError; i++) {
						if (obj.messages[i].type == 'error') {
							eventError = true;
							break;
						}
					}
					
					// Caso exista alguma mensagem do tipo 'error' deve abortar a operação de 
					// interface do usuário.
					if (eventError) {
						
						obj.data = undefined;
						
						// Dispara o evento para apresentação do erro na interface.
						$injectorInstance.invoke(function ($rootScope) {
							
							var message = { type: 'error' };
							
							for (var i = 0; i < obj.messages.length; i++) {
								
								message.text = (message.text ? message.text + ', ' : '') + 
									obj.messages[i].code;
								
								message.help = (message.help ? message.help : '') + 
									'\r\n' + (i + 1) + ' - ' +  obj.messages[i].detail;
							}
							
							$rootScope.$broadcast(TOTVSEvent.showMessage, message);
						});
						
						// O $promise para POST/PUT trabalha sempre na expectativa receber um 
						// retorno do servidor. Quando o retorno é tratado como null ou undefined, 
						// o AngularJS não consegue processar o resultado mantendo assim o estado 
						// inicial do $promise com os dados submetidos via payload. Para isto, foi 
						// desenvolvido um tratamento o framework-services.js para que antes de chamar
						// o callback da requisição seja verificada se o framework já não apresentou 
						// o erro encapsulando o result do serviço como undefined dentro do atributo 
						// data; da mesma forma que era tratado pelo AngularJS nas versões anteriores.
						return {data : undefined};
					} else {
						// Dispara o evento para apresentação do alerta na interface.
						$injectorInstance.invoke(function ($rootScope) {
							
							var alerts = [];
							
							for (var i = 0; i < obj.messages.length; i++) {
								alerts.push({
									type: obj.messages[i].type,
									title: obj.messages[i].code,
									detail: obj.messages[i].detail
								});
							}
							
							$rootScope.$broadcast(TOTVSEvent.showNotification, alerts);
						});
					}
				}
			}

			// Realiza o tratamento equivaler o objeto Return ao padrão das chamadas REST.
			if (obj.hasOwnProperty('data') 
				&& obj.hasOwnProperty('length') 
				&& obj.hasOwnProperty('messages')) {

				
				if (obj.data instanceof Array) {
					
					// Adiciona a quantidade de registros totais da consulta na primeira posição da
					// lista pois por padrão as requisições do tipo QUERY trabalham apenas com listas.
					if (obj.length > 0 && obj.data[0]) {
						obj.data[0].$length = obj.length;
						
					// Quando a requisição é do tipo GET / POST / PUT / DELETE e não possuir um objeto
					// de retorno, ou seja um objeto em 'branco', o AngularJS considera este retorno  
					// como uma lista, o que não é aceito pelo padrão do resource do AngularJS Resource.
					// - https://docs.angularjs.org/api/ngResource/service/$resource
					} else if (obj.length === 0 && obj.data.length === 0) {
						return undefined;
					}
				}
			
				// Quando não for uma requisição do tipo QUERY, retorna o objeto em si.
				return obj.data;
			}
			
			// Quando não se tratar de um objeto do tipo Return na requisição retornar o objeto completo.
			return obj;
		};

		// Adiciona o appHTTPInterceptors ao HTTP Provider.
		$httpProvider.interceptors.push('appHTTPInterceptors');
		
	} // appHTTPConfig

	// Registra a configuração HTTP customizadas para o App.
	index.register.config(appHTTPConfig);
});