define(['index'], function (index) {

	// O AngularJS Filter para tradução deve ser implementado de acordo com
	// as especificações e necessidade de cada App. Neste sample, é utilizado
	// um json de tradução por contexto. Desta forma, cada contexto deve 
	// disponibilizar um json de tradução de acordo com a extrutura: 
	// - <contexto da aplicação>/<contexto da view>/i18n/translations.js
	// Usando o cadatro de clientes do CRM como exemplo teriamos a seguinte estrutura:
	// - /datasul/crm/i18n/translations.js
	// Neste exemplo subentende-se que o cadastro de cliente faz parte de um contexto
	// de CRM.
	appI18NFilter.$inject = ['$rootScope', '$location', '$http'];
	function appI18NFilter($rootScope, $location, $http) {		
		
		function getTranslationsByViewContext(viewContext) {
			
			// Alteração para suporte do menu HTML.
			viewContext = (viewContext === '/loading/' || viewContext === '/external/') ? '/menu-html/' : viewContext;
            
			// Armazena as traduções já carregadas para cada contexto.
			if (!$rootScope.translationsByViewContext) {
				$rootScope.translationsByViewContext = [];
			} 
			
			// Armazena as urls de tradução já chamadas.
			if (!$rootScope.translationsCalled) {
				$rootScope.translationsCalled = {};
			}
			
			// Verifica se já foi carregado alguma json de tradução para o contexto.
			if ($rootScope.translationsByViewContext 
				&& $rootScope.translationsByViewContext.length > 0) {
				
				for (var i = 0; i < $rootScope.translationsByViewContext.length; i++) {
					if ($rootScope.translationsByViewContext[i].context == viewContext) {
						return $rootScope.translationsByViewContext[i].translations;
					}
				}
			}
			
			// Caso ainda não tenha carregado uma tradução para o contexto, realiza
			// a tentativa de carga do json de tradução para o mesmo.
			if ($rootScope.translationsCalled[viewContext] === undefined) {
				
				// Adiciona a URL do json de tradução ao objeto de controle das 
				// requisições já carregadas para evitar loop de requisições.
				$rootScope.translationsCalled[viewContext] = new Object();
				
				var translations = null;
				var translationURL = viewContext + 'i18n/translations.js';

				// Não utiliza o $http.get, pois requisições síncronas deixam
				// algumas literais do HTML não traduzidas.
                
				$.ajax(translationURL, { type: 'GET', async: false, noErrorMessage: true }).done(function (data) {
					translations = angular.fromJson(data)[0];

					$rootScope.translationsByViewContext.push({
						context: viewContext,
						translations: translations
					});                
				});

                /*
                $http.get(translationURL, {
					noErrorMessage: true
				}).success(function (data) {

					translations = angular.fromJson(data)[0];

					$rootScope.translationsByViewContext.push({
						context: viewContext,
						translations: translations
					});
					
                });*/
				
				return translations;
			}
		}
		
		// Função a ser chamada para realização da tradução de cada literal que 
		// encontrar com o '| i18n'.
		return function (sentence) {

			var rootContext = $rootScope.appRootContext;
            
            if (rootContext === undefined) {
				rootContext = '/' + window.location.pathname.split('/')[1] + '/';
			}
			
			var viewContext = rootContext;
			
			if ($location.url() != '/' && $location.url().length > 1) {
				viewContext =  '/' + $location.url().split('/')[1] + '/';
			}

			var dialect = undefined;
			
			// Caso o App possua alguma informação sobre o usuário logado, neste
			// ponto estas informações podem ser resgatadas. No caso deste sample 
			// carregamos algumas informações do usuário logado e armazenamos no 
			// $rootScope.currentuser, dentro das informações armazenadas está o
			// dialeto parametrizado para o usuário.
			if ($rootScope.currentuser) {
				dialect = ($rootScope.currentuser.dialect ? $rootScope.currentuser.dialect : '');
			}
			
			// Tratamento para considerar as localizações por país. No primeiro momento
			// é removido o país para manter a estrutura atual dos arquivos de tradução
			// que consideram apenas pt, en e es.
			if (dialect !== undefined && dialect !== null) {
				dialect = dialect.toLowerCase();
				if (dialect.length > 2) {
					dialect = dialect.substr(0, 2);
				}
			}
			
			// Caso não tenha um dialeto especificado para o usuário logado então 
			// utilizamos o padrão para o navegador.
			if (dialect != 'pt' && dialect != 'en' && dialect != 'es') {
				
				dialect = getBrowserDialect();
				
				// Neste ponto atualizamos as informações de sessão du usuário
				// logado com o dialeto selecionado para utilização no App.
				if ($rootScope.currentuser) {
					$rootScope.currentuser.dialect = dialect;
				}
			}
			
			// Carrega o json de tradução para o viewContext.			
			var viewTranslations = getTranslationsByViewContext(viewContext);
			
			// Caso não tenha encontrado a literal no json do contexto, procura no 
			// contexto padrão, para evitar de que as views tenham que replicar as 
			// literais do index.
			if (!viewTranslations || !viewTranslations[sentence]) {
				viewTranslations = getTranslationsByViewContext(rootContext);
			}
			
			var translated = null;
			
			if (viewTranslations) {
				
				// Seleciona as traduções para a literal a ser traduzida.
				var sentenceTranslations = viewTranslations[sentence];
				if (sentenceTranslations) {
					// Traduz a literal de acordo com o dialeto selecionado.
					translated = sentenceTranslations[dialect];
				}
			}
			
			return (translated) ? translated : '[' + sentence + ']';
		};		
	} // appI18NFilter

	// Adiciona o filtro para tradução carregado através do 'filter-i18n'.
	index.register.filter('i18n', appI18NFilter);
});

// ---------------------------------------------------------------------------------

// Devolve o dialeto do navegador. Por padrão é considerado 'pt'. Quando 
// identificado um dialeto não suportado pelo App. Atualmente os dialetos
// que devem possuir suporte são: pt (português), en (inglês) e es (espanhol).
function getBrowserDialect() {

	var dialect = 'pt';

	if (navigator.browserLanguage) {
		dialect = navigator.browserLanguage.substring(0, 2);
	} else if (navigator.language) {
		dialect = navigator.language.substring(0, 2);
	}

	if (dialect != 'pt' && dialect != 'es' && dialect != 'en') {
		dialect = 'en';
	}

	return dialect;
}