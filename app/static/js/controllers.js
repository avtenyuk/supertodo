'use strict';

var controllers = angular.module('controllers', []);

//Sticker List Controller
controllers.controller('StickerListCtrl',['$scope', '$http', '$location', '$stateParams', '$filter', 'Task', 'Sticker',
    function($scope, $http, $location, $stateParams, $filter, Task, Sticker) {
    Sticker.get({}, function(data){
        $scope.stickers = $filter('filter')(data.stickers, {folder_id: $stateParams.id});
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

        $scope.saveSticker = function(sticker, index){
            var updatedData = {id: sticker.id, title: sticker.updatedTitle, memo: sticker.updatedMemo};
            Sticker.update(updatedData, function(data){
                $scope.stickers[index].title = updatedData.title;
                $scope.stickers[index].memo = updatedData.memo;
                sticker.mode = false;
            });
        };

        $scope.makeNotification = function(sticker){
            console.log('Makin notification for sticker with id ' + sticker.id);
        };
    });
}]);

//Task List Controller
controllers.controller('TaskListCtrl', ['$scope', '$http', '$location', '$stateParams', '$filter', 'Task', 'Sticker',
    function($scope, $http, $location, $stateParams, $filter, Task, Sticker) {
        Task.get({}, function(data){
            $scope.tasks = $filter('filter')(data.tasks, {sticker_id: $scope.sticker.id});

            $scope.getTotalTasks = function(){
                return $scope.tasks.length;
            };

            $scope.addTask = function(sticker){
                var new_obj = {text: $scope.tasks.formTaskText, status: "false", sticker_id: sticker.id};
                Task.save(new_obj, function(data){
                    new_obj.id = data.task.id;
                    $scope.tasks.push(new_obj);
                    $scope.tasks.formTaskText = '';
                });
            };

            $scope.deleteTask = function(index){
                Task.delete({id: $scope.tasks[index].id}, function(data){
                    $scope.tasks.splice(index, 1);
                });
            };

            $scope.changeStatus = function(event, task){  // Change task status
                task.status = task.status == "true" ? "false" : "true";
                Task.update({id: task.id, status: task.status});
            };

            // Hide / Show ended tasks
            $scope.toggleStatus = true;
            $scope.getToggleStatus = function(){
                if($scope.toggleStatus){return {status: "on", title: "Hide"};}
                else{return {status: "off", title: "Show"};}
            };
            $scope.toggleEndedTasks = function(){
                if($scope.toggleStatus) {
                    $scope.toggleStatus = false;
                    $scope.tasks = $filter('filter')($scope.tasks, {status: $scope.toggleStatus});
                }else{
                    $scope.toggleStatus = true;
                    $scope.tasks = $filter('filter')(data.tasks, {sticker_id: $scope.sticker.id});
                }
            };
        });
    }
]);

//Folder List Controller
controllers.controller('FolderListCtrl', ['$scope', '$http', '$location', '$stateParams', 'Folder',
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
