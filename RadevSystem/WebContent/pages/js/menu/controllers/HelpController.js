define(['index'], function (index) {
    'use strict';
    
    index.register.controller('HelpCtrl', ['$rootScope', '$scope','$window','$modalInstance','$filter','totvs.app-main-view.Service','MenuApplications','MenuPrograms','ModalWindow','messageHolder', function($rootScope, $scope, $window, $modalInstance, $filter, appViewService, MenuApplications, MenuPrograms, ModalWindow, messageHolder) {
        
		var i18n = $filter('i18n');
        var HELP_URL = "http://www.totvs.com/mktfiles/tdiportais/helponlinedatasul/";            
		
        $scope.grpApplications = MenuApplications.getApplications();
		
		$scope.getCurrentView = function () {
            return appViewService.getPageActive();
        }
        
        $scope.checkInternetAccess = function(success, fail) {
            var checkUrl = HELP_URL + "scripts/images/logo.gif";
            var img = document.createElement("img");
            img.id = "tstImg";
            img.src = checkUrl;
            document.body.appendChild(img);
            
            document.getElementById("tstImg").onload = function() {
                $("#tstImg").remove();
                success();                
            }
            
            document.getElementById("tstImg").onerror = function() {
                $("#tstImg").remove();
                fail();
            }
        }
		
		var alerts = {type: '',
                      title:'',
                      detail: ''};
		
		$scope.openHelpCurrent = function () {
            var view = $scope.getCurrentView();
            var programUrl = view.url;
            if (view.name === appViewService.HOME) {
                $scope.callHelpUrl(appViewService.HOME, 'fnd');
            } else {
                
                if (programUrl.indexOf("external") >= 0) {
                    var programId = "";
                    if (programUrl.indexOf("datasul") >= 0) {
                        programId = programUrl.split("datasul/")[1];
                        programId = programId.replace(/\//g, ".");
                        programId = programId.replace(/\+/g, "_");
                        
                    } else {
                        programId = programUrl.split("external/")[1];                        
                    }
                    MenuPrograms.findFunctionalityById(programId, function(result) {
                        MenuPrograms.getProgramById(programId, function(result) {
                            var mod = result.program.mod.replace(".swf", "").toLowerCase();
                            $scope.callHelpUrl(programId, mod);    
                        });                                             
                    });
                }   
            }
        }
                                                                       
        $scope.callHelpUrl = function(programId, moduleId) {
            var userProps = Properties.getProperty(Properties.USER);
            MenuApplications.getApplicationByModule(moduleId, function(result) {
                var grpApp = result.grpApplication;
				var helpUrl = HELP_URL;
				if (grpApp.toLowerCase() == "sau") {
                    helpUrl += "portal_gp/";
                } else {
                    helpUrl += "scripts/open.html?i=" + userProps.dialect;
                    if (programId == appViewService.HOME) {
                        helpUrl += "&m=fnd";
                    } else {
                        if (programId == 'homepage') {
                            programId = "f_area_trabalho";                    
                        } else {
                            programId = programId.substring(programId.lastIndexOf(".") + 1, programId.length);
                        }
                        helpUrl += "&m=" + moduleId + "&p=all/" + programId;
                    }
                }
                
                $scope.checkInternetAccess(function() {
                    //Success - Internet Access
                    $window.open(helpUrl);    
                }, function() {
                    //Fail - Internet Access
                    if (!window.location.origin) {
                        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                    }
                    helpUrl = window.location.origin + "/datasul/help/offline/" + userProps.dialect + "/nocon.html";
                    $window.open(helpUrl);                    
                });
            });                                
        }
				
		$scope.openUrlHelp = function (grpApplication, module) {
            var userProps = Properties.getProperty(Properties.USER);
            
            var helpUrl = HELP_URL;
            if (grpApplication.codGroupAplicat.toLowerCase() == "sau") {
                helpUrl += "portal_gp/";
            } else {
                helpUrl += "scripts/open.html?i=" + userProps.dialect;
                helpUrl += "&m=" + module.moduleId.toLowerCase();
            }
            $window.open(helpUrl);            
        }
        
        $scope.checkURL = function (url, callBack) {
            var request = new XMLHttpRequest;
            request.open('GET', url, false);
            request.onreadystatechange = function (){
                callBack(request.status==200);
            }
            request.send();
        }

        $scope.openAbout = function () {
            $scope.close();
           ModalWindow.openLargeWindow("html/menu/about.html", {	   
		   controller: 'SysInfoCtrl'
		   });  
		}
        
        $scope.openSysInfo = function () {
            $scope.close();
            ModalWindow.openLargeWindow("html/menu/sysinfo.html",{
                controller: 'SysInfoCtrl',
				size: 'lg',
        	});
		}	
		
        $scope.openProgramEMS2 = function () {
            $rootScope.openProgramProgress("btb/btb901zg.w", "btb901");
        }
        
        $scope.openProgramEMS5 = function () {
            $rootScope.openProgramProgress("prgtec/btb/btb901zg.p", "btb901zg");
        }
        $scope.openProgramEMS = function () {
            $rootScope.openProgramProgress("prohelp/_msgs.p", "_msgs");
        }
        
        $scope.openProgramTraceDebug = function () {
            $rootScope.openProgramProgress("men/men903zi.p", "men903zi");
        }    
                
        $scope.openProgramExtractVersion = function () {
            $rootScope.openProgramProgress("men/men903zf.p", "men903zf");
        }
        
        $scope.openProgramProfiler = function () {
            $rootScope.openProgramProgress("utp/ut-prof.w", "ut-prof");
        }
		
		$scope.close = function () {
            $modalInstance.close();            
        };

    }]);
    
});