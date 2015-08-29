define(['index'], function (index) {
    'use strict';
    
    index.register.factory('MenuFavorite', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/favoriteMenu');

        //Inicializa os tipos de favoritos existentes.
        factory.tasks    = [];
        factory.reports  = [];
        factory.consults = [];
        factory.cruds    = [];

        factory.addFavorite = function(isAdd, program, userName, callback) {
            if (isAdd) {
                var hasThisProgram = false;
                // Atribui ao cache o novo programa como favorito caso ele já não esteja na lista
                switch (program.prgType) {
                    case 1:
                        for (var i=0; i<this.consults.length; i++) {
                           if (this.consults[i].prg === program.prg) {
                               hasThisProgram = true;
                           }
                        }
                        if (!hasThisProgram) {
                            this.consults[this.consults.length] = program;
                        }
                        break;
                    case 2:
                        for (var i=0; i<this.cruds.length; i++) {
                           if (this.cruds[i].prg === program.prg) {
                               hasThisProgram = true;
                           }
                        }
                        if (!hasThisProgram) {
                            this.cruds[this.cruds.length] = program;
                        }                    
                        break;
                    case 3:
                        for (var i=0; i<this.reports.length; i++) {
                           if (this.reports[i].prg === program.prg) {
                               hasThisProgram = true;
                           }
                        }
                        if (!hasThisProgram) {
                            this.reports[this.reports.length] = program;
                        }                    
                        break;
                    default:
                        for (var i=0; i<this.tasks.length; i++) {
                           if (this.tasks[i].prg === program.prg) {
                               hasThisProgram = true;
                           }
                        }
                        if (!hasThisProgram) {
                            this.tasks[this.tasks.length] = program;
                        }                                   
                }
            }            
            
            var call = this.save({method: 'addFavorite', programId: program.prg, userName: userName}, {});
            processPromise(call, callback);
        }

        factory.removeFavorite = function(program, userName, callback) {
            var call = this.save({method: 'removeFavorite', programId: program.prg, userName: userName}, {});
            processPromise(call, callback);
        }

        factory.getFavorites = function(userId, callback) {
            var call = this.get({method: 'getFavorites', userId: userId}, {});
            processPromise(call, callback);
        }

        factory.isFuncFavorite = function(userId, programId, callback) {
            var call = this.get({method: 'isFuncFavorite', userId: userId, programId: programId}, {});
            processPromise(call, callback);
        }
        
        return factory;
    }]);
    
});