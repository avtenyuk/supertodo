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
    var tasksList = this;
    $http.get('static/data/stickers.json').success(function(data) {
        $scope.stickers = $filter('filter')(data.stickers, {folder: $stateParams.id});
        $http.get('static/data/tasks.json').success(function(data) {
            angular.forEach($scope.stickers, function(item){
                item.tasks = $filter('filter')(data.tasks, {sticker: item.id});
                item.getTotalTasks = function(){
                    return item.tasks.length;
                };
                item.addTask = function(){
                    item.tasks.push({text: item.formTaskText, status: "false", id: item.id});
                    item.formTaskText = '';
                };
            });
        });
    });
    $scope.orderProp = '!created';

    $scope.changeStatus = function(){
        console.log($scope.stickers);
    };
}]);

//Folder List Controller
app.controller('FolderListCtrl', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams){
    $http.get('static/data/folders.json').success(function(data) {
        $scope.folders = data.folders;
    });
}]);

//Folder Detail Controller
app.controller('FolderDetailCtrl', ['$scope', '$http', '$location', '$stateParams', function($scope, $http, $location, $stateParams){
    $scope.id = $stateParams.id;
}]);
