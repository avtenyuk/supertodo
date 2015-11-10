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
            angular.forEach($scope.stickers, function(sticker){
                sticker.tasks = $filter('filter')(data.tasks, {sticker: sticker.id});
                sticker.toggleStatus = true;
                sticker.getTotalTasks = function(){
                    return sticker.tasks.length;
                };
                sticker.addTask = function(){
                    sticker.tasks.push({text: sticker.formTaskText, status: "false", id: sticker.id});
                    sticker.formTaskText = '';
                };
                sticker.getToggleStatus = function(){
                    if(sticker.toggleStatus){return {status: "on", title: "Hide"};}
                    else{return {status: "off", title: "Show"};}
                };
                sticker.toggleEndedTasks = function(){
                    if(sticker.toggleStatus) {
                        sticker.toggleStatus = false;
                        sticker.tasks = $filter('filter')(sticker.tasks, {status: sticker.toggleStatus});
                    }else{
                        sticker.toggleStatus = true;
                        sticker.tasks = $filter('filter')(data.tasks, {sticker: sticker.id});
                    }
                };
                sticker.changeStatus = function(event, task){
                    console.log(event.currentTarget, task);
                    console.log("PUT query to change task`s state");
                }
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
