define(['index'], function (index) {

	// AngularJS Controller genérico para controle das modais do appNotificationService.
	appModalControl.$inject = ['$scope', '$modal'];
	function appModalControl($scope, $modal) {}
	
	// Serviço responsável por apresentar mensagens e notificações ao usuário 
	// logado no sistema. Estas mensagens podem estar divididas entre notificações,
	// questionamentos desde que o retorno seja sim ou não e mensagem mais complexas
	// como help ou erros. 
	// 
	// O disparo das mensagens também pode ocorrer através de eventos, desde que estes
	// tenham seus listeners registrados no appMainControl. Eventos disponíveis:
	// - TOTVSEvent.showMessage: corresponde ao appNotificationService.message(message)
	// - TOTVSEvent.showQuestion: corresponde ao appNotificationService.question(question)
	// - TOTVSEvent.showNotification: corresponde ao appNotificationService.notify(alert)
	appNotificationService.$inject = ['$rootScope', '$modal', 'toaster'];
	function appNotificationService($rootScope, $modal, toasterService) {

		// Apresenta um toaster de notificação ao usuário, este toaster por padrão será 
		// disposto no canto superior diretio do monitor. O parâmetro passado para a 
		// função pode ser um objeto alert ou uma lista de alerts, desde que obedeçam
		// a seguinte estrutura:
		// - type: indica o tipo de alerta a ser apresentado, tendo como opções: 
		// 		- error: na cor vermelha;
		//		- info: na cor azul claro;
		//		- success: na cor verde;
		//		- warning: na cor laranja;
		// - title: titulo da notificação;
		// - detail: mensagem ou detalhamento da notificação;
		// - timeout: (opcional) tempo que ficará disponível em tela até desaparecer.
		// Obs.: O componente utilizado para está função é o JQuery Toastr: 
		// - https://github.com/CodeSeven/toastr
		this.notify = function(alerts) {
			if (alerts instanceof Array) {
				for (var i = 0; i < alerts.length; i++) {
					var timeout = 8000;
					var type = alerts[i].type.toLowerCase();						
					// As notificações de 'warning' permanecem na interface até o usuário
					// indicar que a leu.
					if (type == 'warning') timeout = 0;						
					toasterService.pop(type, alerts[i].title, alerts[i].detail, timeout);
				}
			} else {
				var timeout = 8000;
				var type = alerts.type.toLowerCase();						
				// As notificações de 'warning' permanecem na interface até o usuário
				// indicar que a leu.
				if (type == 'warning') timeout = 0;				
				toasterService.pop(type, alerts.title, alerts.detail, timeout);
			}
		}
		
		// Apresenta ao usuário uma mensagem focal, a qual obrigará o usuário a tomar alguma 
		// ação para prosseguir com a operação. Diferente do showNotify esta função permite
		// a disposição de apenas uma mensagem por vez desde que o objeto message obedeça a 
		// seguinte estrutura:
		// - title: (opcional) titulo da mensagem;
		// - text: breve descrição da mensagem;
		// - help: detalhamento e/ou ajuda referente a mensagem;
		// - callback: (opcional) função a ser chamada ao fechar a mensagem de notificação.
		this.message = function(message) {
			
			// Caso não seja informado um title, assume o padrão.
			if (message.title === undefined) {
				message.title = 'l-internal-error';
			}
			
			// Ajusta a quebra de linha para o texto de help.
			if (message.help) {
				message.help = message.help.replace(/(?:\r\n|\r|\n|\\r\\n|\\r|\\n)/g,'<br>');
			}
			
			// Caso tenha sido informado o help e não o texto, o texto assume o valor do help.
			if (message.text === undefined) {
				message.text = message.help;
				message.help = undefined;
			}
			
			// AngularJS Controller para a modal.
			var modalInstanceControl = function ($scope, $modalInstance, messageObject) {

				$scope.text 	= messageObject.text;
				$scope.title 	= messageObject.title;
				$scope.help 	= messageObject.help;
				
				$scope.questionForm = false;
				$scope.showDetails 	= false;

				$scope.ok = function () {
					$modalInstance.close();
					if (messageObject.callback) {
						messageObject.callback();
					}
				};

				$scope.changeShowDetails = function () {
					$scope.showDetails = !$scope.showDetails;
				};
			};
			
			var rootContext = $rootScope.appRootContext;
			
			if (rootContext === undefined) {
				rootContext = '/' + window.location.pathname.split('/')[1] + '/';
			}
			
			// Realiza o display da modal para apresentação da mensagem.
			var modalInstance = $modal.open({
				templateUrl: rootContext + 'html/templates/message.html',
				controller: modalInstanceControl,
				size: 'lg',
				resolve: {
					messageObject: function () {
						return message;
					}
				}
			});
		}
		
		// Questiona o usuário referente ao conteúdo da mensagem. As respostas devem ser de 
		// forma objetiva na qual o usuário responda sim ou não. Assim como message esta 
		// função permite a disposição de apenas uma questão por vez desde que o objeto 
		// question obedeça a seguinte estrutura:
		// - title: titulo;
		// - text: descrição da pergunta;
		// - confirmLabel: (opcional) label para o botão de confirmação (padrão 'Ok');
		// - cancelLabel: (opcional) label para o botão de cancelamento (padrão 'Cancelar');
		// - callback: (opcional) função a ser chamada ao responder a questão, encaminhando o 
		//			   resultado para a função passada como parâmetro true ou false.
		this.question = function(question) {
			
			var modalInstanceControl = function ($scope, $modalInstance, questionObject) {

				$scope.questionForm = true;
				
				$scope.title 	= questionObject.title;
				$scope.text 	= questionObject.text;
				
				// Verifica se foi informado uma label customizada para cancelamento.
				if (questionObject.cancelLabel) {
					$scope.cancelLabel = questionObject.cancelLabel;
				} else {
					$scope.cancelLabel = 'btn-cancel';
				}
				
				// Verifica se foi informado uma label customizada para confirmação.
				if (questionObject.confirmLabel) {
					$scope.confirmLabel = questionObject.confirmLabel;
				} else {
					$scope.confirmLabel = 'btn-ok';
				}
				
				$scope.cancel = function () {
					$modalInstance.close('cancel');
				};
				
				$scope.confirm = function () {
					$modalInstance.close('confirm');
				};
			};
			
			var rootContext = $rootScope.appRootContext;
			
			if (rootContext === undefined) {
				rootContext = '/' + window.location.pathname.split('/')[1] + '/';
			}
			
			var modalInstance = $modal.open({
				templateUrl: rootContext + 'html/templates/message.html',
				controller: modalInstanceControl,
				size: 'lg',
				resolve: {
					questionObject: function () {
						return question;
					}
				}
			}).result.then(function(answerModal) {
				if (question.callback) {
					question.callback((answerModal === 'confirm'));
				}
			});
		}
		
	} // appNotificationService
	
	// Registro do AngularJS Service para gestão das notificações.
	index.register.service('totvs.app-notification.Service', appNotificationService);
	
	// Registro do AngularJS Controller para gestão das modais do sistema de notificação.
	index.register.controller('totvs.app-modal-notification.Control', appNotificationService);
});