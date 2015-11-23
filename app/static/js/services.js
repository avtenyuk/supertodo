'use strict';

var services = angular.module('services', ['ui.router', 'HashBangURLs', 'ngResource']);

// Model Task
services.factory('Task', ['$resource', 'StorageService', function($resource, StorageService){
    var resource = $resource(
        'api/task/:id',
        {
            id: "@id",
            text: "@text",
            status: "@status",
            sticker_id: "@sticker_id"
        },
        {
            update: {
                method: 'PUT',
                params: {id: '@id', text: '@text', status: '@status', sticker_id: '@sticker_id'}
                //params: {id: '@id'}
            }
        }
    );
    angular.extend(resource, StorageService);
    return resource;
}]);

// Model Sticker
services.factory('Sticker', ['$resource', 'StorageService', function($resource, storageService){
    var resource = $resource(
        'api/sticker/:id',
        {
            id: "@id",
            title: "@title",
            memo: "@memo",
            folder_id: "@folder_id"
        },
        {
            update: {
                method: 'PUT',
                params: {id: '@id', title: '@title', memo: '@memo', folder_id: '@folder_id'}
                //params: {id: '@id'}
            }
        }
    );
    //console.log(resource);
    //resource.token = StorageService.token;
    //console.log(StorageService.token);
    //angular.extend(resource, {token: StorageService.token});
    //console.log(resource);
    resource = storageService.extend(resource);
    console.log(resource);
    return resource;
}]);

// Model Folder
services.factory('Folder', ['$resource', 'StorageService', function($resource, StorageService){
    var resource = $resource(
        'api/folder/:id',
        {
            id: "@id",
            name: "@name"
        },
        {}
    );
    angular.extend(resource, StorageService);
    return resource;
}]);

// Storage Service
services.factory('StorageService', function(){
    var storageService = {};
    var token = angular.element("input[name='csrf_token']")[0].value;
    storageService.extend = function(obj){
        obj.token = token;
        return obj;
    };
    return storageService;
    //return {
    //    token: angular.element("input[name='csrf_token']")[0].value
    //};
});