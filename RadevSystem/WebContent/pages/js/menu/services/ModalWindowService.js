define(['index'], function (index) {
    'use strict';

    index.register.service('ModalWindow',['$rootScope','$modal',function ($rootScope, $modal) {
        this.LARGE_WINDOW = 'lg';
        this.SMALL_WINDOW = 'sm';
        
        this.openWindow = function (url, options) {
            
            if ($rootScope.openedModalWindows === undefined) {
                $rootScope.openedModalWindows = [];
            }
            
            for (var i = 0; i < $rootScope.openedModalWindows.length; i++) {
                if ($rootScope.openedModalWindows[i] == url) {
                    return;
                }
            }
            
            if (!options) options = {};
            if (options['backdrop'] === undefined) options['backdrop'] = true;
            if (options['keyboard'] === undefined) options['keyboard'] = true;

            var window = null;
            
            window = $modal.open({
                templateUrl: url,
                controller: options['controller'],
                resolve: {
                    options: function () {
                        return options;
                    }
                },
                size: options['size'],
                backdrop: options['backdrop'],
                keyboard: options['keyboard']
            });
            
            $rootScope.openedModalWindows.push(url);            
                        
            window.result.then(function() {}, function() {})['finally'](function(){
                var index = 0;
                for (var i = 0; i < $rootScope.openedModalWindows.length; i++) {
                    if ($rootScope.openedModalWindows[i] == url) {
                        index = i;
                        break;
                    }
                }
                $rootScope.openedModalWindows.splice(index, 1);                
            });            
            
            return window;
        };
        
        this.openLargeWindow = function (url, options) {
            if (!options) options = {};
            options['size'] = this.LARGE_WINDOW;
            
            return this.openWindow(url, options);
        };

        this.openSmallWindow = function (url, options) {
            if (!options) options = {};
            options['size'] = this.SMALL_WINDOW;
            
            return this.openWindow(url, options);
        };
    }]);

});