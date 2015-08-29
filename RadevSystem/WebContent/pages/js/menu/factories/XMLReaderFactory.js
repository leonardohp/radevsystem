define(['index'], function (index) {
    'use strict';
    
    index.register.factory('XMLReader', ['$http', function ($http) {
        return {
            getSysinfoXML: function() {
                return $http.get("revision.xml");
            }
        };
    }]);
    
});