define(['index'], function (index) {
    'use strict';

    index.register.filter('capitalAll', [ function () {
        return function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
    }]);
    
});