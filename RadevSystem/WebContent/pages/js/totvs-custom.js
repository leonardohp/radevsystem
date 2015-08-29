define(['index'], function (index) {

	// ########################################################
	// ### Customization Generic Factories
	// ########################################################

	customFactoryGeneric.$inject = ['$injector','$compile','$rootScope'];

	function customFactoryGeneric($injector, $compile, $rootScope) {
		return {
			receiveEvent: function (service, event, eventparameters, element) {
				if (service && event && service[event]) {
					return service[event](eventparameters, element);
				}				
				return 'ok';
			},
			
            callEvent: function (modulename, event, eventparameters, element) {
                var service;
                
                try {
                    service = $injector.get('custom.' + modulename);
				    if (service) service.receiveEvent(service, event, eventparameters, element);
                } catch (e) {
                    console.debug(e.message);
                }
			},
			
            compileHTML: function (params, html) {
				var scope = $rootScope.$new(true);
				angular.extend(scope, params);
						   
				var el = angular.element(html);
				
				return $compile(el)(scope);
			}
			
		};
	} // customFactoryGeneric() {

	totvsCustomElement.$inject = ['customization.generic.Factory', '$location'];
	function totvsCustomElement(customService, $location) {
		return function(scope, element, attrs) {
			
			var params = {};
			
			angular.forEach(scope, function (value, key) {
				if (key.charAt(0) == '$') return;
				if (key == 'this') return;
				params[key] = value;
			});
			
			var controlerName = attrs.totvsCustomService;
			
			if (!controlerName) {
				var strs = $location.path().split('/');
				controlerName = strs[1] + '.' + strs[2];				
			}

			var eventName = attrs.totvsCustomElement || 'customElement';
			
			customService.callEvent (controlerName, eventName, params, element);
		}
	}
	

	// ########################################################
	// ### Register
	// ########################################################

	// Application Generic Factories
	index.register.factory('customization.generic.Factory', customFactoryGeneric);
	
	index.register.directive('totvsCustomElement', totvsCustomElement);
});