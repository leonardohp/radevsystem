define(['index'], function (index) {
    'use strict';
    
    index.register.controller('MessageHistoryCtrl', ['$scope', '$modalInstance', 'messageHolder', 'menuNotifications', function ($scope, $modalInstance, messageHolder, menuNotifications) {
        $scope.total = menuNotifications.length;
        
        var getClass = function(type) {
            var className = '';
            
            switch (type) {
                case messageHolder.SUCCESS:
                    className = 'bg-success';
                    break;
                case messageHolder.INFO:
                    className = 'bg-info';
                    break;
                case messageHolder.ERROR:
                    className = 'bg-danger';
                    break;
                case messageHolder.WARNING:
                    className = 'bg-warning';
                    break;
            }
            
            return className;
        };
        
        var setCurrent = function (current) {
            $scope.current = current;
            if ($scope.total > 0) {
                $scope.notification = menuNotifications[$scope.current-1];
                $scope.notification.className = getClass($scope.notification.type);
            } else {
                $scope.current = 0;
            }
        };
        
        $scope.previous = function () {
            if ($scope.current - 1 > 0)
                setCurrent(--$scope.current, false);
        };
        
        $scope.next = function () {
            if ($scope.current + 1 <= $scope.total)
                setCurrent(++$scope.current, true);
        };
        
        $scope.close = function () {
            $modalInstance.close();
        };
        
        setCurrent(1);
    }]);

});