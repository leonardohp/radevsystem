// Para algumas configuração do AngularJS é preciso realizar a injeção dinâmica de
// alguns serviços. Como estes estão presentes apenas em runtime não é possivel realizar
// a injeção na definição destas customizações. A referência é realizada no run do App.
var $injectorInstance = undefined;

define(['angularAMD',
		'angular-ui-router',
		'angular-sanitize',
		'angular-resource',
		'angular-animate',
		'totvs-events',
		'ui-bootstrap-tpls',
		'ui-file-upload',
		'ui-toaster',
		'ui-select',
		'ui-mask',
		'bootstrap-timepicker',
		'bootstrap-datepicker',
		'bootstrap-datepicker-pt-BR',
		'flot',
		'flot-pie',
		'flot-resize',
		'flot-tooltip',
		'flot-categories',
		'autonumeric',
		/*'totvs-resource',*/
		// Dependências do Menu HTML
		'angular-idle',
		'angular-hotkeys',
		'angular-upload',
		'xml2json'], function (angularAMD) {

	// Define o Angular App e adiciona as dependências gerais para toda a aplicação.
	var app = angular.module('index',
		['ui.router',
		 'ui.bootstrap',
		 'ui.mask',
		 'ui.select',
		 'ngSanitize',
		 'ngResource',
		 'ngAnimate',
		 'toaster',
		 'angularFileUpload',
		 'ngLocale',
		 /*'TOTVSResource',*/
		 // Dependências do Menu HTML
		 'ngIdle',
		 'cfp.hotkeys',
		 'lr.upload',
		 'treeControl']);

	// Após o bootstrap do angular realizado pelo AMD, as funções de registro de serviços,
	// diretivas, filter e factories ficam disponíveis através do atributo 'register'.
	// Quando um desses recursos passa a ser chamado antes do bootstrap do angular (ocorre
	// normalmente na carga de widgets do FLUIG) o serviço de registro esta disponível
	// apenas no próprio module (neste caso 'app'). A linha abaixo garente a compatibilidade
	// independente do momento em que o resource tenta realizar o registro.
	app.register = app;

	// ---------------------------------------------------------------------------------

	// Este serviço está responsável por manter um controle sobre as views
	// abertas além de controlar os arquivos de traduções requisitados por cada
	// contexto.
	/* SERVICE DO MENU ESTA EM JS/MENU/SERVICES.JS
	appViewService.$inject = ['$rootScope', '$location', '$stateParams'];
	function appViewService($rootScope, $location, $stateParams) {
		var service = {

			// Mantém uma lista de views abertas.
			openViews: [],

			// Mantém uma lista de views favoritadas, pode ser retornado diretamente
			// de um serviço.
			favoriteViews: [],

			// Registrar a view no serviço de controle de views para da App.
			// Está função deverá ser chamada pelo controller de cada view para se
			// auto-registrar na aplicação.
			startView: function (name, controllerName, controller) {

				for (var i = 0; i < service.openViews.length; i++) {

					service.openViews[i].active = false;

					if (service.openViews[i].name == name) {

						service.openViews[i].url = $location.url();
						service.openViews[i].controllerName = controllerName;
						service.openViews[i].controller = controller;
						service.openViews[i].active = true;

						service.updated();

						if (controller && service.openViews[i].context) {
							angular.forEach(service.openViews[i].context,
											function (value, key) {
								controller[key] = value;
							});

							return false;
						}

						return true;
					}
				}

				service.updated();

				service.openViews.push({
					name: name,
					active: true,
					url: $location.url(),
					controller: controller,
					controllerName: controllerName,
					stateParams: angular.copy($stateParams)
				});

				service.updated();

				return true;
			},

			// Altera a URL no browser para realizar a abertura da view solicitada.
			select: function (view) {
				$location.url(view.url);
			},

			// Dispara um evento para notificar os demais $scope que a lista de views
			// abertas sofreu alguma alteração.
			updated: function () {
				$rootScope.$broadcast(TOTVSEvent.updateViewsScope);
			},

			// Realiza a copia do 'state' do $scope da view a ser descartada para que ao
			// ser solicitada novamente possa retornar ao 'state' original. As váriaveis
			// internas do AngularJS são desconsideradas nesta cópia.
			saveContext: function (state, toParams) {

				for (var i = 0; i < service.openViews.length; i++) {

					if (service.openViews[i].controllerName == state.controller
						 && angular.equals(service.openViews[i].stateParams, toParams)) {

						var controller = service.openViews[i].controller;

						if (controller) {
							var context = {};
							angular.forEach(controller, function (value, key) {
								if (key.charAt(0) == '$') return;
								if (key == 'this') return;
								if (angular.isFunction(value)) return;
								context[key] = value;
							});
							service.openViews[i].context = context;
						}
						service.updated();
						return;
					}
				}
			},

			// Efetua a remoção da view selecionada no <tabset> inclusive eliminando
			// qualquer 'state' anteriormente salvo.
			removeView: function (view) {
				for (var i = 0; i < service.openViews.length; i++) {

					if (service.openViews[i].url == view.url) {

						service.openViews.splice(i, 1);
						service.updated();

						if (service.openViews.length < 2) {
							if (service.openViews.length === 1) {
								service.openViews[0].active = true;
							}
							$location.url('/');
						}

						return;
					}
				}
			},

			isFavoriteView: function (viewURL) {
				console.warn('isFavoriteView: Deve ser implementado por cada foundation.');
				var isFavorite = false;
				angular.forEach(this.favoriteViews, function(view) {
					if (view == viewURL) {
						isFavorite = true;
						return isFavorite;
					}
				});
				return isFavorite;
			},

			markAsFavorite: function(viewURL) {
				console.warn('markAsFavorite: Deve ser implementado por cada foundation.');

				var isFavorite = false;
				var index = this.favoriteViews.indexOf(viewURL);

				if (index != -1) {
					this.favoriteViews.splice(index, 1);
				} else {
					isFavorite = true;
					this.favoriteViews.push(viewURL);
				}

				return isFavorite;
			}
		};
		return service;
	} // appViewService*/

	// Controller principal para resolução das interações da aplicação que
	// não dizem respeito ao programa aberto (content). Em resumo, é responsável
	// pela barra de navegação e 'menus', entre outros.
	/* CONTROLLER DO MENU ESTA EM JS/MENU/CONTROLLERS.JS
	appMainController.$inject = ['$rootScope', '$scope', '$animate',
								 'totvs.app-main-view.Service',
								 'totvs.app-notification.Service'];
	function appMainController($rootScope, $scope, $animate, appViewService,
							   appNotificationService) {

		// Para evitar problemas com o carousel
		// - https://github.com/angular-ui/bootstrap/issues/1273
		$animate.enabled(true);

		// Para que o controller seja visivel dentro das funções de callback
		// ou outros eventos.
		var _self = this;

		// Lista de menus definidos para a aplicação. Por padrão deve ser provido
		// por algum serviço REST proveniente do ERP.
		// A forma como este será disposto fica a criterio de cada ERP desde que
		// siga o guideline da TOTVS (Protheus 12).
		this.menuoptions = {
			'sample' : [
				{ name: 'l-component', 		program: '#/html-sample/component'},
				{ name: 'l-country', 		program: '#/html-sample/country'}
			],
			'framework' : [
				{ name: 'l-available-services',		program: '#/html-service/service'},
			]
		};

		// Realiza a seleção de uma view quando o produto estiver sendo exibido
		// por intermédio de um ERP.
		this.select = appViewService.select;

		// Realiza a remoção da view selecionada quando o produto estiver sendo
		// exibido por intermédio de um ERP.
		this.removeView = appViewService.removeView;

		// Monitora o $rootScope.pendingRequests para apresentar ou esconder o
		// backdrop de loading. Este controle é realizado através do appHTTPInterceptor
		// que monitora as requisições ao servidor.
		this.hasPendingRequests = function () {
			return ($rootScope.pendingRequests > 0);
		};

		// A lista de views abertas necessita ser adicionada ao $scope do AngularJS
		// para correto funcionamento do componente de tabset.
		$scope.$on(TOTVSEvent.updateViewsScope, function () {
			$scope.openViews = appViewService.openViews;
		});

		// Para cada alteração de view é preciso salvar o contexto de $scope
		// da view que estava aberta. Para isto o controller monitora o
		// evento de $stateChangeStart do AngularJS para que a cada troca de URL o
		// serviço de controle de modules do app (appViewService) realize um
		// espelho do $scope anterior para que quando esta view seja novamente
		// solicitada ela retone no 'state' que estava anteriormente.
		$scope.$on('$stateChangeStart', function (event, toState, toParams,
												  fromState, fromParams) {
			appViewService.saveContext(fromState, fromParams);
		});

		// appNotificationService
		// Para evitar que todos os demais AngularJS Controllers e Services precisem
		// injetar o serviço de notificação, o serviço pode ficar disponível através
		// de eventos. Para isto basta injetar o appNotificationService no
		// appMainController para dar suporte as notificações.
		$scope.$on(TOTVSEvent.showNotification, function (event, alerts) {
			appNotificationService.notify(alerts);
		});

		$scope.$on(TOTVSEvent.showMessage, function (event, message) {
			appNotificationService.message(message);
		});

		$scope.$on(TOTVSEvent.showQuestion, function (event, question) {
			appNotificationService.question(question);
		});

		// Inicia a tab de menu para o sample
		appViewService.startView('home', 'totvs.app-main.Control', _self)

	} // appMainController*/

	/* NAO REGISTRA PARA O MENU
	// ---------------------------------------------------------------------------------

	// Registro de serviços para o App.
	app.register.service('totvs.app-main-view.Service', appViewService);

	// Registro de controllers para o App.
	app.register.controller('totvs.app-main.Control', appMainController);

	// ---------------------------------------------------------------------------------
	*/

	// Utilize este bloco caso seja necessário realizar alguma operação
	// ou carregamento prévio a inicialização do AngularJS.
	// Para isto podem ser injetados outros serviços além do injector para
	// realização da operação.
	app.run(['$injector', '$rootScope', '$http', '$filter',
			 function ($injector, $rootScope, $http, $filter) {

		// Realiza a referência a instância do $injector para ser utilziado em runtime
		// pelos serviços de configurações.
		$injectorInstance = $injector;

		// Testa se está executando dentro do Fluig, nesse caso fixa o appRootContext
		if (typeof WCMAPI !== 'undefined') {
			$rootScope.appRootContext = '/html-app/';
		} else {
			// Guarda o $rootScope o contexto raiz da aplicação para carregamento de templates
			// e outros componentes em tempo de execução.
			$rootScope.appRootContext = '/' + window.location.pathname.split('/')[1] + '/';
		}

		// Adiciona o filtro de i18n, caso exista, ao $rootScope para facilitar o acesso
		// ao mesmo programaticamente.
		if ($filter('i18n')) {
			$rootScope.i18n = $filter('i18n');
			// força o carregamento antecipado do translations.js
			$rootScope.i18n ('');
		}

		// teste se está executando pelo FLUIG
		if (typeof WCMAPI !== 'undefined') {
			// faz o login no totvs-rest pelo email do usuario doi fluig
			$http.get('/totvs-rest/resources/login/mail?eMail=' + WCMAPI.userEmail)
				// Ao retornar com sucesso realiza as operaÃ§Ãµes.
				.success(function(data) {
				$rootScope.$broadcast(TOTVSEvent.rootScopeInitialize);
				$rootScope.currentuserLoaded = true;
			});

		} else {
			// Exemplo: Carregar os dados do usuário para a sessão do aplicativo
			// através de um service ou factory definidos ou até mesmo uma requisição
			// utilizando $http para chamada de um serviço REST.
			$rootScope.currentuser = $http.get($rootScope.appRootContext + 'resources/user/getUserData', {noCountRequest: true})

				// Ao retornar com sucesso realiza as operações.
				.success(function(data) {

				// Adicionado algumas informações sobre o usuário logado no $rootScope
				// para que seja acessivel por todo o App.
				$rootScope.currentuser = data;

				// Algumas views podem ter a necessidade de aguardar o carregamento do contexto
				// do usuário logado para dar inicio as suas operações. Nestes casos é possível
				// disparar um evento para todas as views indicando que o contexto do usuário
				// logado já foi carregado.
				$rootScope.$broadcast(TOTVSEvent.rootScopeInitialize);

				// De qualquer forma, este evento é disparado apenas após completo carregamento
				// do contexto do usuário logado sendo que a view precisa de alguma forma
				// identificar se o contexto já foi carregado, caso contrário irá esperar por um
				// evento que nunca será disparado. Desta forma é preciso adicionar uma váriavel
				// de controle no $rootScope para identificar quando o contexto já está carregado.
				$rootScope.currentuserLoaded = true;
			});
		}

	}]);
    
    /**
     * Variável responsável por armazenar as notificações exibidas no menu.
     */
    app.value('menuNotifications', []);

	// ---------------------------------------------------------------------------------

	// Neste ponto devem ser adicionados as configurações e serviços extras para o App.
	// Caso não seja necessário, então o 'bootstrap' do App deve ser chamado diretamente.
	requirejs(['filter-i18n', 'config-http', 'config-states', 'factory-http-interceptors', 'service-notify'], function ($injector) {
		loadMenuDependencies(function () { angularAMD.bootstrap(app); });
	});

	return app;
});

