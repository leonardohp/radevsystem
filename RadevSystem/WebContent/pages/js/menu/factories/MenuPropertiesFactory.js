define(['index'], function (index) {
    'use strict';

    index.register.factory('MenuProperties', [function () {
        return {
            setProperties: function (data) {
                this.data = data;
            },

            setProperty: function (attrName, attrValue) {
                this.data[attrName] = attrValue
            },

            getProperty: function (attrName) {
                return this.data[attrName];
            }
        };
    }]);

});