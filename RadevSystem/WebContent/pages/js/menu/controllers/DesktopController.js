define(['index'], function (index) {
    'use strict';
    
    index.register.controller('DesktopController',['$rootScope','$filter','$http','$scope','$window','$location','hotkeys','totvs.app-main-view.Service','MenuApplications','MenuPrograms','MenuSettings','ConfigManager','MenuFavorite','ModalWindow','ExecuteProgram','ServDoLogout','ServiceDownloadFile','RecentsPrograms','Tasks','GEDIntegration','PulseInformation',function($rootScope,$filter,$http,$scope,$window,$location,hotkeys,appViewService,MenuApplications,MenuPrograms,MenuSettings,ConfigManager,MenuFavorite,ModalWindow,ExecuteProgram,ServDoLogout,ServiceDownloadFile,RecentsPrograms,Tasks,GEDIntegration,PulseInformation) {
        var i18n = $filter('i18n'),
            grpApplications = MenuApplications.getApplications();

        for (var i = 0, len = grpApplications.length; i < len; i++) {
            var app = grpApplications[i];
            app.selected = true;
        }

        $scope.getFilterOptionValue = function(name) {
            var filterOptions = Properties.getProperty(Properties.FILTER_OPTIONS);
            for (var i = 0; i < filterOptions.length; i++) {
                var filterOption = filterOptions[i];
                if (filterOption.name === name) {
                    return filterOption.value;
                }
            }
        }

        $scope.setFilterOptionValue = function(name, value) {
            var filterOptions = Properties.getProperty(Properties.FILTER_OPTIONS);
            for (var i = 0; i < filterOptions.length; i++) {
                var filterOption = filterOptions[i];
                if (filterOption.name === name) {
                    filterOption.value = value;
                }
            }
            Properties.setProperty(Properties.FILTER_OPTIONS, filterOptions);
        }        
        
        $scope.filterOptions = Properties.getProperty(Properties.FILTER_OPTIONS);
        
        if ($scope.filterOptions === undefined ||
            $scope.filterOptions === null) {
			$scope.keywords = "";
            var filterOptionsDefault = [{name: "all", value: true},
                                    {name: "tasks", value: true},
                                    {name: "reports", value: true},
                                    {name: "consults", value: true},
                                    {name: "cruds", value: true},
                                    {name: "grpApplications", value: grpApplications},
                                    {name: "keywords", value: $scope.keywords}];
            Properties.setProperty(Properties.FILTER_OPTIONS, filterOptionsDefault);            
            $scope.filterOptions = Properties.getProperty(Properties.FILTER_OPTIONS);
        } else {
            $scope.keywords = $scope.getFilterOptionValue("keywords");
        }
        
        //Indica se está ou não aplicado filtro no menu.
        $scope.menuFiltered = false;
        
        //Inicia o módulo da página inicial.
        appViewService.startView(appViewService.HOME, "DesktopController", this);
        
        $scope.configs = Properties.getProperty(Properties.ACCESS_PREFERENCES);
        
        $scope.defineHotKeys = function() {

            hotkeys.add({combo: 'ctrl+alt+s',
                     description: 'Sair',
                     callback: function() {
                         ServDoLogout.callLogout();
                     }
                  });
                  
            hotkeys.add({combo: 'ctrl+shift+b',
                     description: 'Pesquisar conteúdo',
                     callback: function() {
                         $('#keywords').focus();
                     }
                  });

            hotkeys.add({combo: 'ctrl+alt+a',
                         description: 'Ajuda',
                         callback: function() {
                             $scope.openHelp('prcs')
                         }
                      });
            
            hotkeys.add({combo: 'ctrl+alt+e',
                         description: 'Troca empresa',
                         callback: function() {
                             $scope.openChangeCompany()
                         }
                      });
                      
            hotkeys.add({combo: 'ctrl+alt+f',
                         description: 'Ferramentas',
                         callback: function() {
                             $scope.openOptions()
                         }
                      });
            
            hotkeys.add({combo: 'ctrl+alt+h',
                         description: 'Hitórico de mensagens',
                         callback: function() {
                             $scope.openMessageHistory()
                         }
                      });
                      
            hotkeys.add({combo: 'ctrl+alt+t',
                         description: 'Tarefas',
                         callback: function() {
                             $scope.openTaskMonitor()
                         }
                      });
        };

        $scope.defineHotKeys();
        
        $scope.loadModules = function (app) {
            var element = $('#' + app.codGroupAplicat);
            element.next().slideToggle();
        };

        $scope.loadMenu = function (id) {
            var apps = $('#apps'),
                prcs = $('#prcs');

            if (id === 'apps') {
                prcs.next().slideUp();
                apps.next().slideDown();
            } else {
                apps.next().slideUp();
                prcs.next().slideDown();
            }
        };

        //Executa a abertura da tela de filtro avançado.
        $scope.openAdvancedFilter = function () {
            ModalWindow.openWindow('html/menu/advancedFilter.html', {
                controller: 'AdvancedFilterCtrl'
			});
        };

        $scope.selectedTipProgram = MenuSettings.getSetting("selectedTipProgram") || 4;

        $scope.selectTipProgram = function(tipProgram) {

            if (tipProgram == 4) {
                $scope.programs = $scope.tasks;
            } else if (tipProgram == 3) {
                $scope.programs = $scope.reports;
            } else if (tipProgram == 1) {
                $scope.programs = $scope.consults;
            } else if (tipProgram == 2) {
                $scope.programs = $scope.cruds;
            }

            $scope.selectedTipProgram = tipProgram;
            MenuSettings.setSetting("selectedTipProgram", $scope.selectedTipProgram);
        }

        $scope.selectedGrpAplicat;
        $scope.selectedModule;
        $scope.selectedMenuItem = MenuSettings.getSetting("selectedMenuItem");
        $scope.selectedOtherOptions;
        $scope.menuHeaderTitle;

        //Pending Tasks ECM.
		var ecmIntegrated = Properties.getProperty(Properties.PROPERTIES, "ecm.integrated", "false");		
		if (ecmIntegrated === "true") {
			Tasks.getPendingTasks(function(result){
				$scope.pendingTasks = result.tasks;
			});
		}        
        
        $scope.searchMenu = function(search) {
            $rootScope.selectedProcess = null;
			var lastSearchMenu = $scope.getFilterOptionValue("keywords");
            var lastProgramsByResearch = false;
            if (MenuPrograms.tasks.length > 0) {
                lastProgramsByResearch = MenuPrograms.tasks[0].researched;
            } else if (MenuPrograms.reports.length > 0) {
                lastProgramsByResearch = MenuPrograms.reports[0].researched;
            } else if (MenuPrograms.consults.length > 0) {
                lastProgramsByResearch = MenuPrograms.consults[0].researched;
            } else if (MenuPrograms.cruds.length > 0) {
                lastProgramsByResearch = MenuPrograms.cruds[0].researched;
            }
            var filterOptions = Properties.getProperty(Properties.FILTER_OPTIONS);
            
            if (lastProgramsByResearch && 
                search == lastSearchMenu &&
                $scope.checkFilterChanges(filterOptions) === false) {
                $scope.tasks = MenuPrograms.tasks;                        
                $scope.reports = MenuPrograms.reports;                        
                $scope.consults = MenuPrograms.consults;                        
                $scope.cruds = MenuPrograms.cruds;
                
                $scope.selectTipProgram($scope.selectedTipProgram);
                $scope.menuHeaderTitle = "Exibindo itens filtrados pela palavra \"" + search + "\"";
            } else {
                if (search !== undefined && search !== "") {
                    $scope.menuHeaderTitle = "Pesquisando...";
                    $scope.selectedModule = null;
                    $scope.showAppsPrgs = true;
                    $scope.selectedOtherOptions = null;                    
                    $scope.setFilterOptionValue("keywords", search);
                    
                    $scope.lastFilterOptions = angular.copy(filterOptions);
                    var tipPrograms = [];
                    var grpApplications = [];
                    var allTipProgramIncluded = false;
                    for (var i = 0; i < filterOptions.length; i++) {
                        var filterOption = filterOptions[i];
                        if (filterOption.value) {
                            if (i == 0) {
                                tipPrograms[0] = 1;
                                tipPrograms[1] = 2;
                                tipPrograms[2] = 3;
                                tipPrograms[3] = 4;
                                allTipProgramIncluded = true;
                            } else {
                                if (!allTipProgramIncluded) {
                                    if (filterOption.name == "tasks") {
                                        tipPrograms[tipPrograms.length] = 4;
                                    } else if (filterOption.name == "reports") {
                                        tipPrograms[tipPrograms.length] = 3;
                                    } else if (filterOption.name == "consults") {
                                        tipPrograms[tipPrograms.length] = 1;
                                    } else if (filterOption.name == "cruds") {
                                        tipPrograms[tipPrograms.length] = 2;
                                    }
                                }
                                if (filterOption.name == "grpApplications") {
                                    var applicationList = filterOption.value;
                                    for (var o = 0; o < applicationList.length; o++) {
                                        var app = applicationList[o];
                                        if (app.selected) {
                                            grpApplications.push(app.codGroupAplicat);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    MenuPrograms.getPrograms(null, null, null, search, tipPrograms, grpApplications, function (result) {
                        if (result["tip4"] === undefined) {
                            $scope.tasks = [];
                            MenuPrograms.tasks = [];
                        } else {
                            $scope.tasks = result.tip4.programs;
                            MenuPrograms.tasks = result.tip4.programs;
                        }

                        if (result["tip3"] === undefined) {
                            $scope.reports = [];
                            MenuPrograms.reports = [];
                        } else {
                            $scope.reports = result.tip3.programs;
                            MenuPrograms.reports = result.tip3.programs;
                        }

                        if (result["tip1"] === undefined) {
                            $scope.consults = [];
                            MenuPrograms.consults = [];
                        } else {
                            $scope.consults = result.tip1.programs;
                            MenuPrograms.consults = result.tip1.programs;
                        }

                        if (result["tip2"] === undefined) {
                            $scope.cruds = [];
                            MenuPrograms.cruds = [];
                        } else {
                            $scope.cruds = result.tip2.programs;
                            MenuPrograms.cruds = result.tip2.programs;
                        }
                        $scope.selectTipProgram($scope.selectedTipProgram);
                        $scope.menuHeaderTitle = "Exibindo itens filtrados pela palavra \"" + search + "\"";
						$scope.menuFiltered = true;
                        $rootScope.selectedMenuGroup = undefined;
                    });                    
                }
            }
        };
        
        $scope.checkFilterChanges = function(filterOptions) {
            var result = false;
            for (var i = 0; i < filterOptions.length; i++) {
                var currentFilterOption = filterOptions[i];
                var lastFilterOption = $scope.lastFilterOptions[i];
                if (currentFilterOption.name === "grpApplications") {
                    var currentAppListFilter = currentFilterOption.value;
                    var lastAppListFilter = lastFilterOption.value;
                    for (var o = 0; o < currentAppListFilter.length; o++) {
                        var currentApp = currentAppListFilter[o];
                        var lastApp = lastAppListFilter[o];
                        if (currentApp.selected !== lastApp.selected) {
                            return true;                            
                        }
                    }
                } else {
                    if (currentFilterOption.value !== lastFilterOption.value) {
                        return true;                        
                    }            
                }                
            }
            return result;
        }
        
        $scope.loadCachedAppAndModule = function() {
            ConfigManager.getConfig('lastSelectedMenuItem', 'framework.menu', function(result) {
                var config = result;
                if (config !== undefined && config.desValConfigur !== undefined) {
                    var grpAplicatSelected = config.desValConfigur.split("|")[0];
                    var moduleSelected = config.desValConfigur.split("|")[1];

                    for (var i = 0; i < $scope.data.applications.length; i++) {
                        var grpAplicat = $scope.data.applications[i];
                        if (grpAplicat.codGroupAplicat == grpAplicatSelected){
                            $scope.selectedGrpAplicat = grpAplicat;
                            for (var o = 0; o < grpAplicat.modules.length; o++) {
                                var module = grpAplicat.modules[o];
                                if (module.moduleId == moduleSelected) {
                                    $scope.selectedModule = module;
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    $scope.loadModules($scope.selectedGrpAplicat);

                    var lastProgramsByResearch = false;
                    if (MenuPrograms.tasks.length > 0) {
                        lastProgramsByResearch = MenuPrograms.tasks[0].researched;
                    } else if (MenuPrograms.reports.length > 0) {
                        lastProgramsByResearch = MenuPrograms.reports[0].researched;
                    } else if (MenuPrograms.consults.length > 0) {
                        lastProgramsByResearch = MenuPrograms.consults[0].researched;
                    } else if (MenuPrograms.cruds.length > 0) {
                        lastProgramsByResearch = MenuPrograms.cruds[0].researched;
                    }

                    if (lastProgramsByResearch) {
                        if ($scope.keywords !== undefined ||
                            $scope.keywords !== "") {
                            $scope.selectedModule = null;
                            $scope.searchMenu($scope.keywords);
                        }
                    } else {
                        $scope.selectModule($scope.selectedGrpAplicat, $scope.selectedModule, function() {
                            //Efetua o precarregamento do Progress.
                            if ($scope.configsOptions.preLoadProgress === 'true') {
                                $scope.callDIWhenInitMenu();
                            }

                            /*setTimeout(function() {
                            //Pending Tasks ECM.
                            Tasks.getPendingTasks(function(result){
                                $scope.pendingTasks = result.tasks;
                            });
                            }, 500);*/
                    });
                }
                } /*else{
                //Pending Tasks ECM.
                Tasks.getPendingTasks(function(result){
                    $scope.pendingTasks = result.tasks;
                    });
                }*/
            });
        };
        $scope.selectProcess = function (process) {
            $scope.loadMenu('prcs');
            if (process !== null && process !== undefined) {
                $scope.selectedModule = null;
                $scope.showInProcess = true;
                $scope.menuHeaderTitle = process.desProcess;
                $scope.showAppsPrgs = false;
                $rootScope.selectedProcess = process;
                if (process["programs"] != null) {
                    $scope.programs = process["programs"];
                } else {
                    MenuPrograms.getProcessProgram(process.idiProcess, function (result) {
                        $scope.programs = result.programs;
                        process["programs"] = $scope.programs;
                    });
                }

                $rootScope.selectedMenuGroup = $rootScope.menuGroups.PROCESSES;
            }
        };


        $scope.hasFavoritesCached = function () {
            var hasValueCached = false;
            if (MenuFavorite.tasks.length > 0) {
                hasValueCached = true;
            } else if (MenuFavorite.reports.length > 0) {
                hasValueCached = true;
            } else if (MenuFavorite.consults.length > 0) {
                hasValueCached = true;
            } else if (MenuFavorite.cruds.length > 0) {
                hasValueCached = true;
            }
            return hasValueCached;
        }

        $scope.hasRecentsCached = function () {
            var hasValueCached = false;
            if (RecentsPrograms.tasks.length > 0) {
                hasValueCached = true;
            } else if (RecentsPrograms.reports.length > 0) {
                hasValueCached = true;
            } else if (RecentsPrograms.consults.length > 0) {
                hasValueCached = true;
            } else if (RecentsPrograms.cruds.length > 0) {
                hasValueCached = true;
            }
            return hasValueCached;
        }

        $scope.getFavorites = function () {
            var userId = Properties.getProperty(Properties.USER,'userCode');

            $scope.menuHeaderTitle = i18n('favorites').toUpperCase();
            $scope.selectedModule = null;
            $scope.selectedMenuItem = null;
            $scope.keywords = "";
            $scope.selectedOtherOptions = 2;

            if (!$scope.hasFavoritesCached()) {
                MenuFavorite.getFavorites(userId, function(result) {
                    $scope.tasks    = result.tip4.programs;
                    MenuFavorite.tasks = result.tip4.programs;
                    $scope.reports  = result.tip3.programs;
                    MenuFavorite.reports = result.tip3.programs;
                    $scope.consults = result.tip1.programs;
                    MenuFavorite.consults = result.tip1.programs;
                    $scope.cruds    = result.tip2.programs;
                    MenuFavorite.cruds = result.tip2.programs;
                    $scope.selectTipProgram($scope.selectedTipProgram);
                });
            } else {
                $scope.tasks = $scope.getFavoriteTasks();
                $scope.reports  = $scope.getFavoriteReports();
                $scope.consults = $scope.getFavoriteConsults();
                $scope.cruds    = $scope.getFavoriteCruds();
                $scope.selectTipProgram($scope.selectedTipProgram);
            }
            $rootScope.selectedMenuGroup = $rootScope.menuGroups.FAVORITES;
            $rootScope.favData.loaded = true;
        };
        
        $scope.getFavoriteTasks = function() {
            var i = MenuFavorite.tasks.length;
            while (i--) {
                var program = MenuFavorite.tasks[i];
                if (!program.fav) {                
                    MenuFavorite.tasks.splice(i,1);
                }
            }
            return MenuFavorite.tasks;
        }

        $scope.getFavoriteReports = function() {
            var i = MenuFavorite.reports.length;
            while (i--) {
                var program = MenuFavorite.reports[i];
                if (!program.fav) {                
                    MenuFavorite.reports.splice(i,1);
                }
            }
            return MenuFavorite.reports;
        }
        
        $scope.getFavoriteConsults = function() {
            var i = MenuFavorite.consults.length;
            while (i--) {
                var program = MenuFavorite.consults[i];
                if (!program.fav) {                
                    MenuFavorite.consults.splice(i,1);
                }
            }
            return MenuFavorite.consults;
        }
        
        $scope.getFavoriteCruds = function() {
            var i = MenuFavorite.cruds.length;
            while (i--) {
                var program = MenuFavorite.cruds[i];
                if (!program.fav) {                
                    MenuFavorite.cruds.splice(i,1);
                }
            }
            return MenuFavorite.cruds;
        }
        
        $scope.getRecents = function () {
            var userId = Properties.getProperty(Properties.USER,'userCode');

            $scope.menuHeaderTitle = i18n('recents').toUpperCase();
            $scope.selectedModule = null;
            $scope.selectedMenuItem = null;
            $scope.keywords = "";
            $scope.selectedOtherOptions = 1;
            if (!$scope.hasRecentsCached()) {
                RecentsPrograms.getUserRecents(userId, function(result) {
                    $scope.tasks    = result.tip4.programs;
                    RecentsPrograms.tasks = result.tip4.programs;
                    $scope.reports  = result.tip3.programs;
                    RecentsPrograms.reports = result.tip3.programs;
                    $scope.consults = result.tip1.programs;
                    RecentsPrograms.consults = result.tip1.programs;
                    $scope.cruds    = result.tip2.programs;
                    RecentsPrograms.cruds = result.tip2.programs;
                    $scope.selectTipProgram($scope.selectedTipProgram);
                });
            } else {
                $scope.tasks = RecentsPrograms.tasks;
                $scope.reports  = RecentsPrograms.reports;
                $scope.consults = RecentsPrograms.consults;
                $scope.cruds    = RecentsPrograms.cruds;
                $scope.selectTipProgram($scope.selectedTipProgram);
            }

            $rootScope.selectedMenuGroup = $rootScope.menuGroups.RECENTS;
            $scope.selectTipProgram($scope.selectedTipProgram);
        };

        switch ($rootScope.selectedMenuGroup) {
            case $rootScope.menuGroups.RECENTS:
                $scope.getRecents();
                break;
            case $rootScope.menuGroups.FAVORITES:
                $scope.getFavorites();
                break;
            case $rootScope.menuGroups.APPLICATIONS:
                $scope.loadCachedAppAndModule();
                break;
            case $rootScope.menuGroups.PROCESSES:
                $scope.selectProcess($rootScope.selectedProcess);
                break;
            default:
                $scope.loadCachedAppAndModule();
        }
        
        $scope.selectModule = function (application, module, callback) {
            
			$scope.showInProcess = false;
            $scope.selectedOtherOptions = null;
			$scope.selectedMenuItem = null;
            $scope.selectedModule = module;
            $rootScope.selectedProcess = null;            
            
            if (application !== null && application !== undefined && 
                module !== null && module !== undefined) {

                var menuOption = {tip: 'module', value: $scope.selectedModule};
                $rootScope.$broadcast('menuOptionChange', menuOption);
                $scope.menuHeaderTitle = /*application.desGroupAplicat.toUpperCase() + " | " + */ module.description;
                $scope.setFilterOptionValue("keywords", "");                
                $scope.keywords = "";

                if ((module["tasks"] != null) || (module["reports"] != null)
                    || (module["consults"] != null) || (module["cruds"] != null)) {
                    $scope.tasks     = module["tasks"];
                    $scope.reports   = module["reports"];
                    $scope.consults  = module["consults"];
                    $scope.cruds     = module["cruds"];
                    MenuPrograms.tasks    = $scope.tasks;
                    MenuPrograms.reports  = $scope.reports;
                    MenuPrograms.consults = $scope.consults;
                    MenuPrograms.cruds    = $scope.cruds;                    
                    
                    $scope.selectTipProgram($scope.selectedTipProgram);
                } else {
                    var tipPrograms = [];
                    var allTipProgramIncluded = false;
                    for (var i = 0; i < $scope.filterOptions.length; i++) {
                        var filterOption = $scope.filterOptions[i];
                        if (filterOption.value) {
                            if (i == 0) {
                                tipPrograms[0] = 1;
                                tipPrograms[1] = 2;
                                tipPrograms[2] = 3;
                                tipPrograms[3] = 4;
                                allTipProgramIncluded = true;
                            } else {
                                if (!allTipProgramIncluded) {
                                    if (filterOption.name == "tasks") {
                                        tipPrograms[tipPrograms.length] = 4;
                                    } else if (filterOption.name == "reports") {
                                        tipPrograms[tipPrograms.length] = 3;
                                    } else if (filterOption.name == "consults") {
                                        tipPrograms[tipPrograms.length] = 1;
                                    } else if (filterOption.name == "cruds") {
                                        tipPrograms[tipPrograms.length] = 2;
                                    }
                                }
                            }
                        }
                    }

                    MenuPrograms.getPrograms(module.moduleId, null, null, null, tipPrograms, [application.codGroupAplicat],
                        function (result) {

                            if (result["tip4"] === undefined) {
                                $scope.tasks = [];                            
                                MenuPrograms.tasks = [];
                                module["tasks"] = [];
                            } else {
                                $scope.tasks = result.tip4.programs;                            
                                MenuPrograms.tasks = result.tip4.programs;
                                module["tasks"] = result.tip4.programs;
                            }

                            if (result["tip3"] === undefined) {
                                $scope.reports = [];                            
                                MenuPrograms.reports = [];
                                module["reports"] = [];
                            } else {
                                $scope.reports = result.tip3.programs;                            
                                MenuPrograms.reports = result.tip3.programs;
                                module["reports"] = result.tip3.programs;
                            }

                            if (result["tip1"] === undefined) {
                                $scope.consults = [];
                                MenuPrograms.consults = [];
                                module["consults"] = [];
                            } else {
                                $scope.consults = result.tip1.programs;                            
                                MenuPrograms.consults = result.tip1.programs;
                                module["consults"] = result.tip1.programs;
                            }

                            if (result["tip2"] === undefined) {
                                $scope.cruds = [];                            
                                MenuPrograms.cruds = [];
                                module["cruds"] = [];
                            } else {
                                $scope.cruds = result.tip2.programs;                            
                                MenuPrograms.cruds    = result.tip2.programs;
                                module["cruds"]    = result.tip2.programs;
                            }

                            $scope.selectTipProgram($scope.selectedTipProgram);                    
                            ConfigManager.saveConfig('lastSelectedMenuItem', 'framework.menu', 'Último item do menu selecionado pelo usuário.', application.codGroupAplicat + "|" + module.moduleId, function(result) {if(callback!==undefined)callback()});
                        }
                    );                    			
                }
            }
            
            $scope.menuFiltered = false;
            $rootScope.selectedMenuGroup = $rootScope.menuGroups.APPLICATIONS;
        };

        $scope.callDIWhenInitMenu = function() {
            var sessionID = Properties.getProperty(Properties.USER,'sessionID');
            ExecuteProgram.sendLicenseData(sessionID, function() {
                ExecuteProgram.returnParamsLocalExecute(sessionID, $scope.configsOptions.defaultShortcut.shortcut.description, function(result) {
                    if (result.path !== '') executeDesktopLauncher(result.path);
                });                
            });
        }

        $scope.removeFavorite = function (program) {            
            $rootScope.clickFavorite(program);
        }

        $scope.grpAplicatClick = function(application) {

            if ($scope.selectedGrpAplicat == application){
                $scope.selectedGrpAplicat = null;
            } else {
                $scope.selectedGrpAplicat = application;
            }

            var menuOption = {tip: 'grpApplication', value: $scope.selectedGrpAplicat};
            $rootScope.$broadcast('menuOptionChange', menuOption);
        }

        $scope.onSelectMenuItem = function (program) {
            
            $scope.selectedMenuItem = program;
            
            MenuSettings.setSetting("selectedMenuItem", program);
        }

        $scope.openMenuProgram = function (program) {
            MenuPrograms.getProgramById(program.prg, function(result) {
                var menuProgram = result.program;
                var menuOption = {tip: 'selectedProgram', value: menuProgram};
                $rootScope.$broadcast('menuOptionChange', menuOption);

                if (menuProgram.typ == 'W') { /* Abrir programas Web */
                    if (menuProgram.idiTemplate == 33
                        || menuProgram.idiTemplate == 34) {
                        if (menuProgram.idiTemplate == 33) { //Programa HTML
                            $location.url("/" + menuProgram.url);
                        } else {
                        	$rootScope.callExternalProgram(menuProgram.prg, "W");
                        } 
                    } else {
                        $rootScope.callExternalProgram(menuProgram.prg, "W");
                    }
                } else if (menuProgram.typ == 'P') { /* Abrir Programas Progress */
                    /* Os recentes dos tipos W e F serão adicionados no evento stateChangeSuccess */
                    var userId = Properties.getProperty(Properties.USER,'userCode');                
                    RecentsPrograms.addRecent(userId, program);
                    $rootScope.openProgramProgress(menuProgram.url, menuProgram.prg);
                } else { /* Abrir Programas Flex */
                    $rootScope.callExternalProgram(menuProgram.prg, "F");
                }
            });
        };
		
        $rootScope.openProgramProgress = function (programUrl, programPrg) {
            $rootScope.openProgramProgress(programUrl, "", programPrg);
        }

        $rootScope.openProgramProgress = function (programUrl, params, programPrg) {
            var sessionID = Properties.getProperty(Properties.USER,'sessionID');
            
            $scope.configs = Properties.getProperty(Properties.ACCESS_PREFERENCES);
            
            if ($scope.configs.useRemoteShortcut !== undefined) {
                
                if ($scope.configs.useRemoteShortcut == false) {
                    
                    if ($scope.configs.defaultShortcut !== undefined) {
                        $scope.executeProgress(sessionID,
                                               programUrl,
					                           params,
                                               programPrg);                        
                    } else {
                        $scope.callConfigAccessPreferencesAndExecProgram(sessionID,
                                                                         programUrl,
                                                                         programPrg);
                    }
                } else { /* Remoto */
                    
                    if ($scope.configs.remoteConnectionType.toLowerCase() == "smartclient") {
                        $rootScope.callExternalProgram(programPrg, "P");                        
                    } else {
                        $scope.executeProgress(sessionID,
                                               programUrl,
					                           params,
                                               programPrg);   
                    }                    
                }                
            } else {
                $scope.callConfigAccessPreferencesAndExecProgram(sessionID,
                                                                 programUrl,
                                                                 programPrg);   
            }
        }
        
        $scope.callConfigAccessPreferencesAndExecProgram = function (sessionID, programUrl, programPrg) {
            $scope.configAccessPreferences(function() {
                ConfigManager.getConfig("menu.shortcut.progress", "datasul.framework.index", function(result) {
                    if ($scope.configs.defaultShortcut !== undefined) {
                        if (result.desValConfigur !== undefined) {
                            $scope.executeProgress(sessionID,
                                                   programUrl,
                                                   programPrg);
                        }
                    }
                });
            });
        }
        
        $scope.configAccessPreferences = function(callback) {
            /* Se não houver atalho de execução progress já configurada para o usuário, deve abrir a tela de preferências de acesso ao usuário  */
            var accessPrefWindow = ModalWindow.openWindow('html/menu/accessPreferences.html', {
                controller: 'AccessPreferencesCtrl',
                backdrop: 'static'                        
            });

            accessPrefWindow.result.then(function() {}, function() {})['finally'](function(){
                callback();
            });   
        }
		
		
		$scope.executeProgress = function(sessionId, url, prg) {
			$scope.executeProgress(sessionId, 
						           url,
						           "",
						           prg);		
		}
        
        $scope.executeProgress = function(sessionId, url, params, prg) {
            ExecuteProgram.execProgress(sessionId,
                                        url,
					                    params,
                                        prg,
                                        function (result) {

				/* Os programas abaixo realizam a troca da senha do usuário e
				   por isso o pulse será acelerado para que o menu html seja
				   informado de que a senha do usuário foi alterada */
				if (url.indexOf('men903ze') > 0 ||
				    url.indexOf('wmen903ze') > 0 ||
				    url.indexOf('sec000aa') > 0) {
				    $rootScope.acceleratePulse = true;
			    }
				
                /* Quando está bloqueada é porque está inicializando e ainda não está habilitada */
                if (result.sessionEnabled == 'false' && result.sessionBlocked == 'false') {
                    $rootScope.openDI();
                }
            });
        }
        
        $rootScope.openDI = function () {
        
            var configs = Properties.getProperty(Properties.ACCESS_PREFERENCES);
            
            if (configs.useRemoteShortcut == true) {
            
                /* Execução de abertura do DI remotamente */
                ExecuteProgram.returnParamsRemoteExecute(Properties.getProperty(Properties.USER, 'sessionID'),
                                                         function (result) {
              
                    if (result.remoteConnectionType == 'terminalserver')   {

                        var params = {loginName:result.loginName,
                                      password:result.password,
                                      frwkPassword:result.frwkpassword,
                                      domain:result.domain,
                                      path:result.path,
                                      webServerPort:result.webServerPort,
                                      remoteServer:result.remoteServer,
                                      remoteServerPort:result.remoteServerPort,
                                      sessionID:result.sessionID,
                                      serviceContext:result.serviceContext,
                                      userExternal:result.userExternal,
                                      ipAddress:result.ipAddress,
                                      serverName:result.serverName,
                                      hostName:result.hostName};

                        Object.toparams = function ObjecttoParams(obj) {
                            var p = [];
                            for (var key in obj) {
                                p.push(key + '=' + obj[key]);
                            }
                            return p.join('&');
                        };

                        $http({
                            method: 'POST',
                            url: '/menu-html/remote',
                            data: Object.toparams(params),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (data, status) {
                            if (BrowserUtil.BROWSER_NAME === BrowserUtil.IE && BrowserUtil.BROWSER_VERSION === BrowserUtil.IE9) {
                                data = encodeURIComponent(data);
                                window.location = 'resources/execProgram/downloadRDP?content='+data;
                            } else {
                                ServiceDownloadFile.download("datasul.rdp", "application/rdp", data);
                            }
                        });
                        
                    } else {
                        
                        invokeGoGlobal(result.loginName, 
                                       result.fndUser, 
                                       result.password, 
                                       result.frwkpassword, 
                                       result.domain, 
                                       result.path, 
                                       result.webServerPort, 
                                       result.remoteServer, 
                                       result.remoteServerPort,
                                       result.sessionID, 
                                       result.serviceContext, 
                                       result.userExternal, 
                                       result.remoteConnectionType, 
                                       result.metaframeServer, 
                                       result.metaframeServerLibURL, 
                                       result.contextRootUrl,
                                       result.urlASPHttpServer, 
                                       result.metaframeServerId);
                    }                                
                });
                
            } else {                
                if ($scope.configs.defaultShortcut === undefined) {
                    $scope.configAccessPreferences(function() {
                        if ($scope.configs.defaultShortcut !== undefined) {
                            $scope.execDI();
                        }
                    });
                } else {
                    $scope.execDI();
                }
            }
        }
        
        $scope.execDI = function() {
            //Execução de abertura do DI localmente.
            ExecuteProgram.returnParamsLocalExecute(Properties.getProperty(Properties.USER,'sessionID'), $scope.configs.defaultShortcut.shortcut.description, function(result){
                if (result.path !== '') executeDesktopLauncher(result.path);
            });   
        }
        
        $scope.jqueryScrollbarOptions = {
            type: 'simple'
        };


		//Habilita o menu lateral para dispositivos móveis.
		require(['sidebar-effects'], function (SidebarEffects) {
            SidebarEffects();
		});
    }]);
    
});