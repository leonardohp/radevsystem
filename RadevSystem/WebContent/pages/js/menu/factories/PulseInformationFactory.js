define(['index'], function (index) {
    'use strict';
    
    index.register.factory('PulseInformation', ['ResourceLoaderService', function (ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/pulse');

        factory.pulseInformation = function(sessionId, isUserInTimeOutSessionGroup, callback) {
            var call = this.save({
                method: 'pulseInformation',
                sessionId: sessionId,
				isUserInTimeOutSessionGroup: isUserInTimeOutSessionGroup,
				noCountRequest: true
            }, {});

            processPromise(call, callback);
        };

        factory.getPulseInformation = function (callback) {
            var call = this.get({ method: 'getPulseInformation', noCountRequest: true }, {});
            processPromise(call, callback);
        };
        
        return factory;
    }]);
    
});