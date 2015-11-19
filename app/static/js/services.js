'use strict';

var services = angular.module('services', ['ui.router', 'HashBangURLs', 'ngResource']);

// Model Task
services.factory('Task', ['$resource', function($resource){
    return $resource(
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
}]);

// Model Sticker
services.factory('Sticker', ['$resource', function($resource){
    return $resource(
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
}]);

// Model Folder
services.factory('Folder', ['$resource', function($resource){
    return $resource(
        'api/folder/:id',
        {
            id: "@id",
            name: "@name"
        },
        {}
    );
}]);

//// Render Tasks Service
//services.factory('StickerData', function(){
//    var stickers = {};
//
//});