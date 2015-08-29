define(['index'], function (index) {
    'use strict';

    index.register.service('sessionContext', ['$rootScope', '$filter', 'messageHolder', function ($rootScope, $filter, messageHolder) {
        return {
            user: {},
            alreadyStarted: false,
            browserDialect: getBrowserDialect(),

            init: function () {
                /*
                var _self = this;
                _self.user = sessionContextFactory.get();
                _self.user.$then(function(response) {
                    _self.alreadyStarted = true;
                    $rootScope.dialect = _self.user.dialect;
                    $rootScope.$broadcast(Event.rootScopeInitialize);
                });*/
            },
            
            i18n: function (sentence) {
                return $filter('i18n')(sentence);
            },
            
            formatDate: function (dateToFormat, customFormat) {
                return $filter('dateFormat')(dateToFormat, customFormat);
            },

            notify: function (type, title, detail) {
                messageHolder.showNotify({
                    type: type,
                    title: title,
                    detail: detail
                });
            }
        };
    }]);

});