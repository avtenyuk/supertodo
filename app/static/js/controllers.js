'use strict';

angular.module('HashBangURLs', []).config(['$locationProvider', function($location) {
  $location.hashPrefix('!');
}]);

angular.module('HTML5ModeURLs', []).config(['$stateProvider', function($route) {
  $route.html5Mode(true);
}]);

var app = angular.module('app', ['ui.router', 'HashBangURLs']);

app.config(function($stateProvider){
    $stateProvider
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
        })
});


//Sticker List Controller
app.controller('StickerListCtrl',['$scope', '$http', '$location', '$stateParams', '$filter', function($scope, $http, $location, $stateParams, $filter) {
    //console.log($location);
    //console.log($stateParams);
    //console.log($filter);
    $http.get('static/data/stickers.json').success(function(data) {
        $scope.stickers = $filter('filter')(data.stickers, {folder: $stateParams.id});
    });
    $scope.orderProp = '!created';
}]);

//Folder List Controller
app.controller('FolderListCtrl', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams){
    //console.log($stateParams);
    $http.get('static/data/folders.json').success(function(data) {
        $scope.folders = data.folders;
    });
}]);

//Folder Detail Controller
app.controller('FolderDetailCtrl', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams){
    //console.log($stateParams);
    $scope.id = $stateParams.id;
}]);
