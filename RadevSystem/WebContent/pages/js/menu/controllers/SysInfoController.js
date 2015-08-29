define(['index'], function (index) {
    'use strict';
    
    index.register.controller('SysInfoCtrl', ['$scope','$modalInstance','$http', '$filter', '$window', 'ServiceDownloadFile' , function ($scope, $modalInstance, $http, $filter, $window, ServiceDownloadFile) {
        var i18n = $filter('i18n'),
            sysInfo = Properties.getProperty(Properties.SYSINFO),
            productName = sysInfo.productName.substring(0,2) !== '${' ? sysInfo.productName : 'N/A',
            productVersion = sysInfo.productVersion.substring(0,2) !== '${' ? sysInfo.productVersion : 'N/A',
            dbType = sysInfo.dbType.substring(0,2) !== '${' ? sysInfo.dbType : 'N/A',
            webspeedUrl;
        
        if (sysInfo.webspeedUrl !== null && sysInfo.webspeedUrl !== undefined) {
            webspeedUrl = sysInfo.webspeedUrl.substring(0,2) != '${' ?  sysInfo.webspeedUrl : 'N/A';
        } else {
            webspeedUrl = 'N/A';
        }
		
        $scope.osName = BrowserUtil.OS_NAME;
        $scope.browserVersion = BrowserUtil.BROWSER_VERSION;
        $scope.browser = BrowserUtil.BROWSER_NAME;
        
        $scope.productName = productName;
        $scope.productVersion = productVersion;
        $scope.dbType = dbType;
        $scope.webspeedUrl = webspeedUrl;
		
        $scope.copyToClipboard = function() {
            var info = i18n('product')			+": "+ $scope.productName     + "\r\n" +
					   i18n('browser')          +": "+ $scope.browser         + "\r\n" +
                       i18n('browser-version')  +": "+ $scope.browserVersion  + "\r\n" +
                       i18n('product-version')  +": "+ $scope.productVersion  + "\r\n" +
                       i18n('database')      	+": "+ $scope.dbType          + "\r\n" +
                       "WebSpeed: "             +": "+ $scope.webspeedUrl     + "\r\n" ;
            
            ServiceDownloadFile.download('sysinfo.txt','text/plain',info);
        };
		
        $scope.close = $modalInstance.close;
    }]);
    
});