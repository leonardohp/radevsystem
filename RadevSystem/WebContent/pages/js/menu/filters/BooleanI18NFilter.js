define(['index'], function (index) {
    'use strict';

    index.register.filter('booleanI18N', ['sessionContext', function (sessionContext) {
        return function (sentence, param) {
            if (sentence) {
                return sessionContext.i18n('l-yes');
            } else {
                return sessionContext.i18n('l-no');
            }
        };
    }]);
    
});