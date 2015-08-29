/* global $, angular, define */

define(['index'], function (index) {

	/* ********************************************************************************* */
	/* *** Layout						   							     	 	 	 	 */
	/* ********************************************************************************* */
	
	index.register.directive('totvsPage', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
			template: '<div class="page-wrapper container-fluid ng-cloak" ng-transclude></div>',
			link: function (scope, element, attrs) { 
				var pageWrapper = $('div.page-wrapper');
				if (pageWrapper && pageWrapper.length > 0) {
					// Verifica se o PerfectScrollbar foi instanciado.
					window.Ps = window.Ps || require('perfect-scrollbar');
					Ps.initialize(pageWrapper[0]);    
				}
			}
        };
    });
		
	index.register.directive('totvsPageChild', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
			template: '<div class="row page-wrapper-child container-fluid ng-cloak" ng-transclude></div>'
        };
    });
	
	index.register.directive('totvsPageNavbar', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
			template: '<div class="page-fixed" ng-transclude></div>'
        };
    });
	
	index.register.directive('totvsPageBreadcrumb', [ '$compile', '$interpolate', '$injector', 
		function ($compile, $interpolate, $injector) {
        return {
            restrict: 'E',
			compile: function (element, attrs) {
				var breadcrumbs = element.children('breadcrumb').clone() || [];
				
				element.html('<div class="page-navbar"><div class="row">' + 
							 '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-11"><ol class="breadcrumb">' +
							 '</ol></div></div></div>');
				
				var favoriteTemplate = '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-1"><a ng-click="doFavorite();" ' + 
					'role="button" class="btn btn-favorite pull-right"><span class="hidden-xs">' + 
					'{{ isFavorite ? "l-remove-favorite" : "l-add-favorite" | i18n }}</span>&nbsp;&nbsp;' + 
					'<span class="glyphicon" ng-class="(isFavorite) ? \'glyphicon-star\' : \'glyphicon-star-empty\'"' + 
					'aria-hidden="true"></span></a></div>';
				
				return function postLink(scope, element, attrs) {
					var breadcrumbContainer = element.find('.breadcrumb');
					
					scope.isFavorite = false;
                    
                    for (var i = 0; i < breadcrumbs.length; i++) {
						breadcrumbs[i] = angular.element(breadcrumbs[i]);
						
						var title = breadcrumbs[i].text();
						var link = breadcrumbs[i].attr('link');
						var ngClick = breadcrumbs[i].attr('ng-click');
						
						var breadcrumbTemplate = angular.element('<li></li>');
						
						if (link || ngClick) {
							
							breadcrumbTemplate.append(angular.element('<a></a>'));
							
							var breadcrumbLink = breadcrumbTemplate.find('a')
							
							breadcrumbLink.html($interpolate(title)(scope));
							
							if (link) {
								breadcrumbLink.attr('href', link);
							} else if (ngClick) {
								breadcrumbLink.attr('ng-click', ngClick);
								breadcrumbLink.addClass('clickable');
							}
						} else if ((i + 1) == breadcrumbs.length) { // Se for o último, não adiciona o 'link' <a>.
							breadcrumbTemplate.html($interpolate(title)(scope));
						} else {
							breadcrumbTemplate.html($interpolate(title)(scope));
						}
						
						breadcrumbContainer.append(breadcrumbTemplate);
					}
					
					var favoriteService = $injector.get('totvs.app-main-view.Service');
					
					if (angular.isFunction(favoriteService.isFavoriteView) 
						&& angular.isFunction(favoriteService.markAsFavorite)) {
						
						var favoriteContainer = element.find('.row');
						favoriteContainer.append(favoriteTemplate);
                        
                        var isFavoritePromise = favoriteService.isFavoriteView(window.location.hash);
                        
                        isFavoritePromise.then(function(isFavorite) {
                            scope.isFavorite = isFavorite;
                        });
                        
                        scope.doFavorite = function() {
                            var markAsFavoritePromise = favoriteService.markAsFavorite(window.location.hash, !scope.isFavorite);
							
                            markAsFavoritePromise.then(function(isFavorite) {
                                scope.isFavorite = isFavorite;
                            });
						};
					}
					
					$compile(breadcrumbContainer.parents('.page-navbar'))(scope);
				};
			}
		};
    }]);
	
	index.register.directive('totvsPageHeader', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
			template: ' <div class="page-head" ng-transclude></div></div>'
        };
    });
	
	index.register.directive('totvsPageHeaderTitle', [ '$compile', '$interpolate', 
		function ($compile, $interpolate) {
		return {
            restrict: 'E',
			replace: true,
			scope: { title: '@', total: '@', settings: '&' },
			template: '<div class="row"><div class="col-xs-12">' + 
				'<h2 class="title">{{title}}<span ng-if="total">&nbsp;({{total}})</span></h2></div></div>',
			compile: function (element, attrs) {
				
				return function postLink(scope, element, attrs) {
				
					var page = element.parents('div.page-wrapper-child');
					if (page === null || page === undefined || page.length < 1) {
						page = element.parents('div.page-wrapper');
					}

					if (page.attr('type') == 'list') {

						var haveSettings = (attrs.settings != null && attrs.settings != undefined);

						if (haveSettings) {

							element.find('.col-xs-12').addClass('col-lg-10 col-md-10 col-sm-10');

							var settingsTemplate = '<div class="col-lg-2 col-md-2 col-sm-2 hidden-xs">' +
								'<div class="settings"><h3><a class="clickable" ng-click="settings()">' + 
								'<span class="glyphicon glyphicon-cog"></span></a></h3></div></div>';

							element.append(settingsTemplate);
						}

					}					
				};
			}
        };
    }]);
	
	index.register.directive('totvsPageHeaderOperation', function () {
        return {
            restrict: 'E',
			replace: true,
			transclude: true,
			template: '<div class="row" ng-transclude></div>'
        };
    });
	
	index.register.directive('totvsPageHeaderOperationAction', ['$compile', '$interpolate', 
		function ($compile, $interpolate) {
        return {
            restrict: 'E',
			replace: true,
			scope: { 
				onSave: '&', 
				onCancel: '&', 
				onBack: '&', 
				onEdit: '&', 
				onRemove: '&', 
				hideRemove: '@', 
				hideEdit: '@',
				items: '&',
				itemsAs: '@'
			},
			controller: function($scope) {
				this.scope = $scope;
			},
			compile: function (element, attrs) {
				var actions = element.children('action').clone() || [];
				
				var onEditLink = element.attr('on-edit-link');
				var onBackLink = element.attr('on-back-link');
				
				element.html('<div class="col-lg-7 col-md-7 col-sm-7 col-xs-12"><div class="operations"></div></div>');

				var actionsTemplate = angular.element('<div class="btn-group" role="group">' + 
					'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" role="button"' +
					'aria-expanded="false"><span class="hidden-xs">{{\'btn-actions\'|i18n}}&nbsp;&nbsp;</span>' +
					'<span class="glyphicon glyphicon-option-vertical"></span></a>' +
					'<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul></div>');

				var parse = function(el, action, primaryAction, scope) {
					
					var css = action.attr('class');
					var link = action.attr('link');
					var ngClick = action.attr('ng-click');
					var title = action.text();
					
					if (link) {
						el.attr('href', link);
					} else if (ngClick) {
						el.addClass('clickable');
						el.attr('ng-click', ngClick);
					}

					if (!css) {
						css = 'glyphicon-tree-deciduous';
					}
					
					if (primaryAction) {
						el.children('.glyphicon').addClass(css);
					} else {	
						el.prepend('<span class="glyphicon ' + css + '"></span>');
					}
					
					if (primaryAction) {
						el.children('.hidden-xs').append('&nbsp;&nbsp;' + $interpolate(title)(scope));
					} else {
						el.append('&nbsp;&nbsp;' + $interpolate(title)(scope));
					}
					
					angular.forEach($(action).get(0).attributes, function(attr) {
						if (attr.name != 'link' && attr.name != 'class' && attr.name != 'ng-click') {
							el.attr(attr.name, attr.value);
						}
					});
				};
				
				if (angular.isUndefined(attrs.limitPrimaryAction)) {
					attrs.limitPrimaryAction = 3;
				}
				
				attrs.limitPrimaryAction = parseInt(attrs.limitPrimaryAction);
				
				if (attrs.limitPrimaryAction < 1) {
					attrs.limitPrimaryAction = 1;
				}
				
				return function postLink(scope, element, attrs) {
					
					var page = element.parents('div.page-wrapper-child');
					if (page === null || page === undefined || page.length < 1) {
						page = element.parents('div.page-wrapper');
					}

					if (page.attr('type') == 'list') {
					
						var limit = attrs.limitPrimaryAction + 1;

						var ignoreDisplayLimit = (limit > actions.length);

						for (var i = 0; i < actions.length; i++) {

							var action = angular.element(actions[i]);

							var primaryTemplate = angular.element('<a class="btn" role="button">' +
								'<span class="glyphicon"></span><span class="hidden-xs"></span></a>');

							var listContainer = actionsTemplate.find('ul');

							if (ignoreDisplayLimit || i < attrs.limitPrimaryAction) {

								if (i == 0) {
									primaryTemplate.addClass('btn-primary');
								} else {
									primaryTemplate.addClass('btn-default');
								}

								parse(primaryTemplate, action, true, scope);

								element.find('.operations').append(primaryTemplate);
							} else {

								var item = angular.element('<li><a></a></li>');

								parse(item.children('a'), action, false, scope);

								if (i < attrs.limitPrimaryAction) {
									item.addClass('visible-xs');
								}

								listContainer.append(item);
							}

						} // end:for

						element.find('.operations').append(actionsTemplate);
						
						$compile(element.find('.operations'))(scope.$parent);
						$compile(element.find('.operations'))(scope);
						
						var items = scope.items();
						var itemsAs = (scope.itemsAs || 'item');
						
						scope.$watch(function($scope) {
							
							var count = 0;
							
							if (items === undefined || items === null) {
								return count;
							}
							
							for (var i = 0; i < items.length; i++) {
								if (items[i].$selected) {
									count++;
								}
							}
							
							return count;
							
						}, function() {
							
							if (items === undefined || items === null) {
								return;
							}
							
							scope[itemsAs] = undefined;
							
							var count = 0;
							
							for (var i = 0; i < items.length; i++) {
								if (items[i].$selected) {
									count++;
									scope[itemsAs] = items[i];
									if (count > 1) {
										scope[itemsAs] = undefined;
										break;
									}
								}
							}
						});
						
					} else if (page.attr('type') == 'detail') {
						
						var template = angular.element('<div class="col-xs-12"><div class="operations page-detail-actions"></div></div>');

						var templateContainer = template.find('.operations');
						
						var backAction = $('<a class="btn btn-primary" role="button">{{\'btn-back\' | i18n}}</a>');			
						
						var editAction = $('<a class="btn btn-default" role="button"><span class="glyphicon glyphicon-pencil">' +
										   '</span><span class="hidden-xs">&nbsp;&nbsp;{{\'btn-edit\'|i18n}}</span></a>');
						
						var removeAction = $('<a class="btn btn-default" role="button"><span class="glyphicon glyphicon-trash">' +
											 '</span><span class="hidden-xs">&nbsp;&nbsp;{{\'btn-remove\'|i18n}}</span></a>');
						
						if (angular.isFunction(scope.onBack())) {
							
							backAction.attr('ng-click', 'callOnBack();');
							scope.callOnBack = function() { scope.onBack()(); };
							$compile(backAction)(scope);
							
						} else if (angular.isString(onBackLink)) {
							backAction.attr('href', onBackLink);
							$compile(backAction)(scope.$parent);
							
						} else {
							backAction.attr('ng-click', 'controller.back();');
							$compile(backAction)(scope.$parent);
						}
						
						editAction.attr('ng-if', (scope.hideEdit != false));
						if (angular.isFunction(scope.onEdit())) {
							editAction.attr('ng-click', 'callOnEdit();');
							scope.callOnEdit = function() { scope.onEdit()(); };
							$compile(editAction)(scope);
							
						} else if (angular.isString(onEditLink)) {
							editAction.attr('href', onEditLink);
							$compile(editAction)(scope.$parent);
							
						} else {
							editAction.attr('ng-click', 'controller.edit();');
							$compile(editAction)(scope.$parent);
						}
						
						removeAction.attr('ng-if', (scope.hideRemove != false));
						if (angular.isFunction(scope.onRemove())) {
							
							removeAction.attr('ng-click', 'callOnRemove();');
							scope.callOnRemove = function() { scope.onRemove()(); };
							$compile(removeAction)(scope);
							
						} else {
							removeAction.attr('ng-click', 'controller.remove();');
							$compile(removeAction)(scope.$parent);
						}
						
						var listContainer = actionsTemplate.find('ul');
						
						for (var i = 0; i < actions.length; i++) {

							var action = angular.element(actions[i]);
							
							var item = angular.element('<li><a></a></li>');

							parse(item.children('a'), action, false, scope.$parent);

							listContainer.append(item);
						}
												
						$compile(actionsTemplate)(scope.$parent);
						
						templateContainer.append(backAction);
						templateContainer.append(editAction);
						templateContainer.append(removeAction);
						templateContainer.append(actionsTemplate);
						
						element.html(template);
						
					} else if (page.attr('type') == 'edit') {
						
						var template = angular.element('<div class="col-xs-12"><div class="operations page-detail-actions"></div></div>');

						var templateContainer = template.find('.operations');
						
						var saveAction = $('<button class="btn btn-primary">{{\'btn-save\' | i18n}}</button>');
						var cancelAction = $('<button class="btn btn-default">{{\'btn-cancel\' | i18n}}</button>');
						
						if (angular.isFunction(scope.onSave())) {
							saveAction.attr('ng-click', 'callOnSave();');
							scope.callOnSave = function() { scope.onSave()(); };
							$compile(saveAction)(scope);
						} else {
							saveAction.attr('ng-click', 'controller.save();');
							$compile(saveAction)(scope.$parent);
						}
						
						if (angular.isFunction(scope.onCancel())) {
							cancelAction.attr('ng-click', 'callOnCancel();');
							scope.callOnSave = function() { scope.onCancel()(); };
							$compile(cancelAction)(scope);
						} else {
							cancelAction.attr('ng-click', 'controller.cancel();');
							$compile(cancelAction)(scope.$parent);
						}
						
						templateContainer.append(cancelAction);
						templateContainer.append(saveAction);
						
						element.html(template);
					}
					
				};
			}
		};
	}]);
	
	index.register.directive('multipleSelected', ['$parse', 
		function ($parse) {
        return {
            restrict: 'A',
			require: '^totvsPageHeaderOperationAction',
			link: function(scope, element, attrs, controller) {
				
				var items = controller.scope.items();
				var itemsAs = controller.scope.itemsAs || 'item';
				
				scope.$watch(function($scope) {

					var count = 0;

					for (var i = 0; i < items.length; i++) {
						if (items[i].$selected) {
							count++;
						}
					}

					return count;

				}, function(count) {
					if (count > 0) {
						var enable = true;
						for (var i = 0; i < items.length; i++) {
							if (items[i].$selected) {
								var getter = $parse(attrs.multipleSelected || 'true');
								controller.scope.$parent[itemsAs] = items[i];
								enable = getter(controller.scope.$parent);
								if (!enable) break;
							}
						}
						element.attr('disabled', !enable);
					} else {
						element.attr('disabled', true);
					}
				});
			}
		};
	}]);
	
	index.register.directive('totvsPageHeaderOperationFilter', [ "$compile", 
		function ($compile) {
		return {
            restrict: 'E',
            replace: true,			
			scope: { advancedSearch: '&', placeholder: '@', 'ngModel': '@' },
			compile: function (element, attrs) {
				
				element.html('<div class="col-lg-5 col-md-5 col-sm-5 col-xs-12"><div class="filters">' +
							 '<div class="search-field"><form><div class="input-group pull-right">' +
							 '<input type="text" class="form-control" placeholder="{{placeholder}}">' +
							 '<span class="input-group-btn"><button class="btn btn-default" type="submit">' +
							 '<span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>' +
							 '</span></div></form></div><div class="advanced-search hidden-xs">' +
							 '<a ng-click="callAdvancedSearch()" class="clickable advanced-search">' +
							 '{{ \'btn-advanced-search\' | i18n }}</a></div></div></div>');
				
				return function postLink(scope, element, attrs) {

					if (angular.isFunction(scope.advancedSearch())) {
						scope.callAdvancedSearch = function() {
							scope.advancedSearch()();
						}
					} else {
						element.find('.advanced-search').remove();
					}
					
					element.find('input').attr('ng-model', scope.ngModel);
					$compile(element.find('input'))(scope.$parent);
					$compile(element.find('.filters'))(scope);
				};
			}
        };
    }]);
	
	index.register.directive('totvsPageTags', function () {
		return {
            restrict: 'E',
			compile: function (element, attrs) {
                var tags = element.children('tag').clone() || [];
				
				element.html('<div class="row"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hidden-xs">' + 
							 '<div class="page-tags"></div></div></div>');
				
				var tagContainer = element.find('.page-tags');
				
				angular.forEach(tags, function(tag) {
					
					tag = angular.element(tag);
					
					var tagTemplate = angular.element('<div class="tag legend"></div>');
					
					if (tag.attr('class')) {
						tagTemplate.addClass(tag.attr('class'));
					}
					
					tagTemplate.html(tag.text());
					
					angular.forEach($(tag).get(0).attributes, function(attr) {
						if (attr.name != 'class') {
							tagTemplate.attr(attr.name, attr.value);
						}
					});
					
					tagContainer.append(tagTemplate);
				});
			}
        };
    });
	
	index.register.directive('totvsPageDisclaimers', ['$compile', '$interpolate', 
		function ($compile, $interpolate) {
		return {
            restrict: 'E',
			scope: { disclaimerList : '=', ngClick: '&' },
			compile: function (element, attrs) {
				
				element.html('<div class="row hidden-xs"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' + 
					'<div class="page-disclaimers"><h5></h5></div></div></div>');
				
				element.removeAttr('ng-click');
				
				return function postLink(scope, element, attrs) {
					
					scope.disclaimerList = (scope.disclaimerList ? scope.disclaimerList : []);
					
					var disclaimerContainer = element.find('h5');
					
					if (scope.disclaimerList.length > 0) {
						disclaimerContainer.append($interpolate('<span>{{ \'l-filter-by\' | i18n }}: </span>')(scope));
					}
					
					var disclaimerTemplate = angular.element('<span ng-repeat="disclaimer in disclaimerList" ' + 
						'class="label label-default" ng-click="onRemove(disclaimer)"' + 
						'ng-class="(ngClick && disclaimer.fixed != true) ? \'clickable\' : \'\'">' + 
						'<span>{{ disclaimer.title }}</span>' + 
						'<i class="glyphicon glyphicon-remove" ng-if="(ngClick && disclaimer.fixed != true)"></i>' + 
						'</span>');
					
					scope.onRemove = function(disclaimer) {
						if (disclaimer.fixed != true) {
							scope.ngClick(scope)(disclaimer);
						}
					};
					
                	disclaimerContainer.append(disclaimerTemplate);
					
					$compile(disclaimerContainer)(scope);
				};
			}
		};
    }]);
	
	index.register.directive('totvsPageContent', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
			template: '<div class="page-content" ng-transclude></div>',
			link: function (scope, element, attrs) { 

				var page = element.parents('div.page-wrapper-child');
				if (!(page === null || page === undefined || page.length < 1)) {
					return;
				}
		
				var fixed = $('div.page-fixed');

				if (fixed && fixed.length > 0) {
					
					var resize = function() {
						element.css('margin-top', fixed[0].offsetHeight - 15 + 'px');
					};
					
					fixed.resize(function() {
						resize();
					});
					
					// First run, to avoid problems when refresh the page.
					resize();
				}
			}
        };
    });
	
	index.register.directive('totvsListItem', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
			template: '<div class="list-item"><div class="item-content" ng-transclude></div></div>'
        };
    });
	
	index.register.directive('totvsListItemHeader', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,			
			template: '<div class="item-actions"><div class="row" ng-transclude></div></div>'
        };
    });
	
	index.register.directive('totvsListItemTitle', function () {
        return {
            restrict: 'E',
            replace: true,
			template: '<div><a class="title link">{{title}}</span></a></div>',
			scope: { link: '@', title: '@' },
			compile: function (element, attrs) {
				
				if (attrs.$attr.class) {
					element.addClass("col-xs-10");
				} else {
					element.addClass("col-lg-9 col-md-9 col-sm-9 col-xs-10");
				}
				
				return function postLink(scope, element, attrs) {
					if (scope.link) {
						element.find('a').attr('href', scope.link);
					}
				}
			}
        };
    });
	
	index.register.directive('totvsListItemAction', ['$compile', '$interpolate', 
		function ($compile, $interpolate) {
        return {
            restrict: 'E',
			compile: function (element, attrs) {
                var actions = element.children('action').clone() || [];

				element.html('<div class="col-lg-3 col-md-3 col-sm-3 col-xs-2">' + 
					 '<div class="btn-group btn-group-sm actions pull-right" role="group" aria-label="item-actions"></div></div>');
				
				var actionsTemplate = angular.element('<div class="btn-group btn-group-sm" role="group">' + 
					'<a class="btn btn-default dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' +
					'<span>{{\'btn-actions\'|i18n}}&nbsp;&nbsp;</span><span class="glyphicon glyphicon-option-vertical"></span></a>' +
					'<ul class="dropdown-menu dropdown-menu-right" role="menu"></ul></div>');
					
				var parse = function(el, action, primaryAction) {
						
					var css = action.attr('class');
					var link = action.attr('link');
					var ngClick = action.attr('ng-click');

					if (link) {
						el.attr('href', link);
					} else if (ngClick) {
						el.addClass('clickable');
						el.attr('ng-click', ngClick);
					}

					if (css) {
						if (primaryAction) {
							el.children('.glyphicon').addClass(css);
						} else {
							el.prepend('<span class="glyphicon ' + css + '"></span>&nbsp;&nbsp;');
						}	
					}

					el.append('&nbsp;&nbsp;' + action.text());

					angular.forEach($(action).get(0).attributes, function(attr) {
						if (attr.name != 'link' && attr.name != 'class' && attr.name != 'ng-click') {
							el.attr(attr.name, attr.value);
						}
					});
				};
				
				if (angular.isUndefined(attrs.limitPrimaryAction)) {
					attrs.limitPrimaryAction = 2;
				}
				
				attrs.limitPrimaryAction = parseInt(attrs.limitPrimaryAction);
				
				var listContainer = actionsTemplate.find('ul');
				var ignoreDisplayLimit = ((attrs.limitPrimaryAction + 1) >= actions.length);

				for (var i = 0; i < actions.length; i++) {

					var action = angular.element(actions[i]);

					var primaryTemplate = angular.element('<a role="button" class="btn btn-default hidden-xs">' +
						'<span class="glyphicon"></span></a>');

					if (ignoreDisplayLimit || i < attrs.limitPrimaryAction) {
						parse(primaryTemplate, action, true);
						element.find('.actions').append(primaryTemplate);
					}

					var item = angular.element('<li><a></a></li>');

					parse(item.children('a'), action, false);

					if (i < attrs.limitPrimaryAction) {
						item.addClass('visible-xs');
					}

					listContainer.append(item);
				};

				if (ignoreDisplayLimit) {
					actionsTemplate.addClass('visible-xs');
				}

				element.find('.actions').append(actionsTemplate);
			}
        };
    }]);
	
	index.register.directive('totvsListItemContent', function () {
        return {
            restrict: 'E',
            replace: true,
			transclude: true,
			template: '<div class="item-info"><div class="row" ng-transclude></div></div>'
        };
    });
	
	index.register.directive('totvsListItemInfo', function () {
        return {
            restrict: 'E',
            replace: true,
			template: '<div><div class="item-field"><label>{{title}}:</label><span>{{value}}</span></div></div>',
			scope: { title: '@', value: '@' },
			compile: function (element, attrs) {
				if (attrs.$attr.class) {
					element.addClass("col-xs-12");
				} else {
					element.addClass("col-xs-12 col-sm-6 col-md-6 col-lg-6");
				}
			}
        };
    });
	
	index.register.directive('totvsListItemContentDetail', function () {
        return {
            restrict: 'E',
            replace: true,
			transclude: true,
			template: '<div><div class="item-details" style="display: none;"><div class="row" ng-transclude></div></div>' + 
				'<div class="row info-more text-center"><a class="clickable" ng-click="showDetail();">' + 
				'<span style="opacity:.8;">{{ isOpen ? "&#9650;" : "&#9660;"}}&nbsp;' + 
				'{{ (isOpen ? "close-info-more" : "open-info-more") | i18n }}</span></a></div></div>',
			link: function(scope, element, attrs) {
				scope.showDetail = function(event) {					
					
					var elementeDisplay = element.children('.item-details');
					
					elementeDisplay.slideToggle();
					elementeDisplay.toggleClass('open');
					
					scope.isOpen = elementeDisplay.hasClass('open');
				}
			}
        };
    });		
	
	index.register.directive('totvsListPagination', function () {
		return {
			restrict: 'E',
            replace: true,
			transclude: true,
			template: '<div class="more-results"><a class="btn btn-primary col-xs-12">{{ \'l-more-results\' | i18n }}</a></div>'
		}
	});
	
	index.register.directive('totvsPageDetail', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
			template: '<div class="page-details"><div class="row" ng-transclude></div></div>'
        };
    });
	
	index.register.directive('totvsPageDetailInfo', function () {
        return {
            restrict: 'E',
            replace: true,
			scope : { class: '@', title: '@', value: '@' },
			template: '<div class="class"><div class="field-label">{{ title }}</div>' + 
				'<div class="field-value">{{ value }}</div></div>'
        };
    });
	
	index.register.directive('totvsPageForm', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
			template: '<div class="page-form"><form class="form-horizontal row" ng-transclude></form></div>'
        };
    });
	
	index.register.directive('totvsTabset', function () {
        return {
            restrict: 'E',
            replace: true,
			transclude: true,
			template: '<div class="tabset col-xs-12" ng-transclude></div>'
        };
    });
	
	index.register.directive('totvsTable', [ "$compile", "$interpolate", 
		function ($compile, $interpolate) {
        return {
            restrict: 'E',
			scope: {
				items: '&',
				itemsAs: '@',
				itemsFilter: '@',
				dblclick: '&'
			},
			compile: function (element, attrs) {
				
				var columns = element.children('column');
				
				var template = $('<div class="table-content">' + 
				'	<div class="table-responsive">' + 
				'		<table class="table table-condensed">' + 
				'			<colgroup><col span="2" style="position: absolute"></colgroup>' + 
				'			<thead><tr></tr></thead>' + 
				'			<tbody><tr class="clickable"></tr></tbody>' + 
				'		</table>' + 
				'	</div>' + 
				'</div>');

				element.html(template);
				
				return function postLink(scope, element, attrs) {
					
					var header = element.find('thead > tr');
					var body = element.find('tbody > tr');
					
					// ng-repeat
					var itemsAs = (scope.itemsAs || 'item');
					var itemsFilter = (scope.itemsFilter ? ' | ' + scope.itemsFilter : '');
					
					scope.objects = scope.items();
					body.attr('ng-repeat', itemsAs + ' in objects' + itemsFilter);
					
					// Selection
					body.attr('ng-class', "{'selected':" + itemsAs + ".$selected}");
					
					scope.isAllSelected = false;
					var selectColumnTemplate = '<th style="width: 0px">' + 
						'<input type="checkbox" style="margin-left: 3px;" ng-model="isAllSelected"' +
						'ng-click="selectedAll()"></th>';

					var selectRowColumnTemplate = '<td scope="row" class="select">' + 
						'<input type="checkbox" ng-model="' + itemsAs + '.$selected"></td>';

					if (attrs.singleSelect != undefined) {
						// Alterar o template para single (radio button);
					} else {
						header.append(selectColumnTemplate);
						body.append(selectRowColumnTemplate);
					}
					
					// Columns
					angular.forEach(columns, function (column) {

						column = angular.element(column);

						header.append('<th>' + $interpolate(column.attr('title'))(scope) + '</th>');

						var row = $('<td></td>');
						
						if (angular.isFunction(scope.dblclick)) {
							row.attr('ng-dblclick', 'onDoubleClick(' + itemsAs + ')');
						}

						row.attr('ng-click', 'onClick(' + itemsAs + ')');
						
						if (column.text().trim().length > 0) {
							row.html(column.text());
						} else {
							if (column.html().trim() === '&nbsp;') {
								row.html(column.html());
							} else {
								row.html($compile(column.html())(scope.$parent));
							}
						}

						angular.forEach($(column).get(0).attributes, function(attr) {
							if (attr.name != 'title') {
								row.attr(attr.name, attr.value);
							}
						});
						
						body.append(row);
					});
					
					$compile(header)(scope);
					$compile(body)(scope);
					
					// Events
					scope.onClick = function(object) {
						if (object.hasOwnProperty('$selected')) {
							object.$selected = !object.$selected;
						} else {
							object.$selected = true;
						}
					};
					
					scope.onDoubleClick = function(object) {
						var param = {};
						param[itemsAs] = object;
						scope.dblclick(param);
					};
					
					scope.selectedAll = function() {
						scope.isAllSelected = !scope.isAllSelected;
						angular.forEach(scope.objects, function(object) {
							object.$selected = scope.isAllSelected;
						});
					};
				};
			}
        };
    }]);
	
	/* ********************************************************************************* */
	/* *** Components						   							     	 	 	 */
	/* ********************************************************************************* */
	
    index.register.filter('mask', [

        function () {
            return function (string, mask) {
                if (!angular.isString(string))
                    return string;
                var ret = '';
                var j = 0;
                for (var i = 0; i < mask.length; i++) {
                    var c = mask.charAt(i);
                    if (c == '9' || c == 'A' || c == '*') {
                        var cs = string.charAt(j++);
                        if (c == '9') {
                            while (!/[0-9]/.test(cs)) {
                                if (j >= string.length) return ret;
                                cs = string.charAt(j++);
                            }
                        }
                        ret = ret + cs;
                        if (j >= string.length) return ret;
                    } else {
                        ret = ret + c;
                    }
                }

                return ret;
            };
    }]);

	index.register.filter('progressDate', [

        function () {
            return function (string) {
				if (!string) return string;
				return string.substring(0,10);
            };
    }]);
	
	index.register.directive('templatePopoverRemoveAll', function () {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				var event = attrs.templatePopoverRemoveAll || 'click'
				$(element).on(event, function () {
					$('[template-popover]').each(function (i,o) {
						if ($(o).data('bs.popover')) $(o).popover('hide');
					});
				});				
			}
		}
	});
	
	
	index.register.directive('templatePopover', [ "$compile", "$http", "$templateCache", "$q", "$timeout" , 
	function ($compile, $http, $templateCache, $q, $timeout) {
		return {
			restrict: "A",
			transclude: true,
			template: "<span ng-transclude></span>",
			link: function (scope, element, attrs) {
				var popOverContent;
				
				var setupPopover = function () {
					$http.get(scope.template, {
							cache: $templateCache
						}).
						then(function (response) {
						
							var html = response.data;
							// se popoverData é uma promise, espera resolver para abrir a popover
							var promis = scope.popoverData;
							// verificar se foi passado um promise
							if (scope.promise) promis=scope.promise;
							if (promis.$promise) promis = promis.$promise;
							$q.when(promis).then(function (data) {
								var el = angular.element(html);
								popOverContent = $compile(el)(scope);
								$timeout(function() {
									var options = {
										container: 'body',
										content: popOverContent,
										placement: scope.placement || "right",
										html: true,
										title: scope.title
									};
									if (scope.large) 
										options.template = '<div class="popover popover-large"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
									$(element).popover(options);
									$(element).on('show.bs.popover', function (e) {
										// esconde os outros popoever's
										$('[template-popover]').each(function (i,o) {
											if (  $(element)[0] != $(o)[0]
											   && $(o).data('bs.popover')) $(o).popover('hide');
										});
									});
									$(element).popover('show');									
								});
								
							});
						});
				}
				
				scope.$watch('promise', function () {
					
					if (scope.promise) {
						setupPopover();
					} else {
						$(element).popover('destroy');
					}
					
                });
			},
			scope: {
				large: '=',
				placement: '=',
				popoverData: '=',
				promise: '=',
				title: '@',
				template: "@templatePopover"
			}
		};
	}]);	
	
    index.register.directive('datePicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                startDate: '&',
                endDate: '&',
				ngDisabled: '&'
            },

            link: function (scope, element, attrs, ngModelCtrl) {

                scope.safeApply = function(fn) {
                    var phase = this.$root.$$phase;
                    if(phase == '$apply' || phase == '$digest') {
                        if(fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                var updateModel = function (date) {
                    ngModelCtrl.$setViewValue(date);
                };

                var setUpDatePicker = function () {
					
					if (!scope.ngDisabled()) {
						element.datepicker();
						element.on('changeDate', function (e) {
							var date = null;
							if (e.date) date = e.date.getTime();
							if (date != ngModelCtrl.$viewValue) scope.safeApply(updateModel(date));
							element.datepicker("hide");
						});
						element.on('clearDate', function (e) {
							var date = null;
							if (date != ngModelCtrl.$viewValue) scope.safeApply(updateModel(date));
						});
						if (scope.startDate()) {
							element.datepicker("setStartDate", new Date(scope.startDate()));
						}
						if (scope.endDate()) {
							element.datepicker("setEndDate", new Date(scope.endDate()));
						}
					}
                };

                scope.$watch(attrs.startDate, function () {
					if (!scope.ngDisabled()) {
						if (scope.startDate()) {
							element.datepicker("setStartDate", new Date(scope.startDate()));
						} else {
							element.datepicker("setStartDate", null);
						}
					}
                });

                scope.$watch(attrs.endDate, function () {
					if (!scope.ngDisabled()) {
						if (scope.endDate()) {
							element.datepicker("setEndDate", new Date(scope.endDate()));
						} else {
							element.datepicker("setEndDate", null);
						}
					}
                });

				scope.$watch(attrs.ngDisabled, function () {
					if (scope.ngDisabled()) {
						element.find('input').prop('disabled', true);
						element.datepicker("remove");
					} else {
						element.find('input').prop('disabled', false);
						setUpDatePicker();
					}
                });

                ngModelCtrl.$render = function () {
                    var date;

                    if (ngModelCtrl.$viewValue === undefined || ngModelCtrl.$viewValue === null)
                        date = null;
                    else
                        date = new Date(ngModelCtrl.$viewValue);

                    element.datepicker("setDate", date);
					
					if (scope.ngDisabled()) {
						element.find('input').prop('disabled', true);
						element.datepicker("remove");
					} 
                };

                scope.$watch(attrs.datePicker, setUpDatePicker, true);
            }
        };
    });

    index.register.directive('datePickerRange', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                startDate: '=',
                endDate: '='
            },
            link: function (scope, element, attrs, ngModelCtrl) {

                scope.safeApply = function(fn) {
                    var phase = this.$root.$$phase;
                    if(phase == '$apply' || phase == '$digest') {
                        if(fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };

                var updateModel = function (date, start) {

                    var dates = {};

                    if (ngModelCtrl.$viewValue) {
                        dates.start = (ngModelCtrl.$viewValue.start ? ngModelCtrl.$viewValue.start : null);
                        dates.end = (ngModelCtrl.$viewValue.end ? ngModelCtrl.$viewValue.end : null);
                    }

                    if (date && angular.isDate(date)) {
                        date = date.getTime();
                    }

                    if (start) {
                        dates.start = date;
                    } else {
                        dates.end = date;
                    }

                    ngModelCtrl.$setViewValue(dates);
                };

                var setUpDatePickerRange = function () {

                    element.datepicker();

                    var startEl = element.find('[name=start]');
                    var endEl = element.find('[name=end]');

                    startEl.on('changeDate', function (e) {
                        var date = e.date;
                        if (!(ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.start && date === ngModelCtrl.$viewValue.start)) {
                            scope.safeApply(updateModel(e.date, true));
                        }
                        startEl.datepicker("hide");
                    });

                    endEl.on('changeDate', function (e) {
                        var date = e.date;
                        if (!(ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.end && date === ngModelCtrl.$viewValue.end)) {
                            scope.safeApply(updateModel(e.date, false));
                        }
                        endEl.datepicker("hide");
                    });

                    startEl.on('clearDate', function (e) {
                        scope.safeApply(updateModel(null, true));
                    });

                    endEl.on('clearDate', function (e) {
                        scope.safeApply(updateModel(null, false));
                    });
                };

                scope.$watch('startDate', function () {

                    var startEl = element.find('[name=start]');
                    var endEl = element.find('[name=end]');

                    if (scope.startDate) {
                        startEl.datepicker("setStartDate", new Date(scope.startDate));
                        endEl.datepicker("setStartDate", new Date(scope.startDate));
                    } else {
                        startEl.datepicker("setStartDate", null);
                        endEl.datepicker("setStartDate", null);
                    }
                });

                scope.$watch('endDate', function () {

                    var startEl = element.find('[name=start]');
                    var endEl = element.find('[name=end]');

                    if (scope.endDate) {
                        if (angular.isDate(scope.endDate)) {
                            startEl.datepicker("setEndDate", scope.endDate);
                            endEl.datepicker("setEndDate", scope.endDate);
                        } else {
                            startEl.datepicker("setEndDate", new Date(scope.endDate));
                            endEl.datepicker("setEndDate", new Date(scope.endDate));
                        }
                    } else {
                        startEl.datepicker("setEndDate", null);
                        endEl.datepicker("setEndDate", null);
                    }
                });

                ngModelCtrl.$render = function () {

                    if (ngModelCtrl.$viewValue) {

                        if (ngModelCtrl.$viewValue.start === undefined) {
                            ngModelCtrl.$viewValue.start = null;
                        }

                        if (ngModelCtrl.$viewValue.end === undefined) {
                            ngModelCtrl.$viewValue.end = null;
                        }

                        var startEl = element.find('[name=start]');
                        var startDate = ngModelCtrl.$viewValue.start;
                        if (startDate && !angular.isDate(startDate)) {
                            startDate = new Date(startDate);
                        }

                        var endEl = element.find('[name=end]');
                        var endDate = ngModelCtrl.$viewValue.end;
                        if (endDate && !angular.isDate(endDate)) {
                            endDate = new Date(endDate);
                        }

                        startEl.datepicker('setDate', startDate);
                        endEl.datepicker('setDate', endDate);
                    }

                };

                scope.$watch(attrs.datePickerRange, setUpDatePickerRange, true);
            }
        };
    });

    index.register.directive('autonumeric', function () {
        var options = {};
        return {
            restrict: 'A',
            require: 'ngModel',


            //https://gist.github.com/kwokhou/5964296
            compile: function (tElm, tAttrs) {

                var isTextInput = tElm.is('input:text');

                return function (scope, elm, attrs, controller) {
                    // Get instance-specific options.
                    var opts = angular.extend({}, options, scope.$eval(attrs.autonumeric));

                    // Helper method to update autoNumeric with new value.
                    var updateElement = function (element, newVal) {
                        // Only set value if value is numeric
						if (newVal == undefined || newVal == null)
							newVal = 0;
						
                        if ($.isNumeric(newVal))
                            element.autoNumeric('set', newVal);
                    };

                    // Initialize element as autoNumeric with options.
                    elm.autoNumeric('init',opts);

                    // if element has controller, wire it (only for <input type="text" />)
                    if (controller && isTextInput) {
                        // watch for external changes to model and re-render element
                        scope.$watch(tAttrs.ngModel, function (current, old) {
                            controller.$render();
                        });
                        // render element as autoNumeric
                        controller.$render = function () {
                        	if (elm.data('autoNumeric'))
                        		updateElement(elm, controller.$viewValue);
                        };
                        // Detect changes on element and update model.
                        elm.on('change', function (e) {
                            scope.$apply(function () {
                                controller.$setViewValue(elm.autoNumeric('get'));
                            });
                        });
                    } else {
                        // Listen for changes to value changes and re-render element.
                        // Useful when binding to a readonly input field.
                        if (isTextInput) {
                            attrs.$observe('value', function (val) {
                                updateElement(elm, val);
                            });
                        }
                    }
                };
            } // compile
        };
    });

	index.register.controller('zoomController',[ "$modalInstance", "$injector", "$scope", "zoomoptions", "zoomcallback", "zoominit", 
	function ($modalInstance, $injector, $scope, zoomoptions, zoomcallback, zoominit) {

		this.returnValue = function () {
			return this.zoomResultList[this.selected];
		};

		this.zoomResultList = [];
		this.resultTotal = 0;
		
		var service = $injector.get(zoomoptions);

		angular.extend(this, service);

		this.onChangeFilter = function() {

			this.selected = undefined;
			this.selectedFilterValue = undefined;

			this.zoomResultList = [];
			this.resultTotal = 0;

			if (this.selectedFilter) {

				var isToShowOnGrid = true;

				var _self = this;

				angular.forEach(this.tableHeader, function(item) {
					if (isToShowOnGrid && item.property === _self.selectedFilter.property) {
						isToShowOnGrid = false;
						return;
					}
				});

				this.selectedFilter.isToShowOnGrid = isToShowOnGrid;
			}
		};

		this.onClickRow = function (selected) {
			this.selected = selected;
		};

		this.applyInternalFilter = function (more) {

			if (this.selectedFilter /*&& this.selectedFilterValue*/ ) {
				var parameters = {
					init: zoominit(),
					selectedFilter: this.selectedFilter,
					selectedFilterValue: this.selectedFilterValue,
					more: more
				};
				this.applyFilter(parameters);
			}

		};

		this.initialize = function() {
			if (this.propertyFields) {

				var _self = this;

				angular.forEach(this.propertyFields, function(item) {
					if (item.default === true) {
						_self.selectedFilter = item;
					}
				});
			}
		}

		this.ok = function () {
			$modalInstance.close(this.returnValue($scope));
			zoomcallback(this.zoomResultList[this.selected]);
		};

		this.cancel = function () {
			$modalInstance.dismiss();
		};

	}]);

	index.register.directive('zoom', [ "$compile", "$modal", "$injector", "$controller", "$q", "$timeout", "$rootScope", 
	function ($compile, $modal, $injector, $controller, $q, $timeout, $rootScope) {
		return {
			restrict: 'AE',
			require: 'ngModel',
			scope: {
				zoomSelected: '&',
				zoomInit: '&',
				ngDisabled: '&'
			},

			link: function (scope, element, attrs, ngModelCtrl) {
				
				scope.getObjectFromValue = function (value) {
					
					var selectedId = scope.selectedItemObj;
					
					if (attrs.zoomId && selectedId) 
						selectedId = selectedId[attrs.zoomId];
					
					if (value  == selectedId) return scope.selectedItemObj;
					
					var controller = attrs.zoomController;
					var service = attrs.zoomService;

					if (service) {
						service = $injector.get(service);
					} else {
						if (controller) {
							index.register.constant('zoomoptions', 'zoomoptions');
							index.register.constant('zoomcallback', undefined);
							index.register.constant('zoominit', undefined);

							service = $controller(controller, {

								$modalInstance: '$modalInstance',
								$injector: $injector,
								$scope: scope

							});
						} else
							service = undefined;
					}

					return (service && service.getObjectFromValue ? service.getObjectFromValue(value, scope.zoomInitFn()) : value);
				};
				
				var inputgroup = element.parents('.input-group');
				var inputgroupbtn = inputgroup.find('.input-group-btn');
				if (inputgroupbtn.length === 0) {
					inputgroupbtn = angular.element('<span class="input-group-btn"></span>');
					inputgroup.append(inputgroupbtn);
					inputgroup.addClass('no-block');
				}
				
				var btZoom = angular.element('<button class="btn btn-default" data-ng-click="openZoom()" ng-disabled="ngDisabled()">' +
					'<span class="glyphicon glyphicon-search"></span></button>');

				scope.selectedItemFn = function (sel) {
					
					var equalobj = angular.equals(scope.selectedItemObj,sel);
					var oldvalue = scope.selectedItemObj;
					scope.selectedItemObj = sel;
					scope.showDescription();
					if (scope.zoomSelected && !equalobj && !scope.ngDisabled()) {						
						scope.zoomSelected({
							selected: sel,
							oldvalue: oldvalue
						});
					}
				};
				
				scope.showDescription = function () {
					if (scope.selectedItemObj) {
						if (attrs.zoomId) {
							var viewValue = scope.selectedItemObj[attrs.zoomId];
							if (attrs.zoomDescription)
								viewValue = viewValue + " - " + scope.selectedItemObj[attrs.zoomDescription];
							scope.setModelValue(viewValue);				
						}						
					}
				}

				scope.zoomInitFn = function () {
					if (scope.zoomInit) {
						return scope.zoomInit();
					}
				};

				scope.openZoom = function () {
					var modaloptions = {
						templateUrl: attrs.zoomTemplate || $rootScope.appRootContext + 'html/templates/zoom.html',
						controller: (attrs.zoomController || 'zoomController') + ' as controller',
						size: 'lg',
						scope: scope,
						resolve: {
							zoomoptions: function () {
								return attrs.zoomService;
							},
							zoomcallback: function () {
								return scope.selectedItemFn;
							},
							zoominit: function () {
								return scope.zoomInitFn;
							}
						}
					};

					scope.zoominstance = $modal.open(modaloptions);

					scope.zoominstance.result.then(function (selectedItem) {
						scope.selectedItemObj = null;
						scope.setModelValue(selectedItem);
					});

				};

				scope.setModelValue = function (selectedItem) {
					ngModelCtrl.$setViewValue(selectedItem);
					ngModelCtrl.$render();
				};

				scope.loadFromValue = function (viewValue) {
					var q = undefined
					
					if (attrs.required || 
						(viewValue != undefined && 
						 viewValue != null && 
						 viewValue != "" && 
						 viewValue != 0)) 
						q = scope.getObjectFromValue(viewValue);
					
					if (q) {
						if (q && q.hasOwnProperty('$then')) {
							q.$promise.then(function (val) {
									previous = viewValue;
									ngModelCtrl.$setValidity('zoom', val != null);
									if (val.data != null) {
										scope.selectedItemFn(q);
									}
								},
								function (val) {
									previous = viewValue;
									ngModelCtrl.$setValidity('zoom', false);
								});
						} else if (q && q.hasOwnProperty('$promise')) {
							q.$promise.then(function (val) {
								previous = viewValue;
								ngModelCtrl.$setValidity('zoom', !val.hasOwnProperty('data'));
								if (!val.hasOwnProperty('data')) {
									scope.selectedItemFn(q);
								}
							}, function (val) {
								previous = viewValue;
								ngModelCtrl.$setValidity('zoom', false);
							});
						} else if (q == null || q == undefined) {
							previous = viewValue;
							ngModelCtrl.$setValidity('zoom', false);
						} else {
							previous = viewValue;
							ngModelCtrl.$setValidity('zoom', true);
							scope.selectedItemFn(q);
						}
					} else {
						scope.selectedItemFn(undefined);
					}					
				};

				$compile(btZoom)(scope);

				inputgroupbtn.append(btZoom);

				var previous;
				var timeoutPromise;

				ngModelCtrl.$formatters.push(function (modelValue) {
					scope.loadFromValue(modelValue);
					
					return modelValue;
				});

				ngModelCtrl.$parsers.push(function (viewValue) {
					
					if (typeof viewValue === "string") {
						viewValue = viewValue.split(" - ")[0];
					}
					
					if (timeoutPromise) {
						$timeout.cancel(timeoutPromise); //cancel previous timeout
					}
					timeoutPromise = $timeout(function () {
						scope.loadFromValue(viewValue);
					}, 500);

					return viewValue;
				});

			}

		};
	}]);

    index.register.directive('timePicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',

            link: function (scope, element, attrs, ngModelCtrl) {
                var updateModel = function (time) {
                    ngModelCtrl.$setViewValue(time);
                };
                var setUpTimePicker = function () {
                    element.timepicker();
                    element.on('changeTime.timepicker', function (e) {
                        if (e.time.value != ngModelCtrl.$viewValue) scope.$apply(updateModel(e.time.value));
                    });
                };

                ngModelCtrl.$render = function () {
                    element.timepicker("setTime", ngModelCtrl.$viewValue);
                };


                scope.$watch(attrs.timePicker, setUpTimePicker, true);
            }
        };
    });

    index.register.directive('field', [ "$interpolate", "$compile", "$http", "$templateCache" , "$rootScope", 
	function ($interpolate, $compile, $http, $templateCache, $rootScope) {
        return {
            //require: '^form',
            restrict: 'E',
            priority: 200,
            terminal: true,
            compile: function (element, attrs) {

                var validationMsgs = {};
                var validators = element.find('validator');
                angular.forEach(validators, function (validator) {
                    validator = angular.element(validator);
                    validationMsgs[validator.attr('key')] = $interpolate(validator.text());
                });

				var label = element.find('label');
				var labelContent = undefined;

				if (label && label.length > 0) {
					labelContent = label[0] && label.html();
				} else {
					labelContent = attrs.label;
				}
				
				// Tratado via CSS
				/*if (attrs.$attr.required) {
					labelContent = labelContent +  ' *';
				}*/
				
                var options = [];
                var opts = element.find('options').children();
                angular.forEach(opts, function (opt) {
                    opt = angular.element(opt);
                    options.push({
                        id: opt.attr('value'),
                        text: opt.text()
                    });
                });

                var includeHTML = element.find('include').html();
                var zoomDef = element.find('zoom')[0];

                element.html('');

                return function postLink(scope, element, attrs) {

                    var template = attrs.type || 'input';

                    $http.get($rootScope.appRootContext + "html/templates/field/" + template + ".html", {
                        cache: $templateCache
                    }).
                    then(function (response) {
                        var templateElement = angular.element(response.data);

						var childScope = scope.$new();
						childScope.$validationMessages = angular.copy(validationMsgs);
						childScope.$options = options;
						childScope.$fieldId = attrs.ngModel.replace('.', '_').toLowerCase();

						scope.$watch(attrs.ngShow, function (value) {
							if (value == false) {
								templateElement.parents('field').addClass('ng-hide');
							} else if (value == true) {
								templateElement.parents('field').removeClass('ng-hide');
							}
						});

						scope.$watch(attrs.ngHide, function (value) {
							if (value == true) {
								templateElement.parents('field').addClass('ng-hide');
							} else if (value == false) {
								templateElement.parents('field').removeClass('ng-hide');
							}
						});
						
                        var inputElement = templateElement.find('[bind]');
                        angular.forEach(attrs.$attr, function (original, normalized) {
                            if (original != 'type' && original != 'class') {
                                var value = element.attr(original);
                                inputElement.attr(original, value);
                            }
                        });

                        inputElement.attr('name', childScope.$fieldId);
                        inputElement.attr('id', childScope.$fieldId);

						if (labelContent) {

							childScope.$fieldLabel = $interpolate(labelContent)(scope);

							var labelElement = templateElement.find('label');
							labelElement.attr('for', childScope.$fieldId);
							labelElement.html(labelContent);
							labelElement.attr('tooltip', labelContent);
							labelElement.attr('tooltip-placement', 'top');

						} else {
							templateElement.find('label').remove();
							templateElement.find('div.col-xs-8').removeClass();
						}

                        var includeElement = templateElement.find('[include]');
                        if (includeElement.length > 0)
                            includeElement.append(includeHTML);
						
						if (zoomDef) {
                            var inputgroup = templateElement.find('.input-group');
                            var inputgroupbtn = inputgroup.find('.input-group-btn');
                            if (inputgroupbtn.length === 0) {
                                inputgroupbtn = angular.element('<span class="input-group-btn"></span>');
                                inputgroup.append(inputgroupbtn);
								inputgroup.addClass('no-block');
                            }
							var zoomHTML = angular.element("<zoom></zoom>");
							zoomHTML.attr("ng-model",attrs.ngModel);
							zoomHTML.attr("ng-disabled",attrs.ngDisabled);
							
							for (i = 0; i < zoomDef.attributes.length; i++)
							{
								var a = zoomDef.attributes[i];
								zoomHTML.attr(a.name, a.value);
							}
							inputgroupbtn.append(zoomHTML);
							
						}
							
						if (attrs.$attr.class) {
                            element.addClass("col-xs-12");
						} else {
							element.addClass("col-xs-12 col-md-6");
						}

                        if (attrs.$attr.keypad) {
                            var inputgroup = templateElement.find('.input-group');
                            var inputgroupbtn = inputgroup.find('.input-group-btn');
                            if (inputgroupbtn.length === 0) {
                                inputgroupbtn = angular.element('<span class="input-group-btn"></span>');
                                inputgroup.append(inputgroupbtn);
								inputgroup.addClass('no-block');
                            }

                            var btKeypad = angular.element('<button class="btn btn-default" data-ng-click="openKeypad($event)">' +
                                '<span class="glyphicon glyphicon-th"></span></button>');
							
                            if (attrs.ngDisabled) {
                                btKeypad.attr('data-ng-disabled', attrs.ngDisabled);
                            }
							var keypad = angular.element('<div><totvskeypad is-open="keypadOpen"></totvskeypad></div>');
							keypad.attr("ng-model",attrs.ngModel);
							inputElement.before(keypad);	
                            inputgroupbtn.append(btKeypad);
                        }
						
                        if (attrs.$attr.canclean) {
                            var inputgroup = templateElement.find('.input-group');
                            var inputgroupbtn = inputgroup.find('.input-group-btn');
                            if (inputgroupbtn.length === 0) {
                                inputgroupbtn = angular.element('<span class="input-group-btn"></span>');
                                inputgroup.append(inputgroupbtn);
								inputgroup.addClass('no-block');
                            }

                            var btClean = angular.element('<button class="btn btn-default" data-ng-click="cleanValue()">' +
                                '<span class="glyphicon glyphicon-remove"></span></button>');

                            if (attrs.ngDisabled) {
                                btClean.attr('data-ng-disabled', attrs.ngDisabled);
                            }

                            inputgroupbtn.append(btClean);
                        }
						

                        element.append(templateElement);
                        $compile(templateElement)(childScope);
                        childScope.$field = inputElement.controller('ngModel');
                        childScope.cleanValue = function () {
                            inputElement.controller('ngModel').$setViewValue(undefined);
                            inputElement.controller('ngModel').$render();
                        };
                        childScope.openKeypad = function ($event) {
							$event.preventDefault();
    						$event.stopPropagation();
							childScope.keypadOpen = !childScope.keypadOpen;
                        };

                        childScope.$watch('$field.$dirty && $field.$error', function (errorList) {
                            childScope.$fieldErrors = [];
                            angular.forEach(errorList, function (invalid, key) {
                                if (invalid) {
                                    childScope.$fieldErrors.push(key);
                                }
                            });
                        }, true);

						/*if (childScope.$field) {

							childScope.$watch('$field.$dirty && $field.$error', function (errorList) {
								childScope.$fieldErrors = [];
								angular.forEach(errorList, function (invalid, key) {
									if (invalid) {
										childScope.$fieldErrors.push(key);
									}
								});
							}, true);

						} else {

							var selectScope = angular.element(inputElement).scope();

							selectScope.$watch('$select', function(select) {

								childScope.$field = inputElement.controller('ngModel');

								childScope.$watch('$field.$dirty && $field.$error', function (errorList) {
									childScope.$fieldErrors = [];
									angular.forEach(errorList, function (invalid, key) {
										if (invalid) {
											childScope.$fieldErrors.push(key);
										}
									});
								}, true);

							});

						}*/

                    }, function (response) {
                        throw new Error('Template not found: ' + template + '.html');
                    });

                };

            }

        };
    }]);

	index.register.directive('onKeyEnter', function () {
		return function (scope, element, attrs) {
			element.bind("keydown keypress", function (event) {
				if (event.which === 13) {
					scope.$apply(function (){
						scope.$eval(attrs.onKeyEnter);
					});
					event.preventDefault();
				}
			});
		};
	});

    index.register.directive('chart', function () {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                dataset: '=',
                options: '=',
                callback: '='
            },
            link: function (scope, element, attributes) {
                var height, init, onDatasetChanged, onOptionsChanged, plot, plotArea, width;
                plot = null;
                width = attributes.width || '100%';
                height = attributes.height || '100%';
                if (!scope.dataset) {
                    scope.dataset = [];
                }
                if (!scope.options) {
                    scope.options = {
                        legend: {
                            show: false
                        }
                    };
                }
                plotArea = $(element.children()[0]);
                plotArea.css({
                    width: width,
                    height: height
                });
                init = function () {
				
                    var plotObj;
					if (scope.dataset && scope.dataset.length > 0) {
						plotObj = $.plot(plotArea, scope.dataset, scope.options);
						if (scope.callback) {
							scope.callback(plotObj);
						}
					}
                    return plotObj;
                };
                onDatasetChanged = function (dataset) {
                    if (plot) {
                        plot.setData(dataset);
                        plot.setupGrid();
                        return plot.draw();
                    } else {
                        return plot = init();
                    }
                };
                scope.$watch('dataset', onDatasetChanged, true);
                onOptionsChanged = function () {
                    return plot = init();
                };
                return scope.$watch('options', onOptionsChanged, true);
            }
        };
    });

	index.register.directive('numbersOnly', function () {
		return {
			 require: 'ngModel',
			 link: function(scope, element, attrs, modelCtrl) {
			   modelCtrl.$parsers.push(function (inputValue) {
				   // this next if is necessary for when using ng-required on your input.
				   // In such cases, when a letter is typed first, this parser will be called
				   // again, and the 2nd time, the value will be undefined
				   if (inputValue == undefined) return ''
				   var transformedInput = inputValue.replace(/[^0-9]/g, '');
				   if (transformedInput!=inputValue) {
					  modelCtrl.$setViewValue(transformedInput);
					  modelCtrl.$render();
				   }

				   return transformedInput;
			   });
			 }
		};
	});

	index.register.directive('floatOnly', function () {
		return {
			 require: 'ngModel',
			 link: function(scope, element, attrs, modelCtrl) {
			   modelCtrl.$parsers.push(function (inputValue) {
				   // this next if is necessary for when using ng-required on your input.
				   // In such cases, when a letter is typed first, this parser will be called
				   // again, and the 2nd time, the value will be undefined
				   if (inputValue == undefined) return ''
				   var transformedInput = inputValue.replace(/[^0-9.,]/g, '');

				   if (inputValue === undefined || inputValue === '') return ''

				   var reDecimalPt = /^[+-]?((\d+|\d{1,3}(\.\d{3})+)(\,\d*)?|\,\d+)$/;
				  // var reDecimalEn = /^[+-]?((\d+|\d{1,3}(\,\d{3})+)(\.\d*)?|\.\d+)$/;

				   if (!reDecimalPt.test(transformedInput)) {
					   transformedInput = transformedInput.substring(0, (transformedInput.length - 1));
				   }

				   if (transformedInput!=inputValue) {
					  modelCtrl.$setViewValue(transformedInput);
					  modelCtrl.$render();
				   }

				   return transformedInput;
			   });
			 }
		};
	});	
});
