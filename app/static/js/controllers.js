'use strict';

angular.module('HashBangURLs', []).config(['$locationProvider', function($location) {
  $location.hashPrefix('!');
}]);

angular.module('HTML5ModeURLs', []).config(['$stateProvider', function($route) {
  $route.html5Mode(true);
}]);

var app = angular.module('app', ['ui.router', 'HashBangURLs', 'ngResource']);

app.factory('Task', ['$resource', function($resource){
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

app.factory('Sticker', ['$resource', function($resource){
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

app.factory('Folder', ['$resource', function($resource){
    return $resource(
        'api/folder/:id',
        {
            id: "@id",
            name: "@name"
        },
        {}
    );
}]);


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
app.controller('StickerListCtrl',['$scope', '$http', '$location', '$stateParams', '$filter', 'Task', 'Sticker',
    function($scope, $http, $location, $stateParams, $filter, Task, Sticker) {
    Sticker.get({}, function(data){
        $scope.stickers = $filter('filter')(data.stickers, {folder_id: $stateParams.id});
        Task.get({}, function(data){
            angular.forEach($scope.stickers, function(sticker){
                sticker.tasks = $filter('filter')(data.tasks, {sticker_id: sticker.id});
                sticker.toggleStatus = true;
                sticker.getTotalTasks = function(){
                    return sticker.tasks.length;
                };
                sticker.addTask = function(){
                    sticker.tasks.push({text: sticker.formTaskText, status: "false", id: sticker.id});
                    Task.save({
                        sticker_id: sticker.id,
                        text: sticker.formTaskText,
                        status: false
                    }, function(data){
                        sticker.formTaskText = '';
                    });
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
                    task.status = task.status == "true" ? "false" : "true";
                    Task.update({id: task.id, status: task.status});
                    //var task_obj = Task.get({id: task.id}, function(data){
                    //    task_obj.$update({status: task.status});
                    //});
                    //Sticker.update({id: sticker.id, title: sticker.title});
                };
                sticker.deleteTask = function(event, task){
                    Task.delete({id: task.id}, function(data){
                        sticker.tasks.pop();
                    });
                };
                //sticker.deleteSticker = function(event, sticker){
                //    Sticker.delete({id: sticker.id}, function(data){
                //        sticker.remove
                //    });
                //}
            });
        });
    });
    $scope.orderProp = '!created';

    $scope.changeStatus = function(){
        console.log($scope.stickers);
    };
}]);

//Folder List Controller
app.controller('FolderListCtrl', ['$scope', '$http', '$location', '$stateParams', 'Folder',
    function($scope, $http, $location, $stateParams, Folder){
    Folder.get({}, function(data){
        $scope.folders = data.folders;
    });
}]);

//Folder Detail Controller
//app.controller('FolderDetailCtrl', ['$scope', '$http', '$location', '$stateParams', 'Folder',
//    function($scope, $http, $location, $stateParams, Folder){
//    $scope.id = $stateParams.id;
//}]);
