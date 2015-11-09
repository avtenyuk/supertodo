'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider){
    $stateProvider
        .state('index', {
            url: "#/",
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
            url: "#/folder/:id",
            views: {
                "view-folder-list": {
                    templateUrl: "static/templates/folder-list.html",
                    controller: 'FolderDetailCtrl'
                },
                "view-sticker-list": {
                    templateUrl: "static/templates/stickers.html",
                    controller: 'StickerListCtrl'
                }
            }
        })
});





//var superTodo = angular.module('superTodo', ['ngRoute']);

//Router
//superTodo.config(['$routeProvider', function($routeProvider){
//    $routeProvider
//    .when('/', {
//        templateUrl: 'static/templates/home.html',
//        controller: 'HomeCtrl'
//    })
//    .when('/about', {
//        templateUrl: 'static/templates/about.html',
//        controller: 'AboutCtrl'
//    })
//    .when('/stickers', {
//        templateUrl: 'static/templates/stickers.html',
//        controller: 'StickerListCtrl'
//    })
////    .when('/folder/', {
////        templateUrl: 'static/templates/folder-list.html',
////        controller: 'FolderListCtrl'
////    })
//    .when('/folder/:id', {
//        templateUrl: 'static/templates/folder-list.html',
//        controller: 'FolderListCtrl'
//    })
//    .otherwise({
//        redirectTo: '/'
//    });
//}]);


////Home Controller
//superTodo.controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
//    $http.get('static/data/folders.json').success(function(data) {
//        console.log(data);
//        $scope.folders = data;
//    });
////    $http.get('api/v1.0/stickers').success(function(data) {
////        $scope.stickers = data.stickers;
////    });
//}]);
//
////About Controller
//superTodo.controller('AboutCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
//    console.log($location.hash);
//}]);
//
//Sticker List Controller
app.controller('StickerListCtrl',['$scope', '$http', function($scope, $http) {
    $http.get('static/data/stickers.json').success(function(data) {
        $scope.stickers = data.stickers;
    });
    $scope.orderProp = '!created';

//    $http.get('static/data/folders.json').success(function(data) {
//        $scope.folders = data.folders;
//    });
}]);
//
//Folder List Controller
app.controller('FolderListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $http.get('static/data/folders.json').success(function(data) {
        $scope.folders = data.folders;
    });
}]);

//Folder Detail Controller
app.controller('FolderDetailCtrl', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams){
    console.log($stateParams);
    $scope.id = $stateParams.id;
}]);




//superTodo.controller('FoldersListCtrl', function($scope){
//	$scope.folders = [
//		{
//            "id": 1,
//			"name": "default",
//			"user": "user"
//		},
//		{
//            "id": 2,
//			"name": "home",
//			"user": "user"
//		},
//		{
//            "id": 3,
//			"name": "work",
//			"user": "user"
//		}
//	]
//});