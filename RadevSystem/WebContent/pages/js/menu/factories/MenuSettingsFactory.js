define(['index'], function (index) {
    'use strict';

    index.register.factory('MenuSettings', ['$rootScope', function ($rootScope) {
        var factory = {
            data: {
                userCode: null,
                userName: null,
                userDomain: null,
                dialect: null,
                isUserExternal: null,
                userCompany: null,
                sessionTimeout: null,
                ambientType: null,
                environment: null,
                selectedTipProgram: 4,
                selectedMenuItem: [],
                recentPrograms: []
            },

            setSetting: function (attrName, attrValue) {
                this.data[attrName] = attrValue;
            },

            getSetting: function (attrName) {
                return this.data[attrName];
            }
        };
        
        $rootScope.$on('PropertiesLoaded', function () {
            factory.data.userCode = Properties.getProperty(Properties.USER, 'userCode');
            factory.data.userName = Properties.getProperty(Properties.USER, 'userName');
            factory.data.userDomain = Properties.getProperty(Properties.USER, 'userDomain');
            factory.data.dialect = Properties.getProperty(Properties.USER, 'dialect');
            factory.data.isUserExternal = Properties.getProperty(Properties.USER, 'isUserExternal');
            factory.data.userCompany = Properties.getProperty(Properties.USER, 'userCompany');
            factory.data.sessionTimeout = Properties.getProperty(Properties.LICENSE, 'sessionTimeout');
            factory.data.ambientType = Properties.getProperty(Properties.PROPERTIES, "license.ambient.type");
            factory.data.environment = Properties.getProperty(Properties.ACCESS_PREFERENCES, "environment");
        });
        
        return factory;
    }]);
    
});