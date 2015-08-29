define(['index'], function (index) {
    'use strict';
    
    // Responsável por alterar a configuração de mapeamento de rotas do AngularJS 
    // para atender as necessidades da aplicação. As rotas estáticas devem ser 
    // adicionadas diretamente ao $stateProvider, as demais views da aplicação irão
    // ser carregadas por exceção através do 'otherwise' do $urlRouterProvider.
    index.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        index.stateProvider = $stateProvider;
        
        // Views padrões da aplicação que não possuem 'states'.
        $stateProvider
            .state('blank', {
                url: '/',
                templateUrl: function () {
                    // Necessário verificar para que na primeira vez não abra o DESKTOP diretamente.
                    return (Properties.isPropertiesLoaded()) ? 'html/menu/desktop.html' : 'html/menu/loading.html';
                }
            })
            .state('loading', {
                url: '/loading',
                templateUrl: 'html/menu/loading.html'
            });
        
        // A chamada das views pode ser realiza a outros contextos, permitindo assim
        // segmentar as aplicações. Entretanto, cada segmento da aplicação deverá seguir 
        // uma estrura padrão para que seja possível a integração. 
        // Por convenção neste exemplo utilizamos a seguinte especificação:
        // - <contexto da aplicação>/<contexto da view>/html/<view>/<view>.js
        // Usando o cadatro de clientes do CRM como exemplo teriamos a seguinte estrutura:
        // - /datasul/crm/html/account/account.js
        // O arquivo <view>.js deverá ser um descritor de 'states' para esta view. Por 
        // padrão o framework procura por um 'state' do tipo '.start' para iniciar a view
        // caso não seja especificado um 'state' na chamada da view.
        $urlRouterProvider.otherwise(function ($injector, $location) {
            var state = $injector.get('$state'),
                urlRouter = $injector.get('$urlRouter'),
                rootScope = $injector.get('$rootScope'),
                view = '',
                templateurl = '',
                customurl = '',
                path = $location.path(),
                strs = path.split('/'),
                contexto = strs[1];
            
            var loadScreen = function () {
                if (!state.get(view)) {
                    index.stateProvider.state(view, {
                        abstract: true,
                        template: '<ui-view/>'
                    });

                    index.stateProvider.state(view + '.start', {
                        url: view,
                        templateUrl: templateurl + '.html'
                    });
                }

                if (strs.length > 3) {
                    urlRouter.sync();
                } else {
                    state.go(view + '.start');
                }
            };
            
            if (contexto && contexto !== '') {
                if (contexto === 'external') { // Verifica se a execução é de um programa externo (portais e programas FLEX).
                    view = path.substr(1);
                    index.stateProvider.state(view, { url: path, template: '' });
                    state.go(view);
                } else if (strs.length > 2) { // Efetua a execução do programa HTML.
                    view = contexto + '/' + strs[2];
                    templateurl = '/' + strs[1] + '/html/' + strs[2] + '/' + strs[2];
                    customurl = '/custom/' + strs[1] + '/' + strs[2];
            
                    // Primeiro tenta efetuar a leitura do script de customização.
                    requirejs([customurl + '.js'], function () {
                        // Caso encontrou a customização, procede com o script padrão e carrega a tela.
                        requirejs([templateurl + '.js'], loadScreen);
                    }, function (error) {
                        var failedId = error.requireModules && error.requireModules[0];
						
                        // Verifica se a falha é no script de customização.
                        if (failedId === customurl + '.js') {
                            // Registra uma FACTORY para a customização sem implementação.
                            index.register.factory('custom.' + strs[1] + '.' + strs[2], ['customization.generic.Factory', function (customService) {
                                return customService;
                            }]);
							
                            // Procede com o script padrão e carrega a tela.
                            requirejs([templateurl + '.js'], loadScreen, function (error) {
                                var urlView = "/" + view;
                                rootScope.$broadcast("$stateError", urlView);
                                console.error(error);
                                state.go('blank');
                            });
                        }
                    });
                } else {
                    view = path.substr(1);
                    var urlView = "/" + view;
                    rootScope.$broadcast("$stateError", urlView);
                    state.go('blank');   
                }
            } else {
                console.debug('Nenhum HTML encontrado para o contexto "' + path + '".');
                return '/';
            }
        });
    }]);
    
});