/**
 * Carrega as dependências do menu HTML.
 */
function loadMenuDependencies(bootstrap) {
    var dependencies;
    var services, factories, filters, directives, controllers;
    
    services    = ['js/menu/services/AppViewService',
                   'js/menu/services/Base64ConverterService',
                   'js/menu/services/CheckLicenseService',
                   'js/menu/services/DownloadFileService',
                   'js/menu/services/LogoutService',
                   'js/menu/services/MessageHolderService',
                   'js/menu/services/ModalWindowService',
                   'js/menu/services/PulseInfoService',
                   'js/menu/services/ResourceLoaderService',
                   'js/menu/services/SessionContextService',
                   'js/menu/services/TimeOutService'];
    
    factories   = ['js/menu/factories/CentralDocumentsFactory',
                   'js/menu/factories/ConfigManagerFactory',
                   'js/menu/factories/EcmConfigurationFactory',
                   'js/menu/factories/ExecuteProgramFactory',
                   'js/menu/factories/GEDIntegrationFactory',
                   'js/menu/factories/LicenseFactory',
                   'js/menu/factories/MenuApplicationsFactory',
                   'js/menu/factories/MenuCompanyFactory',
                   'js/menu/factories/MenuFavoriteFactory',
                   'js/menu/factories/MenuPageFactory',
                   'js/menu/factories/MenuProgramsFactory',
                   'js/menu/factories/MenuPropertiesFactory',
                   'js/menu/factories/MenuSettingsFactory',
                   'js/menu/factories/PasswordFactory',
                   'js/menu/factories/PulseInformationFactory',
                   'js/menu/factories/RecentsProgramsFactory',
                   'js/menu/factories/TasksFactory',
                   'js/menu/factories/TimeOutMenuFactory',
                   'js/menu/factories/XMLReaderFactory'];
    
    filters     = ['js/menu/filters/BooleanI18NFilter',
                   'js/menu/filters/CapitalAllFilter',
                   'js/menu/filters/DateFormatFilter',
                   'js/menu/filters/HtmlTextFilter'];
    
    directives  = ['js/menu/directives/TreeGridDirective'];
    
    controllers = ['js/menu/controllers/AccessPreferencesController',
                   'js/menu/controllers/AdvancedFilterController',
                   'js/menu/controllers/AltIndexController',
                   'js/menu/controllers/CentralDocumentsController',
                   'js/menu/controllers/ChangePasswordController',
                   'js/menu/controllers/CreateOrUpdateFolderController',
                   'js/menu/controllers/DesktopController',
                   'js/menu/controllers/EcmConfigurationController',
                   'js/menu/controllers/ExecuteProgramWebController',
                   'js/menu/controllers/HeaderController',
                   'js/menu/controllers/HelpController',
                   'js/menu/controllers/LicenseErrorController',
                   'js/menu/controllers/LoadingController',
                   'js/menu/controllers/MainController',
                   'js/menu/controllers/MessageController',
                   'js/menu/controllers/MessageHistoryController',
                   'js/menu/controllers/MoveDocumentFolderController',
                   'js/menu/controllers/ObtainDocumentsController',
                   'js/menu/controllers/OptionsController',
                   'js/menu/controllers/SysInfoController',
                   'js/menu/controllers/TimeoutController'];
    
    dependencies = [].concat(services, factories, filters, directives, controllers);
    requirejs(dependencies, bootstrap);
}

//Cria uma variável global para evitar o encerramento indevido do menu por
//conta do evento "onbeforeunload" dos navegadores.
window.menuClosed = window.menuClosed || false;