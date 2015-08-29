define(['index'], function (index) {
    'use strict';

    index.register.factory('MenuPrograms', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/programMenu');

        factory.tasks = [];
        factory.reports = [];
        factory.consults = [];
        factory.cruds = [];

        factory.getPrograms = function(moduleId, favorites, recents, search, tipPrograms, grpApplications, callback) {
            var call = this.get({method: 'getPrograms', moduleId: moduleId, favorites: favorites, recents: recents, search: search, tipPrograms: tipPrograms, grpApplications: grpApplications}, {});
            processPromise(call, callback);
        }
        
        factory.findFunctionalityById = function(programId, callback) {
            var call = this.get({method: 'findFunctionalityById', programId: programId}, {});
            processPromise(call, callback);
        }
        
        factory.getProgramById = function(programId, callback) {
            var call = this.get({method: 'getProgramById', programId: programId}, {});
            processPromise(call, callback);
        }

        factory.getProcessProgram = function(idiProcess, callback) {
            var call = this.get({method: 'getProcessPrograms', idiProcess: idiProcess}, {});	
            processPromise(call, callback);
        }
        
        factory.findProgramIdByNomProgExt = function(nomProgExt, callback) {
            var call = this.get({method: 'findProgramIdByNomProgExt', nomProgExt: nomProgExt}, {});	
            processPromise(call, callback);
        }
		
        return factory;
    }]);
    
});