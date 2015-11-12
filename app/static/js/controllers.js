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

        // Stickers
        $scope.orderProp = '!created';

        $scope.addSticker = function(data){
            var new_obj = {title: "", memo: "", folder_id: $stateParams.id ? $stateParams.id : 1};
            Sticker.save(new_obj, function(data){
                new_obj.id = data.sticker.id;
                $scope.stickers.push(new_obj);
            });
        };

        $scope.deleteSticker = function(sticker, index){
            Sticker.delete({id: sticker.id}, function(data){
                $scope.stickers.splice(index, 1);
            });
        };

        // Tasks
        Task.get({}, function(data){
            angular.forEach($scope.stickers, function(sticker){
                sticker.tasks = $filter('filter')(data.tasks, {sticker_id: sticker.id});
                sticker.toggleStatus = true;

                sticker.getTotalTasks = function(){
                    return sticker.tasks.length;
                };

                sticker.addTask = function(){
                    var new_obj = {text: sticker.formTaskText, status: "false", sticker_id: sticker.id};
                    Task.save(new_obj, function(data){
                        new_obj.id = data.task.id;
                        sticker.tasks.push(new_obj);
                        sticker.formTaskText = '';
                    });
                };

                sticker.deleteTask = function(index){
                    console.log(sticker.tasks[index]);
                    Task.delete({id: sticker.tasks[index].id}, function(data){
                        sticker.tasks.splice(index, 1);
                    });
                };

                sticker.changeStatus = function(event, task){  // Change task status
                    task.status = task.status == "true" ? "false" : "true";
                    Task.update({id: task.id, status: task.status});
                };

                // Hide / Show ended tasks
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

            });
        });

    });

    //$scope.changeStatus = function(){
    //    console.log($scope.stickers);
    //};
}]);

////Task List Controller
//app.controller('TaskListCtrl', ['$scope', '$http', '$location', '$stateParams', 'Task',
//    function($scope, $http, $location, $stateParams, Task){
//    Task.get({}, function(data){
//        $scope.tasks = data.tasks;
//        console.log(data);
//    });
//}]);

//Folder List Controller
app.controller('FolderListCtrl', ['$scope', '$http', '$location', '$stateParams', 'Folder',
    function($scope, $http, $location, $stateParams, Folder){
    Folder.get({}, function(data){
        $scope.folders = data.folders;

        $scope.addFolder = function(data){
            var new_obj = {name: $scope.folderName};
            Folder.save(new_obj, function(data){
                new_obj.id = data.folder.id;
                $scope.folders.push(new_obj);
            });
        };

        $scope.deleteFolder = function(folder, index){
            Folder.delete({id: folder.id}, function(data){
                $scope.folders.splice(index, 1);
            });
        }

    });
}]);

//Folder Detail Controller
//app.controller('FolderDetailCtrl', ['$scope', '$http', '$location', '$stateParams', 'Folder',
//    function($scope, $http, $location, $stateParams, Folder){
//    $scope.id = $stateParams.id;
//}]);
