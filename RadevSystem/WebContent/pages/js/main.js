requirejs.config({
    baseUrl: '/menu-html',
    waitSeconds: 0,
    
    // Para evitar cache em ambiente de desenvolvimento.
    //urlArgs: 'bust=' + (new Date()).getTime(),

    paths: {
        // Dependências minimas para execução de um AngularJS App.
        'jquery':                       'js/libs/jquery.min',
        'angular':                      'js/libs/angular.min',
        'angular-locale_pt-br':         'js/libs/i18n/angular-locale_pt-br',
        'angularAMD':                   'js/libs/angularAMD',
        'bootstrap':                    'js/libs/bootstrap.min',
        'angular-ui-router':            'js/libs/angular-ui-router.min',
        'angular-resource':             'js/libs/angular-resource.min',
        'angular-animate':              'js/libs/angular-animate.min',
        'angular-sanitize':             'js/libs/angular-sanitize.min',
        'text':                         'js/libs/text',
        'json':                         'js/libs/json',
        'ng-load':						'js/libs/ngload',
        
        // Definição das chamadas para pontos de customização ou addons 
        // para	o App. Em resumo, são dependências de cada implementação 
        // do TOTVS | HTML Framework.
        'totvs-events':					'js/setup/events',
        'config-http':					'js/setup/config-http',
        'config-states':				'js/setup/config-states',
        'factory-http-interceptors':	'js/setup/factory-http-interceptors',
        'filter-i18n':					'js/setup/filter-i18n',
        'service-notify':				'js/setup/service-notify',
        'totvs-resource':               'js/totvs-resource',
        'totvs-custom':                 'js/totvs-custom',
        
        // Declaração das dependências externas extras para o App.
        'ui-bootstrap-tpls':            'js/libs/3rdparty/ui-bootstrap-tpls/ui-bootstrap-tpls-0.11.0.min',
        'ui-file-upload':               'js/libs/3rdparty/ui-file-upload/angular-file-upload.min',
        'ui-toaster':					'js/libs/3rdparty/ui-toaster/toaster.min',
        'ui-select':                    'js/libs/3rdparty/ui-select/select.min',
        'ui-mask':                      'js/libs/3rdparty/ui-mask/mask.min',

        'bootstrap-datepicker':         'js/libs/3rdparty/bootstrap-datepicker/bootstrap-datepicker.min',
        'bootstrap-datepicker-pt-BR':   'js/libs/3rdparty/bootstrap-datepicker/locales/bootstrap-datepicker.pt-BR',
        'bootstrap-timepicker':			'js/libs/3rdparty/bootstrap-timepicker/bootstrap-timepicker.min',

        'autonumeric':                  'js/libs/3rdparty/jquery-autonumeric/autoNumeric.min',

        'flot':                         'js/libs/3rdparty/flot/jquery.flot.min',
        'flot-pie':                     'js/libs/3rdparty/flot/jquery.flot.pie.min',
        'flot-resize':                  'js/libs/3rdparty/flot/jquery.flot.resize.min',
        'flot-tooltip':                 'js/libs/3rdparty/flot/jquery.flot.tooltip.min',
        'flot-categories':              'js/libs/3rdparty/flot/jquery.flot.categories.min',

        'perfect-scrollbar':            'js/libs/3rdparty/perfect-scrollbar/perfect-scrollbar',

        // Definição do arquivos que contém as diretivas de componentes disponíveis.
        'components':					'js/components',
        
        // Declaração das dependências externas extras para o Menu HTML.
        'angular-idle':                 'js/libs/3rdparty-menu/angular-idle/angular-idle.min',
        'angular-hotkeys':              'js/libs/3rdparty-menu/angular-hotkeys/hotkeys.min',
        'angular-upload':               'js/libs/3rdparty-menu/angular-upload/angular-upload.min',
        'angular-tree-control':         'js/libs/3rdparty-menu/angular-tree-control/angular-tree-control',
        'classie':                      'js/libs/3rdparty-menu/classie/classie',
        'xml2json':                     'js/libs/3rdparty-menu/x2js/xml2json',
        
        'sidebar-effects':              'js/sidebar-effects',

        // Definição do start da aplicação.
        'index':                        'js/index'
    },

    shim: {
        'angularAMD':                   ['angular'],
        'ng-load':                      ['angularAMD'],
        'angular-locale_pt-br':         ['angular'],
        'bootstrap':                    ['jquery'],
        'angular':                      ['jquery',
                                         'bootstrap'],
        'angular-ui-router':            ['angular'],
        'angular-sanitize':             ['angular'],
        'angular-resource':             ['angular'],
        'angular-animate':              ['angular'],
        'components':                   ['angular'],
        'ui-bootstrap-tpls':            ['angular'],
        'ui-file-upload':				['angular'],
        'ui-select':					['angular'],
        'ui-toaster':					['angular',
                                         'angular-animate',
                                         'jquery'],
        'ui-mask':						['angular'],
        'bootstrap-datepicker':			['jquery'],
        'bootstrap-datepicker-pt-BR':	['jquery',
                                         'bootstrap-datepicker'],
        'bootstrap-timepicker':			['jquery'],
        'autonumeric':					['jquery'],
        'flot':							['jquery'],
        'flot-pie':						['flot'],
        'flot-resize':					['flot'],
        'flot-tooltip':					['flot'],
        'flot-categories':				['flot'],
        
        'perfect-scrollbar':            ['jquery'],

        'totvs-resource':				['angular',
                                         'angular-resource'],
        
        // Dependências do Menu HTML.
        'angular-idle':                 ['angular'],
        'angular-hotkeys':              ['angular'],
        'angular-upload':               ['angular'],
        'angular-tree-control':         ['angular'],
        
        'sidebar-effects':              ['classie'],
        
        'index':                        ['angularAMD',
                                         'angular-locale_pt-br',
                                         'angular-ui-router',
                                         'angular-sanitize',
                                         'angular-animate',
                                         'totvs-events',
                                         'bootstrap-datepicker',
                                         'bootstrap-datepicker-pt-BR',
                                         'ui-bootstrap-tpls',
                                         'ui-file-upload',
                                         'ui-toaster',
                                         'ui-select',
                                         'autonumeric',
                                         'flot',
                                         'flot-pie',
                                         'flot-resize',
                                         'flot-tooltip',
                                         'flot-categories',
                                         'perfect-scrollbar',
                                         // Dependências do Menu HTML.
                                         'angular-idle',
                                         'angular-hotkeys',
                                         'angular-upload',
                                         'angular-tree-control',
                                         'sidebar-effects',
                                         'xml2json']
    },
    
    deps: ['index']
});