'use strict';

var controllers = angular.module('controllers', []);

//Sticker List Controller
controllers.controller('StickerListCtrl',['$scope', '$http', '$location', '$stateParams', '$filter', 'Task', 'Sticker',
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

        //$scope.addTask = function(sticker){
        //    var new_obj = {text: sticker.formTaskText, status: "false", sticker_id: sticker.id};
        //    Task.save(new_obj, function(data){
        //        new_obj.id = data.task.id;
        //        //sticker.tasks.push(new_obj);
        //        TasksRender.tasks.add(new_obj);
        //        console.log(TasksRender.tasks);
        //        sticker.formTaskText = '';
        //    });
        //};

        //$scope.getSticker = function(id){
        //    console.log(id);
        //    return 'static/templates/tasks.html';
        //};

        //// Tasks
        //Task.get({}, function(data){
        //    angular.forEach($scope.stickers, function(sticker){
        //        sticker.tasks = $filter('filter')(data.tasks, {sticker_id: sticker.id});
        //        sticker.toggleStatus = true;
        //
        //        sticker.getTotalTasks = function(){
        //            return sticker.tasks.length;
        //        };
        //
        //        sticker.addTask = function(){
        //            var new_obj = {text: sticker.formTaskText, status: "false", sticker_id: sticker.id};
        //            Task.save(new_obj, function(data){
        //                new_obj.id = data.task.id;
        //                sticker.tasks.push(new_obj);
        //                sticker.formTaskText = '';
        //            });
        //        };
        //
        //        sticker.deleteTask = function(index){
        //            console.log(sticker.tasks[index]);
        //            Task.delete({id: sticker.tasks[index].id}, function(data){
        //                sticker.tasks.splice(index, 1);
        //            });
        //        };
        //
        //        sticker.changeStatus = function(event, task){  // Change task status
        //            task.status = task.status == "true" ? "false" : "true";
        //            Task.update({id: task.id, status: task.status});
        //        };
        //
        //        // Hide / Show ended tasks
        //        sticker.getToggleStatus = function(){
        //            if(sticker.toggleStatus){return {status: "on", title: "Hide"};}
        //            else{return {status: "off", title: "Show"};}
        //        };
        //        sticker.toggleEndedTasks = function(){
        //            if(sticker.toggleStatus) {
        //                sticker.toggleStatus = false;
        //                sticker.tasks = $filter('filter')(sticker.tasks, {status: sticker.toggleStatus});
        //            }else{
        //                sticker.toggleStatus = true;
        //                sticker.tasks = $filter('filter')(data.tasks, {sticker: sticker.id});
        //            }
        //        };
        //
        //    });
        //});

    });

    //$scope.changeStatus = function(){
    //    console.log($scope.stickers);
    //};
}]);

//Task List Controller
controllers.controller('TaskListCtrl', ['$scope', '$http', '$location', '$stateParams', '$filter', 'Task', 'Sticker',
    function($scope, $http, $location, $stateParams, $filter, Task, Sticker) {
        //console.log($scope.sticker);
        Task.get({}, function(data){
            $scope.tasks = $filter('filter')(data.tasks, {sticker_id: $scope.sticker.id});
            console.log($scope.tasks);
            $scope.toggleStatus = true;

            $scope.getTotalTasks = function(){
                return $scope.tasks.length;
            };

            $scope.addTask = function(sticker){
                console.log($scope);
                var new_obj = {text: $scope.formTaskText, status: "false", sticker_id: sticker.id};
                console.log(new_obj);
                //Task.save(new_obj, function(data){
                //    new_obj.id = data.task.id;
                //    $scope.tasks.push(new_obj);
                //    sticker.formTaskText = '';
                //});
            };

            $scope.deleteTask = function(index){
                console.log($scope.tasks[index]);
                Task.delete({id: $scope.tasks[index].id}, function(data){
                    $scope.tasks.splice(index, 1);
                });
            };

            $scope.changeStatus = function(event, task){  // Change task status
                task.status = task.status == "true" ? "false" : "true";
                Task.update({id: task.id, status: task.status});
            };

            // Hide / Show ended tasks
            $scope.getToggleStatus = function(){
                if($scope.toggleStatus){return {status: "on", title: "Hide"};}
                else{return {status: "off", title: "Show"};}
            };
            $scope.toggleEndedTasks = function(){
                if($scope.toggleStatus) {
                    $scope.toggleStatus = false;
                    $scope.tasks = $filter('filter')($scope.tasks, {status: sticker.toggleStatus});
                }else{
                    $scope.toggleStatus = true;
                    $scope.tasks = $filter('filter')(data.tasks, {sticker: sticker.id});
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
