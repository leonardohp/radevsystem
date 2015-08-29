define(['index'], function (index) {
    'use strict';
    
    index.register.controller('AccessPreferencesCtrl', ['$scope', '$modal', '$modalInstance', 'ConfigManager', function ($scope, $modal, $modalInstance, ConfigManager) {
        $scope.configs = Properties.getProperty(Properties.ACCESS_PREFERENCES);
        $scope.shortcuts = $scope.configs.shortcuts;
        $scope.defaultShortcut = $scope.configs.defaultShortcut;
        
        $scope.form = {
            selectedShortcut: null,
            accessType: null,
            remoteServer: null,
            remoteServerPort: null,
            webServerPort: null,
            remoteShortcut: null,
            preLoadProgress: null,
            smartClientServer: null,
            smartClientServerPort: null
        };
        
        $scope.selectedShortcut;

        if ($scope.defaultShortcut !== undefined && $scope.defaultShortcut !== null) {
            for (var i = 0; i < $scope.shortcuts.length; i++) {
                var sc = $scope.shortcuts[i];
                if (sc.shortcut.description==$scope.defaultShortcut.shortcut.description) {
                    $scope.form.selectedShortcut = sc;
                    break;
                }
            }
        } else {
            if ($scope.shortcuts.length > 0) {
                $scope.defaultShortcut = $scope.shortcuts[0];
                $scope.form.selectedShortcut = $scope.shortcuts[0];
            }
        }
        
        $scope.form.accessType = ($scope.configs.useRemoteShortcut)?"remote":"local";
        $scope.disablePreload = $scope.form.accessType=="remote";
        $scope.form.remoteServer = $scope.configs.remoteServer;
        $scope.form.remoteServerPort = $scope.configs.remoteServerPort;        
        $scope.form.webServerPort = $scope.configs.webServerPort;
        $scope.form.remoteShortcut = $scope.configs.remoteShortcut;
        $scope.form.preLoadProgress = ($scope.configs.preLoadProgress=="true");
        $scope.form.smartClientServer = $scope.configs.smartClientServer;
        $scope.form.smartClientServerPort = $scope.configs.smartClientServerPort;        

        $scope.accessTypeChange = function () {
            if ($scope.form.accessType=="local") {
                $scope.disablePreload = false;
            } else {
                $scope.disablePreload = true;
                $scope.form.preLoadProgress = false;
            }
        }
        
        $scope.save = function () {
            
            var userCode = Properties.getProperty(Properties.USER, "userCode");
            var serverIp = Properties.getProperty(Properties.ACCESS_PREFERENCES, 'serverName').split(':')[0];
            var serverPort = Properties.getProperty(Properties.ACCESS_PREFERENCES, 'port');
            var info = serverIp + "-" + serverPort + "-datasul-" + userCode;
            
            if ($scope.form.accessType=="local") {
                if ($scope.form.selectedShortcut !== undefined && $scope.form.selectedShortcut !== null) {
                    ConfigManager.saveConfig("menu.shortcut.progress", "datasul.framework.index", '', $scope.form.selectedShortcut.shortcut.description.trim(), function () {});
                    info += "|" + $scope.form.selectedShortcut.shortcut.description + "|" + "false";
                    ConfigManager.saveConfig("shortcut.info", "datasul.framework.shortcut", "Informações do atalho de execução selecionado pelo usuário", info, function () {});
                }                
            } else {
                if ($scope.form.remoteShortcut !== undefined && $scope.form.remoteShortcut !== null) {
                    ConfigManager.saveConfig("menu.shortcut.progress", "datasul.framework.index", '', $scope.form.remoteShortcut.description, function () {});
                    info += "|" + $scope.form.remoteShortcut.description + "|" + "true";    
                    ConfigManager.saveConfig("shortcut.info", "datasul.framework.shortcut", "Informações do atalho de execução selecionado pelo usuário", info, function () {});
                }                
            }            
            ConfigManager.saveConfig("menu.remoteAccess.progress", "datasul.framework.index", '', ($scope.form.accessType!="local").toString(), function () {});
            ConfigManager.saveConfig("menu.preload.progress", "datasul.framework.index", '', $scope.form.preLoadProgress.toString(), function () {});
            $scope.configs.defaultShortcut = $scope.form.selectedShortcut;
            $scope.configs.preLoadProgress = $scope.form.preLoadProgress.toString();
            $scope.configs.useRemoteShortcut = ($scope.form.accessType=="remote");            
            Properties.addProperty(Properties.ACCESS_PREFERENCES, "configs", $scope.configs);            
            $scope.close();
        }
        
        $scope.close = function () {
            $modalInstance.close();            
        };
    }]);
    
});