define(['index'], function (index) {
    'use strict';
    
    index.register.controller('AltIndexController', ['$rootScope', '$scope', function ($rootScope, $scope) {
        this.angularApp = true;

        this.hasPendingRequests = function () {
            return ($rootScope.pendingRequests > 0);
        };
    }]);
    
});