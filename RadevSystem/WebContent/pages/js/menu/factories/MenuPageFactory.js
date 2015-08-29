define(['index'], function (index) {
    'use strict';

    index.register.factory('MenuPage', ['$rootScope', 'MenuSettings', function factoryPage($rootScope, MenuSettings) {
        return {
            title: 'TOTVS Série ' + Properties.getProperty(Properties.LICENSE, "segmentCode") + ' ' + Properties.getProperty(Properties.LICENSE, "segmentDesc") + ' (Datasul) 06.' + Properties.getProperty(Properties.LICENSE, "segmentCode"),

            setTitle: function(newTitle) {
                this.title = newTitle;
            }
        };
    }]);

});