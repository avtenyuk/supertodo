'use strict'

/* App Module */

var superTodo = angular.module('superTodo', [
    'ngRoute',
    'superTodoControllers'
]);

superTodo.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
            when('/', {
                templateUrl: 'index.html',
                controller: 'StickersListCtrl'
            }).
            when('/sticker/:id', {
                templateUrl: 'detail.html',
                controller: 'StickersDetailCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);