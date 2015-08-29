define(['index'], function (index) {
    'use strict';

    index.register.controller('MainController', ['$rootScope', '$scope', '$filter', '$location', '$modal', '$timeout', '$interval', '$window', 'totvs.app-main-view.Service', 'MenuApplications', 'MenuProperties', 'MenuSettings', 'MenuPrograms', 'MenuFavorite', 'ModalWindow', 'messageHolder', 'TimeOut', 'ServPulseInfo', 'ServDoLogout', 'License', 'ServCheckLicense', 'PulseInformation', 'menuNotifications', 'RecentsPrograms', 'MenuPage', 'ExecuteProgram', 'GEDIntegration', '$state', 'Idle', 'Keepalive', 'totvs.app-notification.Service', function ($rootScope, $scope, $filter, $location, $modal, $timeout, $interval, $window, appViewService, MenuApplications, MenuProperties, MenuSettings, MenuPrograms, MenuFavorite, ModalWindow,  messageHolder, TimeOut, ServPulseInfo, ServDoLogout, License, ServCheckLicense, PulseInformation, menuNotifications, RecentsPrograms, MenuPage, ExecuteProgram, GEDIntegration, $state, Idle, Keepalive, appNotificationService) {
        var maincontrol = this,
            i18n = $filter('i18n'),
            title = '';
        
        // ********************************************************************
        // Listeners de eventos do TOTVS HTML Framework
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
		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            var from = fromState.name.split('.')[0],
                to = toState.name.split('.')[0];
            
            // Verifica se foram carregadas as propriedades do menu antes de executar qualquer VIEW.
            if (!Properties.isPropertiesLoaded() && to !== 'loading') {
                // Salva no $state qual a URL que o usuário tentou acessar.
                $state.previousUrl = toState.url;
                
                // Redireciona para a tela de inicialização do menu.
                $state.go('loading');
                
                // Previne que seja carregada a página atual.
                event.preventDefault();
            } else if (from !== to) {
                appViewService.saveContext(fromState);
            }
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
        // ********************************************************************
        
        
        $scope.propertiesLoaded = false;
        //Recupera qual o tipo de ambiente está sendo utilizado.
        $scope.ENVIRONMENTS = { TEST: 'test', DEMONSTRATION: 'demonstration', PRODUCTION: 'production' };
        
        // Atualiza as propriedades quando as mesmas forem carregadas
        
        $rootScope.$on('PropertiesLoaded', function () {
            $scope.environment = Properties.getProperty(Properties.PROPERTIES, "license.ambient.type");
            $scope.environment = ($scope.environment === $scope.ENVIRONMENTS.TEST || $scope.environment === $scope.ENVIRONMENTS.DEMONSTRATION) ? $scope.environment : $scope.ENVIRONMENTS.PRODUCTION;
		    // Recupera as preferências de acesso do usuário.
			$scope.configsOptions = Properties.getProperty(Properties.ACCESS_PREFERENCES);
			$scope.updatePageTitle();
            
            $scope.isAccessSecurityActived = function(){
                var progressServerName = Properties.getProperty(Properties.PROPERTIES, "progress.server.name", "");
                var progressServerPort = Properties.getProperty(Properties.PROPERTIES,"progress.server.port", "");
                var progressServerApp = Properties.getProperty(Properties.PROPERTIES,"progress.server.application", "");
                var progressServerMaxCon = Properties.getProperty(Properties.PROPERTIES,"progress.server.maxconnections", "");
                var accessSecurityActive = Properties.getProperty(Properties.PROPERTIES,"access.security.active", "false");
                return (!(progressServerName.trim() === "") &&
                    !(progressServerPort.trim() === "") &&
                    !(progressServerApp.trim() === "") &&
                    !(progressServerMaxCon.trim() === "") &&
                    !(accessSecurityActive.trim() === "") &&
                    !(accessSecurityActive.trim() === "false"));
            }
            
            
            TimeOut.isTimeoutExceptionGroup(MenuSettings.getSetting('userCode'));
            
            $scope.$on('checkTimeoutExceptionGroup', function () {
                // Inicía o Timeout
                if (TimeOut.isUserTimeoutExceptionGroup == false) {
					var timeOut = Properties.getProperty(Properties.PROPERTIES, 'session.timeout'),
						timeOutMessage = Properties.getProperty(Properties.PROPERTIES,'session.timeout.message'),
						diffTimeOut = (timeOut - timeOutMessage);
				
					// Tempo de duração do período possível sem acesso (session.timeout).
					diffTimeOut = (diffTimeOut <= 0) ? 1 : diffTimeOut;
					Idle.setIdle(diffTimeOut * 60);
				
					// Tempo do período de contagem (session.timeout.message).
					Idle.setTimeout(timeOutMessage * 60);
				
					// Tempo entre as verificações (padrão de 1 minuto).
					Keepalive.setInterval(60);
					
					// Inicia o contador de TIMEOUT.
					Idle.watch();				
				
                    TimeOut.serviceStartTimeout($scope, Idle, $modal, ModalWindow);
                };
            });
            
            $scope.data = {
                applications: MenuApplications.getApplications(),
                processes : Properties.getProperty(Properties.PROCESSES)
            };
            var user = Properties.getProperty(Properties.USER);
            if (!user.isUserExternal && $scope.isAccessSecurityActived()) {
                var bodyMsg = "";            
                var today = new Date();
                if (user.datAcesUsuar !== "null"                                        
                    && user.hraAcesUsuar !== "null"                    
                    && user.ipAcesUsuar !== "null") {
                    var dtParts = user.datAcesUsuar.split("/");
                    var dtAcesUsuar = new Date(dtParts[2], dtParts[1]-1, dtParts[0]);
                    if (dtAcesUsuar.getDate() === today.getDate()
                       && dtAcesUsuar.getMonth() === today.getMonth()
                       && dtAcesUsuar.getFullYear() === today.getFullYear()) {
                        bodyMsg += i18n('today');
                    } else {
                        bodyMsg += i18n('day') + ' ' + user.datAcesUsuar;
                    }
                    bodyMsg += ' ' +  i18n('at') + ' ' + user.hraAcesUsuar + ' ' + i18n('using-ip-address').toLocaleLowerCase() + ': ' + user.ipAcesUsuar + '.';    
                    messageHolder.showNotify({type:messageHolder.INFO,title:i18n('last-access') + " " + user.userCode + ":",detail:bodyMsg});
                } else {
                    bodyMsg += i18n('last-user-access-undefined') + ' ' + user.userCode + '.<br>' + i18n('check-database-definitions');
                    messageHolder.showNotify({type:messageHolder.ERROR,title:'',detail:bodyMsg});
                }
            }
            
            /*
				begin Recupera os documentos do GED no ECM do usuário em background.
			*/
			$scope.getGEDDocuments = function() {
				GEDIntegration.getGEDDocuments(function(result) {
					Properties.setProperty(Properties.CENTRAL_DOCUMENTS, result.documents);
					$rootScope.$broadcast('gedDocuments');
				});
			};
		
			if (MenuProperties.getProperty('ecm.integrated') === 'true') {
				$scope.getGEDDocuments();
			}
			/*
				end Recupera os documentos do GED no ECM do usuário em background.
			*/
            
            $scope.propertiesLoaded = true;
        });
        
        $scope.$on('resetTimeout', function() {
            $scope.updatePageTitle();
        });
        
        $scope.updatePageTitle = function() {
            document.title = "";
            //Recupera qual o tipo de ambiente está sendo utilizado.
            if ($scope.environment === $scope.ENVIRONMENTS.DEMONSTRATION) {
                title = 'TOTVS (Datasul) - ' + i18n("ambient-type-demonstration");
            } else {
                title = 'TOTVS ' + i18n("totvs-number") + ' ' + Properties.getProperty(Properties.LICENSE, "segmentCode") + ' ' +
                Properties.getProperty(Properties.LICENSE, "segmentDesc") + ' (Datasul) 06.' + Properties.getProperty(Properties.LICENSE, "segmentCode");
            }

            //Altera o título da página principal conforme dados do LICENSE.
            MenuPage.setTitle(title);
            document.title = MenuPage.title;   
        }
        
        //Variável com informações de pulse, para verificar se houve um novo
        //documento publico ou uma nova tarefa (PRW) finalizada.
        var pulseInformation = {
            docsLen: null,
            tasksLen: null
        };
        
        //Recupere a quantidade de notificações atuais do menu.
        $scope.menuNotifications = menuNotifications;
        
		$rootScope.getPulseInformation = function(hideMsg) {
            PulseInformation.getPulseInformation(function (result) {
				if (result.docsLen > pulseInformation.docsLen && hideMsg === false) {
                    messageHolder.showNotify({type:messageHolder.INFO,title:i18n('new-document'),detail:i18n('click-here-view'),callback:$scope.openCentralDocuments});
                }
                
                pulseInformation.docsLen = result.docsLen;
            });
		}
		
		$rootScope.getPulseInformation(true);
		
        //Cria o intervalo de 3s para verificar os documentos e tarefas.
        $interval(function() {
			$rootScope.getPulseInformation(false);
		}, 60000);
        
        //Inicia o módulo da página inicial.
        appViewService.startView(appViewService.HOME, "DesktopController", this);

        $rootScope.acceleratePulse = false;
        $rootScope.qtdPulse        = 0;
        $rootScope.sessionID       = Properties.getProperty(Properties.USER, 'sessionID');
        
        this.angularApp = true;

        var flexProperties = {flexStarted: false, flexLoaded: false, execQueue: []};

        Properties.setProperty(Properties.FLEX, flexProperties);
		
        $scope.openHomepage = function() {

            var flexProperties = Properties.getProperty(Properties.FLEX);
            if (!flexProperties["flexLoaded"] && flexProperties["flexStarted"]) {
                var executionsQueue = flexProperties["execQueue"];
                executionsQueue[executionsQueue.length] = "homepage";
                Properties.setProperty(Properties.FLEX, flexProperties);
            } else {
                $location.url("external/datasul/homepage");
            }
        }

        $scope.openTaskMonitor = function() {

            var flexProperties = Properties.getProperty(Properties.FLEX);
            if (!flexProperties["flexLoaded"] && flexProperties["flexStarted"]) {
                var executionsQueue = flexProperties["execQueue"];
                executionsQueue[executionsQueue.length] = "fnd.ScheduleMonitor";
                Properties.setProperty(Properties.FLEX, flexProperties);
            } else {
                $location.url("external/datasul/fnd/ScheduleMonitor");
            }
        }

        $scope.selectedGrpApplication;
        $scope.selectedModule;
        $scope.selectedProgram;

        $scope.$on('menuOptionChange', function(event, menuOption) {

            if (menuOption.tip == "grpApplication") {
                $scope.selectedGrpApplication = menuOption.value;
            } else if (menuOption.tip == "module") {
                $scope.selectedModule = menuOption.value;
            } else {
                $scope.selectedProgram = menuOption.value;
            }
        });
        
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            var urlParts = toState.name.split('/'),
                baseto = urlParts[0];
            
            $scope.tryStateUrl = toState.url;
            
            if (baseto == 'external') {
                var programId = "";
                if (toState.name.split('/').length > 3) {
                    for (var i = 2; i < toState.name.split('/').length; i++) {
                        if (programId.length == 0) {
                            programId += toState.name.split('/')[i];
                        } else {
                             programId += '/' + toState.name.split('/')[i];
                        }
                    }                                
                } else {
                    programId += toState.name.split('/')[2];    
                }
                
                switch (urlParts[1]) {
                    case
                        "datasul": /* Flex */
                            programId = programId.replace(/\//g, ".");
                            programId = programId.replace(/\+/g, "_");
                            break;
                    case
                        "webspeed": /* WebSpeed */                            
                            programId = programId.replace(/\+/g, ".");
                            break;
                    case
                        "smartclient": /* SmartClient */
                            programId = programId.replace(/\//g, ".");
                            programId = programId.replace(/\+/g, "_");
                            break;
                    default:
                         programId = toState.name.split('/')[1];
                }
                
                if (programId !== "men702dc") {
                    MenuPrograms.findFunctionalityById(programId, function(result) {
                        var program = result.program;
                        if (program.isFunctionality) {
                            if (program.url === "web/men/wmen903ze.w" && !$scope.validateOpenChangePwd()) {
                                $scope.showChangePwdNotAllowed();                                
                            } else {
                                var userId = Properties.getProperty(Properties.USER, 'userCode');
                                RecentsPrograms.addRecent(userId, program);
                                $scope.loadExternalView(programId);                
                                maincontrol.angularApp = false;
                            }                                                        
                        } else {
                            // Programa Monitor de Agendamento, Área de trabalho, Fluig Configurator não são funcionalidades de menu
                            if (programId === "fnd.ScheduleMonitor" ||
                                programId === "homepage" ||
                                programId === "fluigconfigurator") {                                
                                $scope.loadExternalView(programId);                
                                maincontrol.angularApp = false;
                            } else {                            
                                MenuPrograms.findProgramIdByNomProgExt(programId, function(result) {
                                    var codProgDtsul = result.programId;
                                    if (codProgDtsul !== undefined) {
                                        MenuPrograms.findFunctionalityById(codProgDtsul, function(result) {
                                            var program = result.program;
                                            if (program.isFunctionality) {                                            
                                                if (program.url === "web/men/wmen903ze.w" && !$scope.validateOpenChangePwd()) {
                                                    $scope.showChangePwdNotAllowed();
                                                } else {
                                                    var userId = Properties.getProperty(Properties.USER, 'userCode');
                                                    RecentsPrograms.addRecent(userId, program);
                                                    $scope.loadExternalView(codProgDtsul);                
                                                    maincontrol.angularApp = false;
                                                }
                                            }
                                        });    
                                    } else {
                                        $scope.showNonexistentProgramError(toState.url);   
                                    }                                    
                                });   
                            }                            
                        }                        
                    });           
                } else {
                    var execProgram = {idiInterfac: 'P', prg: 'men702dc', url: 'men/men702dc.w'};
                    $scope.openExternalView(execProgram);
                }
            } else { //Programa HTML
                var nomProgExt, codProgDtsul;
                
                nomProgExt = getExternalProgramByUrl(toState.url);
                    
                if (nomProgExt) {
                    MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(result) {
                        codProgDtsul = result.programId;
                        
                        MenuPrograms.findFunctionalityById(codProgDtsul, function(result) {
                            var program = result.program;
                            
                            if (program.isFunctionality) {                                            
                                var userId = Properties.getProperty(Properties.USER, 'userCode');
                                RecentsPrograms.addRecent(userId, program);
                                maincontrol.angularApp = true;
                            }
                        });
                    });
                } else {
                    maincontrol.angularApp = true;
                }
            }
        });
        
        $scope.showChangePwdNotAllowed = function() {
            /* Não é permitido alterar a senha de usuários externos */
            messageHolder.showMsg(i18n('change-password'), 
                                  i18n('change-password-not-allowed-msg'), 
                                  messageHolder.ERROR,
                                  i18n('change-password-not-allowed-help'), 
                                  function(){});
          	$location.path("/");
        }
        
        $scope.validateOpenChangePwd = function() {
            var userExternal = Properties.getProperty(Properties.USER, "isUserExternal", false);
            if (userExternal === true || userExternal === "true") {
                return false;
            }
            return true;
        }
        
        $scope.$on('$stateError', function (event, url) {
            $scope.callProgramAccessError(url); 
        });
        
        $scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $scope.callProgramAccessError(toState.url);
        });

        $scope.callProgramAccessError = function(prgUrl) {
            $rootScope.pendingRequests = 0;
            var urlProgram = prgUrl.substring(1, prgUrl.length);
            $scope.tryStateUrl = prgUrl;
            $scope.showProgramAccessError(urlProgram);   
        }
        
        $scope.showProgramAccessError = function (url) {
            url = url.replace("/external/", "");
            url = url.replace("external/", "");
            var title = i18n('error-opening-the-context-title') + " " + url + ".";
            var message = i18n('error-opening-the-context-title-msg') + " " + url + '.';
            var details = i18n('error-opening-the-context-title-help');
            messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {$scope.callActivePage();});
        }

        $scope.showNonexistentProgramError = function (url) {
            url = url.substr(1);
            var urlParts = url.split('/');
            var programId = "";
            if (urlParts.length > 3) {
                for (var i = 2; i < urlParts.length; i++) {
                    if (programId.length == 0) {
                        programId += urlParts[i];
                    } else {
                         programId += '/' + urlParts[i];
                    }
                }                                
            } else {
                programId += urlParts[2];    
            }
                        
            switch (urlParts[1]) {
                case
                    "datasul": /* Flex */
                        programId = programId.replace(/\//g, ".");
                        programId = programId.replace(/\+/g, "_");
                        break;
                case
                    "webspeed": /* WebSpeed */                            
                        programId = programId.replace(/\+/g, ".");
                        break;
                case
                    "smartclient": /* SmartClient */
                        programId = programId.replace(/\//g, ".");
                        programId = programId.replace(/\+/g, "_");
                        break;
                default:
                     programId = urlParts[1];
            }
            var title = i18n('error-opening-the-program-title') + " " + programId + ".";
            var message = i18n('error-opening-the-program-msg') + " " + programId + '.';
            var details = i18n('error-opening-the-program-help');
            messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {$scope.callActivePage();});
        }
        
        $scope.showSMCAccessError = function (prg) {
            var title = i18n('session-is-not-configured-to-smc-title') + " " + prg + ".";
            var message = i18n('session-is-not-configured-to-smc-msg');
            var details = i18n('session-is-not-configured-to-smc-help');
            messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {$scope.callActivePage();});
        }

        $scope.callActivePage = function () {
            var tab = appViewService.getPageActive();
            appViewService.select(tab);
        }

        $scope.loadExternalView = function (programId) {
            MenuPrograms.getProgramById(programId, function (result) {
                var program = result.program;
                if (program.url !== undefined) {
                    if (program.idiInterfac == "F" || program.idiInterfac == "P" || (program.idiTemplate != 33 && program.idiTemplate != 34)) {
                        var configs = Properties.getProperty(Properties.ACCESS_PREFERENCES);
                        if (program.idiInterfac == "P") {
                            if (configs.useRemoteShortcut == true
                                && configs.remoteConnectionType.toLowerCase() == "smartclient") {
                                $scope.openExternalView(program);    
                            } else {
                            $scope.showSMCAccessError(program.prg);
                            }
                        } else {
                            $scope.openExternalView(program);    
                        }                    
                    } else {
                        $.ajax('/' + program.url)
                        .success(function (result, status, xhr) {
                            $scope.openExternalView(program);
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            $scope.showProgramAccessError(program.url);
                        });
                    }                    
                } else {
                    $scope.showNonexistentProgramError($scope.tryStateUrl);   
                }                
            });
        };

        $scope.getCurrentViewota = function () {
            return appViewService.getPageActive().moduleId;
        }
        
        $scope.execProgramSMC = function (sessionId, url, prg, callback) {
            ExecuteProgram.execProgress(sessionId,
                                        url,
										"",
                                        prg,
                                        function (result) {

                /* Quando está bloqueada é porque está inicializando e ainda não está habilitada */
                if (result.sessionEnabled == 'false' && result.sessionBlocked == 'false') {
                    if (callback !== undefined) callback();
                }
            });               
        }
        
        $scope.openSMCModule = function (sessionId) {
            ExecuteProgram.returnParamsRemoteExecute(sessionId, function (result) {
                if (result.remoteConnectionType.toLowerCase() == 'smartclient') {
                    var iframes = $('#iframes');
                    
                    var urlProgram = "http://" + result.smartClientServer + ":" + result.smartClientServerPort + "?sessionParameter="
                    + result.params;
                    $scope.saveOpenedProgram('Smart Client', 'Smart Client');
                    iframes.append('<div id="smartClient" class="iframe-show">' +
                                   '<iframe id="smartClientIFrame" src="' + urlProgram + 
                                   '" frameborder="0" height="100%" width="100%"><iframe></div>');
                    var iframe = iframes.find('div#smartClient');
                    $(iframe[0]).removeClass('iframe-hide');
                }
            });   
        }

        $scope.openExternalView = function (program) {
            var iframes = $('#iframes');

            $('#iframes div').each(function () {
                $(this).addClass('iframe-hide');
                $(this).removeClass('iframe-show');
            });
            
            if (program.idiInterfac == 'P') {
                var sessionId = Properties.getProperty(Properties.USER, 'sessionID');
                var programsRunning = Properties.getProperty(Properties.SMART_CLIENT, 'programsRunning');
                if (programsRunning === undefined || programsRunning === null) { /* Primeira vez */
                    $scope.execProgramSMC(sessionId, program.url, program.prg, function() {
                        $scope.openSMCModule(sessionId);
                        var smartClientProperty = {programsRunning: []};
                        smartClientProperty.programsRunning[0] = program;
                        Properties.setProperty(Properties.SMART_CLIENT, smartClientProperty);
                    });
                } else {
                    var isProgramRunning = false;
                    for (var i = 0; i < programsRunning.length; i++) {
                        var smcProgram = programsRunning[i];
                        if (smcProgram.prg == program.prg) {
                            isProgramRunning = true;
                            break;
                        }
                    }
                    if (!isProgramRunning) {
                        $scope.execProgramSMC(sessionId, program.url, program.prg);    
                        programsRunning[programsRunning.length] = program;
                        Properties.addProperty(Properties.SMART_CLIENT, 'programsRunning', programsRunning);
                    }
                }
                appViewService.startView("Smart Client", undefined, undefined);
                var iframe = iframes.find('div#smartClient');
                $(iframe[0]).removeClass('iframe-hide');
            } else {
                if (appViewService.startView(program.nam, undefined, undefined)) {
                    var url = $location.path();
                    url = url.substring(1, url.length);
                    var idname = url.replace(/\//g, "_");
                    idname = idname.replace(/\+/g, "_");
                    var datasulFlex = $('#datasulFlex');
                    var size = $(window).height() - $('#menu-contents').offset().top;

                    var urlProgram = "/";

                    switch (program.idiInterfac) {

                        case
                            "F": /* Flex */
                            var datasulFlex = $('#datasulFlex');
                            if (datasulFlex.length==0) { /* Primeira vez, portanto deve-se abrir um novo iframe */
                                urlProgram += "datasul/?fromMenuHtml=true";
                                if (program.idiTemplate == 35) {
                                    urlProgram += "&homepage=true";
                                } else {
                                    if (program.idiCateg == 1) {
                                        urlProgram += "&module=" + program.mod + "&portlet=" + program.url;
                                    } else if (program.idiCateg == 3) {
                                        urlProgram += "&module=" + program.mod.replace(".swf", "");
                                        var view;
                                        if (program.prg==='fnd.ScheduleMonitor') {
                                            view = program.prg;
                                        } else {
                                            view = program.url;
                                        }
                                        urlProgram += "&view=" + view;
                                    } else {
                                        if (program.idiCateg == 11
                                            || program.idiCateg == 15
                                            || program.idiCateg == 16) {
                                            urlProgram += "&mdProgram=" +program.url;
                                        }
                                    }
                                }
                                iframes.append('<div id="datasulFlex" class="iframe-show"><iframe id="flexIframe" src="' + urlProgram +
                                    '" frameborder="0" height="100%" width="100%"><iframe></div>');
                                var flexProperties = Properties.getProperty(Properties.FLEX);
                                flexProperties["flexStarted"] = true;
                                Properties.setProperty(Properties.FLEX, flexProperties);
                            } else {
                                var flexProperties = Properties.getProperty(Properties.FLEX);
                                if (flexProperties["flexLoaded"]) {
                                    var executionsQueue = flexProperties["execQueue"];
                                    /* Retira o programa da fila caso o mesmo esteja lá */
                                    for (var i = 0; i < executionsQueue.length; i++) {
                                        var programId = executionsQueue[i];
                                        if (programId == program.prg) {
                                            executionsQueue.splice(i, 1);
                                            break;
                                        }
                                    }
                                    flexProperties["execQueue"] = executionsQueue;
                                    Properties.setProperty(Properties.FLEX, flexProperties);

                                    var data = {method: "runExternalProgram",
                                                module: program.mod,
                                                programId: program.prg,
                                                programType: (program.prg=='fnd.ScheduleMonitor')?'scheduleMonitor':(program.idiTemplate == 35)?"homepage":"program"};
                                    menuPostMessage(data, '*', document.getElementById('flexIframe'));
                                } else {
                                    var executionsQueue = flexProperties["execQueue"];
                                    executionsQueue[executionsQueue.length] = program.prg;
                                    Properties.setProperty(Properties.FLEX, flexProperties);
                                }
                            }
                            $scope.saveOpenedProgram(program.nam, 'datasulFlex');
                            var iframe = iframes.find('div#datasulFlex');
                            $(iframe[0]).removeClass('iframe-hide');
                            break;

                        default: /* Web HTML */
                            if (program.idiTemplate == 33 || program.idiTemplate == 34) {
                                urlProgram += program.url;                                
                            } else {
                                var iframeWS = $('#'+idname);
                                if (iframeWS.length == 0) {
                                    urlProgram += 'menu-html/html/menu/externalProgramWeb.html';

                                    var urlWebSpeed = Properties.getProperty(Properties.COMPANY, 'webspeedUrl');                            
                                    var isUserExternal = Properties.getProperty(Properties.USER, "isUserExternal", false);

                                    if(isUserExternal === true) {
                                        urlProgram += '?url='        + urlWebSpeed;
                                        urlProgram += '?program='    + program.url;
                                        urlProgram += '&module='     + program.mod;
                                        urlProgram += '&user='       + Properties.getProperty(Properties.USER, 'userDomain') +"|"+Properties.getProperty(Properties.USER, 'userExternal');
                                        urlProgram += '&password='   + " ";
                                        urlProgram += '&sessionID='  + Properties.getProperty(Properties.USER, 'sessionID');
                                        urlProgram += '&execution='  + "pri";
                                        urlProgram += '&dtsURL='     + $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/menu-html";
                                    } else {
                                        urlProgram += '?url='        + urlWebSpeed;
                                        urlProgram += '&program='    + program.url;
                                        urlProgram += '&module='     + program.mod;
                                        urlProgram += '&user='       + Properties.getProperty(Properties.USER, 'userCode');
                                        urlProgram += '&password='   + Properties.getProperty(Properties.COMPANY, 'password');
                                        urlProgram += '&sessionID='  + Properties.getProperty(Properties.USER, 'sessionID');
                                        urlProgram += '&execution='  + "pri";
                                        urlProgram += '&dtsURL='     + $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/menu-html";
                                    }
                                } else {
                                    var iframe = iframes.find('div#' + idname);
                                    $(iframe[0]).removeClass('iframe-hide');        
                                }
                            }
                            $scope.saveOpenedProgram(program.nam, idname);
                            iframes.append('<div id="' + idname +'" class="iframe-show"><iframe src="' + urlProgram +
                                    '" frameborder="0" height="100%" width="100%"><iframe></div>');    
                    }
                } else {
                    var idname = '';
                    if (program.idiInterfac=="F") {
                        var datasulFlex = $('#datasulFlex');
                        var flexProperties = Properties.getProperty(Properties.FLEX);
                        if (flexProperties["flexLoaded"]) {
                            var data = {method: "positionByProgramName",
                                        module: program.mod,
                                        programId: (program.idiTemplate == 35)?"fnd.homepage-flex":program.prg,
                                        programType: (program.prg=='fnd.ScheduleMonitor')?'scheduleMonitor':(program.idiTemplate == 35)?"homepage":"program"};

                            menuPostMessage(data, '*', document.getElementById('flexIframe'));
                        }
                        idname = 'datasulFlex';
                    } else {
                        var url = $location.path();
                        url = url.substring(1, url.length);
                        idname = url.replace(/\//g, "_");
                        idname = idname.replace(/\+/g, "_");
                    }
                    
                    var openedProgram = $scope.getOpenedProgramByName(program.nam);
                    var iframe = iframes.find('div#' + openedProgram.id);
                    $(iframe[0]).removeClass('iframe-hide');
                    $(iframe[0]).addClass('iframe-show');
                }    
            }
        };

        $scope.getOpenedProgramByName = function(name) {
            var openedPrograms = Properties.getProperty(Properties.OPENED_PROGRAMS);
            for (var i=0; i<openedPrograms.length; i++) {
                if (openedPrograms[i].name === name) {
                    return openedPrograms[i];
                }
            }
        }
        
        $scope.removeOpenedProgram = function(name) {
            var openedPrograms = Properties.getProperty(Properties.OPENED_PROGRAMS);
            for (var i=0; i<openedPrograms.length; i++) {
                if (openedPrograms[i].name === name) {
                    openedPrograms.splice(i, 1);
                }
            }
        }
        
        $scope.saveOpenedProgram = function(name, id) {
            var openedPrograms = Properties.getProperty(Properties.OPENED_PROGRAMS);
            if (openedPrograms === undefined) {
                openedPrograms = [];
                openedPrograms[0] = {name: name, id: id};                
            } else {
                openedPrograms[openedPrograms.length] = {name: name, id: id};
            }
            Properties.setProperty(Properties.OPENED_PROGRAMS, openedPrograms);
        }        
        
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent,function(e) {
            var data = (typeof e.data === 'string') ? JSON.parse(e.data) : e.data;
			
	       if (data.key == "openProgramProgress") {
               var programParams = data.value;
               var paramsToken = programParams.split('|');				
               var programUrl = paramsToken[0];
               var params = paramsToken[1];
				
                MenuPrograms.findProgramIdByNomProgExt(programUrl, function(result) {
                    var programId = result.programId;
                    if (programId !== undefined) {						
                        $rootScope.openProgramProgress(programUrl, params, programId);
                    }
                });
            } else if (data.key == "programName") {
                var programId = data.value;
                var programUrl = programId.replace(/\./g, "/");
                programUrl = programUrl.replace(/\_/g, "+");
                var url = "/external/datasul/" + programUrl;
                console.log("Programa solicitado: " + url);
                window.location = "#" + url;
            } else if (data.key == "flexLoaded") {
                var flexProperties = Properties.getProperty(Properties.FLEX);
                flexProperties["flexLoaded"] = data.value;

                if (flexProperties["flexLoaded"]) {
                    var executionsQueue = flexProperties["execQueue"];
                    for (var i = 0; i < executionsQueue.length; i++) {
                        var programId = executionsQueue[i];
                        var programUrl = programId.replace(/\./g, "/");
                        programUrl = programUrl.replace(/\_/g, "+");
                        var url = "/external/datasul/" + programUrl;
                        console.log("Programa da fila executado: " + url);
                        window.location = "#" + url;
                        executionsQueue.splice(i, 1);
                    }
                    flexProperties["execQueue"] = executionsQueue;
                }
                Properties.setProperty(Properties.FLEX, flexProperties);
            } else if (data.key == "lsError") {
                ModalWindow.openWindow('html/menu/license-error.html', {
                    controller: 'LicenseErrorCtrl',
                    code: data.value.split("|")[0],
                    msg: data.value.split("|")[1],
                    backdrop: false,
                    keyboard: false
                });
            } else if (data.key == "idleTimeoutHtml") {
                if (data.value == true) {
                    TimeOut.serviceResetTimeout(Idle);   
                }
            } else if (data.key == "server-toaster-message") {
				var titleFlex = data.value.split("|")[0];
				var msg = data.value.split("|")[1];
				var typeFlex = data.value.split("|")[2];
				$scope.link = data.value.split("|")[3];		
				
				if (typeFlex == "1") {
					messageHolder.showNotify({type:messageHolder.WARNING,title:titleFlex,detail:msg});				
				} else if (typeFlex == "2") {
					messageHolder.showNotify({type:messageHolder.ERROR,title:titleFlex,detail:msg});
				} else if (typeFlex == "0" || typeFlex == "3") {
                    if ($scope.link === "null") {
					   messageHolder.showNotify({type:messageHolder.SUCCESS,title:titleFlex,detail:msg});
                    } else {
messageHolder.showNotify({type:messageHolder.SUCCESS,title:titleFlex,detail:msg,callback:$scope.openToasterLink});
                    }
				}
				
				$scope.getPulseInformation(false);
			} else if (data.key == "login-expired-message") {
				var title = data.value.split("|")[0];
				var message = data.value.split("|")[1];
				messageHolder.showMsg(title, message, messageHolder.ERROR, function() {ServDoLogout.callLogout();});
			} else if (data.key == "showMsg") {
				var titleFlex = data.value.split("|")[0];
				var msg = data.value.split("|")[1];
				var typeFlex = data.value.split("|")[2];
				if (typeFlex == "1") {
					messageHolder.showMsg(titleFlex, msg, messageHolder.WARNING);
				} else if (typeFlex == "2") {
					messageHolder.showMsg(titleFlex, msg, messageHolder.ERROR);
				} else if (typeFlex == "0" || typeFlex == "3") {
					messageHolder.showMsg(titleFlex, msg, messageHolder.SUCCESS);
				}
                if (titleFlex == "IDE Metadados") {
                    maincontrol.close(appViewService.getPageActive());
                }                    
			}
        },false);

        var beforeOnLoadEvent = eventMethod == "attachEvent" ? "onbeforeunload" : "beforeunload";

        eventer(beforeOnLoadEvent, function(e) {

            if (window.menuClosed) {

                var url = 'resources/license/killLicenseLogoff?sessionId=' + $rootScope.sessionID

                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, false);
                xhr.send(null);

                url = 'resources/execProgram/quitDILogoff?sessionId=' + $rootScope.sessionID

                xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.send(null);

            } else {
                window.menuClosed = true;
            }

        }, false);
		
		$scope.openToasterLink = function () {
			if ($scope.link !== undefined && $scope.link !== "") {
				var popup = window.open($scope.link,'_blank');
				if ($scope.link.indexOf(".pdf") < 0) {
					setTimeout(function(){popup.close()},200);
				}
				$scope.link = null;
			}		
		}

        //Executa a abertura da tela de ajuda.
        $scope.openHelp = function () {
            ModalWindow.openWindow('html/menu/helpModal.html',{
                controller: 'HelpCtrl',
                size: ModalWindow.SMALL_WINDOW
            });
        };

        //Executa a abertura da tela de histórico de mensagens.
        $scope.openMessageHistory = function () {
            ModalWindow.openWindow('html/menu/messageHistory.html',{
                controller: 'MessageHistoryCtrl'
            });
        };

        //Executa a abertura da tela de opções do menu.
        $scope.openOptions = function () {

            ModalWindow.openWindow('html/menu/options.html',{
                controller: 'OptionsCtrl',
                size: ModalWindow.SMALL_WINDOW
            });
        };

        //Executa a abertura da tela de central de documentos.
        $scope.openCentralDocuments = function () {
            ModalWindow.openWindow('html/menu/centralDocuments.html', {
                controller: 'CentralDocumentsCtrl'
            });
        };

        $scope.openChangeCompany = function () {

            $rootScope.openProgramProgress("cdp/cd0104aa.w", "cd0104aa");
            $rootScope.acceleratePulse = true;
        }

        this.openViews = appViewService.openViews;
        this.select = appViewService.select;

        this.close  = function(view) {
            var urlPrefix = view.url.split('/')[1];

            if (urlPrefix=="external") {
                var externalType = view.url.split('/')[2];
                switch(externalType) {
                    case
                        "datasul":
                            var countPrgs = this.countOpenedFlexPrograms(this.openViews);
                            var url = view.url;
                            url = url.replace("/external/datasul/", "");
                            var idname = url.replace(/\//g, ".");
                            idname = idname.replace(/\+/g, "_");

                            MenuPrograms.getProgramById(idname, function (result) {

                                var program = result.program;

                                var data = {method: "closeByProgramName",
                                            module: program.mod,
                                            programId: (program.idiTemplate == 35)?"fnd.homepage-flex":program.prg,
                                            programType: (program.prg=='fnd.ScheduleMonitor')?'scheduleMonitor':(program.idiTemplate == 35)?"homepage":"program"};

                                menuPostMessage(data, '*', document.getElementById('flexIframe'));
                                appViewService.removeView(view);
                            });

                            if (countPrgs===1) {

                                setTimeout(function () {
                                    /* Remover o iframe do Flex */
                                    var flexProperties = Properties.getProperty(Properties.FLEX);
                                    flexProperties["flexLoaded"] = false;
                                    flexProperties["flexStarted"] = false;
                                    flexProperties["execQueue"] = [];
                                    Properties.setProperty(Properties.FLEX, flexProperties);
                                    $('#datasulFlex').remove();
                                }, 1000);
                            }
                        break;
                    case 
                        "smartclient":
                             Properties.addProperty(Properties.SMART_CLIENT, 'programsRunning', undefined);
                             $('#smartClient').remove();
                             appViewService.removeView(view);
                         break;
                    default:
                        var url = view.url.substring(1, view.url.length);
                        var idname = url.replace(/\//g, "_");
                        idname = idname.replace(/\+/g, "_");
                        $("#"+idname).remove();
                        appViewService.removeView(view);
                }
                $scope.removeOpenedProgram(view.name);
            } else {
                appViewService.removeView(view);
            }            
        }

        this.countOpenedFlexPrograms = function(openViews) {
            var count = 0;
            for (var i = 0; i < openViews.length; i++) {
                if(openViews[i].url.indexOf('datasul')>0)
                    count++;
            }
            return count;
        }

        this.hasPendingRequests = function () {
            return $rootScope.pendingRequests > 0;
        };

        $scope.dateToday = $filter('date')(new Date(), 'dd/MM/yyyy');

        $scope.properties = {};
        $scope.settings = {};

        $scope.callLogout = ServDoLogout.callLogout;

        $rootScope.callExternalProgram = function (programId, idiInterfac) {
            var url = "/external/";
            programId = programId.replace(/\./g, "/");
            programId = programId.replace(/\_/g, "+");
            
            switch (idiInterfac) {
                case "F":
                    url += "datasul/" + programId;
                    var flexProperties = Properties.getProperty(Properties.FLEX);
                    if (!flexProperties["flexLoaded"] && flexProperties["flexStarted"]) {
                        var executionsQueue = flexProperties["execQueue"];
                        executionsQueue[executionsQueue.length] = programId;
                        Properties.setProperty(Properties.FLEX, flexProperties);
                    } else {
                        $location.url(url);
                    }
                    break;
                case "P":
                    url += "smartclient/" + programId;
                    $location.url(url);
                    break;                
                default:                    
                    url += "webspeed/" + programId;
                    $location.url(url);                    
            }
        }
        
        $rootScope.favData = {
            loaded: false
        };
        
        //Grupo de menu selecionado (favoritos, recentes, aplicativos e processos).
        $rootScope.menuGroups = { RECENTS: "recents", FAVORITES: "favorites", APPLICATIONS: "application", PROCESSES: "processes" };
        
        $rootScope.clickFavorite = function (program, byProgram) {
            var isProgFavorite = program.fav;
            if (program.fav == false) {
                MenuFavorite.addFavorite($rootScope.favData.loaded, program, MenuSettings.getSetting('userCode'), function () {});
            } else {
                MenuFavorite.removeFavorite(program, MenuSettings.getSetting('userCode'), function () {});
            }
            if ($rootScope.selectedMenuGroup !== $rootScope.menuGroups.APPLICATIONS || byProgram) {
                var grpApplications = MenuApplications.getApplications();            
                for (var i = 0; i < grpApplications.length; i++) {
                    var grpAplicat = grpApplications[i];
                    if (grpAplicat.codGroupAplicat == program.grp) {
                        var modules = grpAplicat.modules;
                        for (var o = 0; o < modules.length; o++) {
                            var module = modules[o];
                            if (module.moduleId == program.mod.substring(0, program.mod.indexOf(".swf")).toUpperCase()){
                                if (program.prgType == 1) {
                                    var prgConsultsCached = module["consults"];
                                    if (prgConsultsCached !== undefined) {
                                        for (var u = 0; u < prgConsultsCached.length; u++) {
                                            var prgConsult = prgConsultsCached[u];
                                            if (prgConsult.prg == program.prg) {
                                                prgConsult.fav = !isProgFavorite;
                                                break;
                                            }
                                        }
                                    }                                
                                } else if (program.prgType == 2) {
                                    var prgCrudsCached = module["cruds"];
                                    if (prgCrudsCached !== undefined) {
                                        for (var u = 0; u < prgCrudsCached.length; u++) {
                                            var prgCrud = prgCrudsCached[u];
                                            if (prgCrud.prg == program.prg) {
                                                prgCrud.fav = !isProgFavorite;
                                                break;
                                            }
                                        }    
                                    }                                
                                } else if (program.prgType == 3) {
                                    var prgReportsCached = module["reports"];
                                    if (prgReportsCached !== undefined) {
                                        for (var u = 0; u < prgReportsCached.length; u++) {
                                            var prgReport = prgReportsCached[u];
                                            if (prgReport.prg == program.prg) {
                                                prgReport.fav = !isProgFavorite;                                                
                                                break;
                                            }
                                        }
                                    }                                
                                } else {
                                    var prgTasksCached = module["tasks"];
                                    if (prgTasksCached !== undefined) {
                                        for (var u = 0; u < prgTasksCached.length; u++) {
                                            var prgTask = prgTasksCached[u];
                                            if (prgTask.prg == program.prg) {
                                                prgTask.fav = !isProgFavorite;
                                                break;
                                            }
                                        }    
                                    }                                
                                }
                                break;
                            }
                        }
                        break;
                    }
                }            
            }
            
            if ($rootScope.selectedMenuGroup !== $rootScope.menuGroups.FAVORITES || byProgram) {
                //Atualizando a informação nos favoritos
                if (program.prgType == 1) {
                    for (var u = 0; u < MenuFavorite.consults.length; u++) {
                        var prgConsult = MenuFavorite.consults[u];
                        if (prgConsult.prg == program.prg) {
                            prgConsult.fav = !isProgFavorite;
                            break;
                        }
                    }
                } else if (program.prgType == 2) {
                    for (var u = 0; u < MenuFavorite.cruds.length; u++) {
                        var prgCrud = MenuFavorite.cruds[u];
                        if (prgCrud.prg == program.prg) {
                            prgCrud.fav = !isProgFavorite;
                            break;
                        }
                    }   
                } else if (program.prgType == 3) {
                    for (var u = 0; u < MenuFavorite.reports.length; u++) {
                        var prgReport = MenuFavorite.reports[u];
                        if (prgReport.prg == program.prg) {
                            prgReport.fav = !isProgFavorite;
                            break;
                        }
                    }    
                } else {
                    for (var u = 0; u < MenuFavorite.tasks.length; u++) {
                        var prgTask = MenuFavorite.tasks[u];
                        if (prgTask.prg == program.prg) {
                            prgTask.fav = !isProgFavorite;
                            break;
                        }
                    }    
                }
            }
            
            if ($rootScope.selectedMenuGroup !== $rootScope.menuGroups.RECENTS || byProgram) {
                //Atualizando a informação nos recentes
                if (program.prgType == 1) {
                    for (var u = 0; u < RecentsPrograms.consults.length; u++) {
                        var prgConsult = RecentsPrograms.consults[u];
                        if (prgConsult.prg == program.prg) {
                            prgConsult.fav = !isProgFavorite;
                            break;
                        }
                    }
                } else if (program.prgType == 2) {
                    for (var u = 0; u < RecentsPrograms.cruds.length; u++) {
                        var prgCrud = RecentsPrograms.cruds[u];
                        if (prgCrud.prg == program.prg) {
                            prgCrud.fav = !isProgFavorite;
                            break;
                        }
                    }   
                } else if (program.prgType == 3) {
                    for (var u = 0; u < RecentsPrograms.reports.length; u++) {
                        var prgReport = RecentsPrograms.reports[u];
                        if (prgReport.prg == program.prg) {
                            prgReport.fav = !isProgFavorite;
                            break;
                        }
                    }    
                } else {
                    for (var u = 0; u < RecentsPrograms.tasks.length; u++) {
                        var prgTask = RecentsPrograms.tasks[u];
                        if (prgTask.prg == program.prg) {
                            prgTask.fav = !isProgFavorite;
                            break;
                        }
                    }    
                }
            } 
            
            if ($rootScope.selectedMenuGroup !== $rootScope.menuGroups.PROCESSES || byProgram) {
                // Atualizando informações nos processos
                var processes = $scope.data.processes;
                for (var i=0; i< processes.length; i++) {
                    var prc = processes[i];                
                    if (prc["programs"] !== undefined && prc["programs"] !== null) {
                        for (var u=0; u<prc["programs"].length; u++) {
                            var procProgram = prc["programs"][u];
                            if (procProgram.prg == program.prg) {
                                procProgram.fav = !isProgFavorite;
                                break;
                            }
                        }
                    }                
                }   
            }
            
            program.fav = !isProgFavorite;
        }
        
        // Pulse de informações //
        $timeout(ServPulseInfo.pulseInfo, 60000)   
    }]);
});