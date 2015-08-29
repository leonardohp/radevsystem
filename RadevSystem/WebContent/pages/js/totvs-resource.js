/**
 * @license AngularJS v1.3.0-beta.17
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

    angular.module('TOTVSResource', ['ng']).provider('$totvsresource', function () {

		this.$get = ['$resource', function ($resource) {
			
			this.services = {};
			
			this.services.REST = function(URL, OPTIONS, ACTIONS) {
				
				if (angular.isUndefined(ACTIONS)) {
					ACTIONS = {};
				}
				
				ACTIONS.update = {
					method: 'PUT',
					isArray: false
				};
				
				var TOTVSFactory = $resource(URL, OPTIONS, ACTIONS);
				
				TOTVSFactory.TOTVSGet = function(parameters, callback) {
					var call = this.get(parameters);
					TOTVSFactory.processPromise(call, callback);
				}
				
				TOTVSFactory.TOTVSQuery = function (parameters, callback) {
					var call = this.query(parameters);
					TOTVSFactory.processPromise(call, callback);
				};
				
				TOTVSFactory.TOTVSSave = function (parameters, model, callback) {
					var call = this.save(parameters, model);
					TOTVSFactory.processPromise(call, callback);
				};
				
				TOTVSFactory.TOTVSUpdate = function (parameters, model, callback) {
					var call = this.update(parameters, model);
					TOTVSFactory.processPromise(call, callback);
				};
				
				TOTVSFactory.TOTVSRemove = function (parameters, callback) {
					var call = this.remove(parameters);
					TOTVSFactory.processPromise(call, callback);
				};
				
				TOTVSFactory.processPromise = function(call, callback) {
					call.$promise.then(function (result) {
						if (callback) {
							if (result && result.hasOwnProperty('data')) {
								callback(result.data);
							} else {
								callback(result);
							}
						}
					});
				};
				
				
				return TOTVSFactory;
			};
			
			return this.services;
		}];
		
	});

})(window, window.angular);