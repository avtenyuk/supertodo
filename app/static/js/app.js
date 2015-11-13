'use strict';

// Hashband URLs
angular.module('HashBangURLs', []).config(['$locationProvider', function($location) {
  $location.hashPrefix('!');
}]);

angular.module('HTML5ModeURLs', []).config(['$stateProvider', function($route) {
  $route.html5Mode(true);
}]);


// Including
var app = angular.module('app', [
    'ui.router',
    'HashBangURLs',
    'ngResource',
    'controllers',
    'services'
]);


// Routing
app.config(function($stateProvider){$stateProvider
    .state('index', {
        url: "/",
        views: {
            "view-folder-list": {
                templateUrl: "static/templates/folder-list.html",
                controller: 'FolderListCtrl'
            },
            "view-sticker-list": {
                templateUrl: "static/templates/stickers.html",
                controller: 'StickerListCtrl'
            }
        }
    })
    .state('folder', {
        url: "/folder/:id",
        views: {
            "view-folder-list": {
                templateUrl: "static/templates/folder-list.html",
                controller: 'FolderListCtrl'
            },
            "view-sticker-list": {
                templateUrl: "static/templates/stickers.html",
                controller: 'StickerListCtrl'
            }
        }
    });
});