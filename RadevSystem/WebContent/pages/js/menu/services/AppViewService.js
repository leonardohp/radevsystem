define(['index'], function (index) {
    'use strict';
    
    // Este serviço está responsável por manter um controle sobre as views
	// abertas além de controlar os arquivos de traduções requisitados por cada 
	// contexto. 
    index.register.service('totvs.app-main-view.Service', ['$rootScope', '$location', '$stateParams', '$q', 'MenuPrograms', 'MenuFavorite', 'License', function ($rootScope, $location, $stateParams, $q, MenuPrograms, MenuFavorite, License) {
        var service = {
			HOME: 'home',
			// Mantém uma lista de views abertas.
			openViews: [],
			
			// Mantém uma lista de views favoritadas, pode ser retornado diretamente 
			// de um serviço.
			favoriteViews: [],
			
			// Registrar a view no serviço de controle de views para da App.
			// Está função deverá ser chamada pelo controller de cada view para se
			// auto-registrar na aplicação.
			startView: function (name, controllerName, controller) {
                
                var viewFound = false,
                    returnValue = false;
				
                for (var i = 0, len = service.openViews.length; i < len; i++) {
					
					service.openViews[i].active = false;
					
					if (service.openViews[i].name == name) {
						service.openViews[i].url = $location.url();
						service.openViews[i].controllerName = controllerName;
						service.openViews[i].controller = controller;
						service.openViews[i].active = true;
						
						if (controller && service.openViews[i].context) {
							angular.forEach(service.openViews[i].context, 
											function (value, key) {
								controller[key] = value;
							});
							
							returnValue = false;
						}
						
						viewFound = true;
					}
				}
				
				if (!viewFound) {
                    service.openViews.push({
                        name: name,
                        active: true,
                        url: (name == this.HOME) ? '/' : $location.url(),
                        controller: controller,
                        controllerName: controllerName,
                        stateParams: angular.copy($stateParams)
                    });
                    
                    var url = $location.url();
                    
                    /**
                     * Consumo de Licenças                     
                     */
                    if (name !== this.HOME) {
                        if (url.indexOf("external") >= 0) { //Programas Flex ou Portais HTML
                            if (url.indexOf("datasul") < 0 && url.indexOf("webspeed") < 0) { //Somente portais HTML devem consumir licenças pelo menu html. Os programas Flex consomem licença pelo framework Flex, já os programas WebSpeed não consumirão licenças.
                                var nomProgExt = url.split("external/")[1];
                                MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(program) {
                                var programId = program.programId;
                                    if (programId !== undefined) {
                                        MenuPrograms.findFunctionalityById(programId, function(func) {
                                            var mod = func.program.mod.replace(".swf", "").toUpperCase();
                                            if (mod !== "FND") {
                                                License.consumeLicense($rootScope.sessionID, mod, name, function(result) {                        
                                                    console.log("LS - ", result);
                                                    if (result.returnConsumeStatus == "NOK") {
                                                        var title = "License Server";
                                                        var message = result.codeErrorConsume;
                                                        var details = result.descErrorConsume;
                                                        messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {});                                                                
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        } else { //Programas HTML
                            var nomProgExt = url;
                            if (nomProgExt.indexOf("/") == 0) {
                                nomProgExt = nomProgExt.substr(1);
                            }
                            if (nomProgExt.lastIndexOf("/") == (nomProgExt.length-1)) {
                                nomProgExt = nomProgExt.substring(0, nomProgExt.length-1);
                            }
                            
                            MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(program) {
                                var programId = program.programId;
                                if (programId !== undefined) {
                                    MenuPrograms.findFunctionalityById(programId, function(func) {
                                        var mod = func.program.mod.replace(".swf", "").toUpperCase();
                                        if (mod !== "FND") {
                                            License.consumeLicense($rootScope.sessionID, mod, name, function(result) {                        
                                                console.log("LS - ", result);
                                                if (result.returnConsumeStatus == "NOK") {
                                                    var title = "License Server";
                                                    var message = result.codeErrorConsume;
                                                    var details = result.descErrorConsume;
                                                    messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {});                                                                
                                                }
                                            });   
                                        }
                                    });
                                }
                            });
                        }
                    }
                    returnValue = true;
                } else {
                    returnValue = false;
                }
				
				service.updated();
                
                //Atualiza o tamanho das abas do menu após a execução de um
                //novo programa.
                if (returnValue) updateTabsSize();
                
                return returnValue;
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
            
            getPageActive: function () {
                //					console.log('getpageactive');
                //					console.log(service.openModules);
                for (var i = 0; i < service.openViews.length; i++) {
                    if (service.openViews[i].active) {
                        //							console.log('achou');
                        return service.openViews[i];
                    }
                }
                //					console.log('nulo');
                return null;
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
                    var url = service.openViews[i].url;
					if (url == view.url) {
                        if (url.indexOf("external") >= 0) { //Programas Flex ou Portais HTML
                            if (url.indexOf("datasul") < 0 && url.indexOf("webspeed") < 0) { //Somente portais HTML devem consumir licenças pelo menu html. Os programas Flex consomem licença pelo framework Flex, já os programas WebSpeed não consumirão licenças.
                                var nomProgExt = url.split("external/")[1];
                                MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(program) {
                                var programId = program.programId;
                                    if (programId !== undefined) {
                                        MenuPrograms.findFunctionalityById(programId, function(func) {
                                            var mod = func.program.mod.replace(".swf", "").toUpperCase();
                                            if (mod !== "FND") {
                                                License.releaseLicense($rootScope.sessionID, mod, view.name, function(result) {                        
                                                    if (result.returnConsumeStatus == "NOK") {                                
                                                        var title = i18n('error-license-server');
                                                        var message = i18n('error-ls-used-msg');
                                                        var details = i18n('error-ls-used-detail');
                                                        messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        } else { //Programas HTML
                            var nomProgExt = service.openViews[i].url;
                            if (nomProgExt.indexOf("/") == 0) {
                                nomProgExt = nomProgExt.substr(1);
                            }
                            if (nomProgExt.lastIndexOf("/") == (nomProgExt.length-1)) {
                                nomProgExt = nomProgExt.substring(0, nomProgExt.length-1);
                            }
                            
                            MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(program) {
                                var programId = program.programId;
                                if (programId !== undefined) {
                                    MenuPrograms.findFunctionalityById(programId, function(func) {
                                        var mod = func.program.mod.replace(".swf", "").toUpperCase();
                                        if (mod !== "FND") {
                                            License.releaseLicense($rootScope.sessionID, mod, view.name, function(result) {                        
                                                if (result.returnConsumeStatus == "NOK") {                                
                                                    var title = i18n('error-license-server');
                                                    var message = i18n('error-ls-used-msg');
                                                    var details = i18n('error-ls-used-detail');
                                                    messageHolder.showMsg(title, message, messageHolder.ERROR, details, function() {});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        
						/*service.openViews.splice(i, 1);
						service.updated();

						if (service.openViews.length < 2) {
							if (service.openViews.length === 1) {
								service.openViews[0].active = true;
							}
							this.startView(this.HOME, undefined, undefined);
						}*/
                        
                        service.openViews.splice(i, 1);
                        service.updated();
                        i--;
                        if (service.openViews.length === 1) {
                            $location.url('/');
                        } else {
                            if (service.openViews[i+1] !== undefined) {
                                $location.url(service.openViews[i+1].url);
                            } else {
                                $location.url(service.openViews[i].url);
                            }
                        }
                        
						break;
					}
				}
                
                //Atualiza o tamanho das abas do menu após o encerramento de um
                //programa.
                updateTabsSize();
			},
			
			isFavoriteView: function (viewURL) {
                var isFavorite = $q.defer(),
                    nomProgExt = viewURL,
                    pathProgram;
                
                if (nomProgExt.indexOf("/") >= 0 && nomProgExt.indexOf("/") < 2) {
                    if (nomProgExt.indexOf("/") == 0) {
                        nomProgExt = nomProgExt.substr(1);
                    } else {
                        nomProgExt = nomProgExt.substr(2);
                    }                    
                } 
                
                if ((pathProgram = nomProgExt.split('/')).length > 1) {
                    pathProgram = nomProgExt.split('/');
                    nomProgExt = pathProgram[0] + '/' + pathProgram[1];
                }
                
                if (nomProgExt.lastIndexOf("/") == (nomProgExt.length-1)) {
                    nomProgExt = nomProgExt.substring(0, nomProgExt.length-1);
                } else if (nomProgExt.indexOf('?') > -1) {
                    nomProgExt = nomProgExt.substr(0, nomProgExt.indexOf('?') - 1);
                }
                
                if (!(nomProgExt === "loading")) {                    
                    MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(program) {
                        var userId = Properties.getProperty(Properties.USER, 'userCode');                                
                        var programId = program.programId;
                        MenuFavorite.isFuncFavorite(userId, programId, function(result) {
                            isFavorite.resolve(result.isFavorite);
                        });
                    });
                } else {
                    isFavorite.resolve(false);   
                }
                return isFavorite.promise;
			},
			
			markAsFavorite: function(viewURL) {
                var isFavorite = $q.defer(),
                    nomProgExt = viewURL,
                    pathProgram;
                
                if (nomProgExt.indexOf("/") >= 0 && nomProgExt.indexOf("/") < 2) {
                    if (nomProgExt.indexOf("/") == 0) {
                        nomProgExt = nomProgExt.substr(1);
                    } else {
                        nomProgExt = nomProgExt.substr(2);
                    }
                } 
                
                if ((pathProgram = nomProgExt.split('/')).length > 1) {
                    pathProgram = nomProgExt.split('/');
                    nomProgExt = pathProgram[0] + '/' + pathProgram[1];
                }
                
                if (nomProgExt.lastIndexOf("/") == (nomProgExt.length-1)) {
                    nomProgExt = nomProgExt.substring(0, nomProgExt.length-1);
                } else if (nomProgExt.indexOf('?') > -1) {
                    nomProgExt = nomProgExt.substr(0, nomProgExt.indexOf('?') - 1);
                }

                MenuPrograms.findProgramIdByNomProgExt(nomProgExt, function(program) {
                    var programId = program.programId;
                    if (programId !== undefined) {
                        MenuPrograms.findFunctionalityById(programId, function(result) {
                            if (result.program.isFunctionality) {
                                var progFav = result.program.fav;
                                $rootScope.clickFavorite(result.program, true);
                                isFavorite.resolve(!progFav);
                            } else {
                                isFavorite.resolve(false);
                            }                            
                        });
                    } else {
                        isFavorite.resolve(false);
                    }
                });                
                return isFavorite.promise;
			}
		};
        
        //Ajusta o tamanho das abas do menu. Este ajuste está
        //sendo realizado aqui, pois não foi possível fazê-lo diretamente
        //com CSS. O tamanho das abas serão controladas da mesma forma que
        //o Google Chrome, iniciarão com o tamanho padrão, porém se não
        //houver mais espaço, as abas serão até o ponto em que apenas o
        //botão de fechar fique visível.
        var updateTabsSize = function () {
            setTimeout(function () {
                var btnWidth = 200,
                    menuTabsButtons = null,
                    buttonsWidth = 0,
                    tabWidth = document.getElementById('menu-tabs').parentElement.clientWidth - document.getElementById('menu-options').clientWidth - 45;

                //Calcula a largura total dos botões, considerando a largura
                //máxima de 200 pixels e o botão de HOME.
                menuTabsButtons = document.querySelectorAll('#menu-tabs>.btn');
                buttonsWidth = (btnWidth * (menuTabsButtons.length - 1));

                for (var i = 0, len = menuTabsButtons.length; i < len; i++) {
                    var width = null;
                    
                    if (i > 0) {
                        if (buttonsWidth > tabWidth) {
                            menuTabsButtons[i].style.width = (width = width || (tabWidth / (len - 1))) + 'px';
                        } else {
                            menuTabsButtons[i].style.width = btnWidth + 'px';
                        }
                    }
                }
            }, 400);
        };
        
		return service;
	}]);
    
});