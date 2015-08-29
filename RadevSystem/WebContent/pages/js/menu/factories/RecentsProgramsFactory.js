define(['index'], function (index) {
    'use strict';

    index.register.factory('RecentsPrograms', ['$rootScope', '$resource', 'ResourceLoaderService', function ($rootScope, $resource, ResourceLoaderService) {
        var factory = ResourceLoaderService.loadDefaultResources('resources/recents/:methodName');

        factory.tasks = [];
        factory.reports = [];
        factory.consults = [];
        factory.cruds = [];

        factory.getUserRecents = function(userName, callback) {
            var call = this.get({methodName: 'getUserRecents', userName: userName}, {});
            processPromise(call, callback);
        }

        factory.addRecent = function(userName, program, callback) {
            var hasThisProgram = false;
            // Atribui ao cache o novo programa como recente caso ele já não esteja na lista
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
                    break;                    
            }
            
            var call = this.save({methodName: 'addRecent', userName: userName, programId: program.prg}, {});
            processPromise(call, callback);
        }
        
        return factory;
    }]);
    
});