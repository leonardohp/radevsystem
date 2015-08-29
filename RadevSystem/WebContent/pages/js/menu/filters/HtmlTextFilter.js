define(['index'], function (index) {
    'use strict';
    
    index.register.filter('htmlText', [ function () {
        return function (sentence) {
            return $("<div>").html(sentence).text();
        };
    }]);
    
});