define(['index'], function (index) {
    'use strict';
    
    index.register.controller('LicenseErrorCtrl', ['$rootScope', '$scope', '$modalInstance', 'ServDoLogout', 'options', function ($rootScope, $scope, $modalInstance, ServDoLogout, options) {    
        
        $scope.message = options.msg + ' (' + options.code + ')';
        $scope.close = ServDoLogout.logout;
    }]);
    
});