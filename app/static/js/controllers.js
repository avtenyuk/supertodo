'use strict';

//var superTodoControllers = angular.module('superTodoControllers', []);
//
//superTodo.controller('StickersListCtrl', ['$scope', '$http',
//		function($scope, $http) {alert("ta-dam");
//			//$http.get('static/data/stickers.json').success(function(data) {
//			//	$scope.stickers = data;
//			//});
//
//			$scope.orderProp = '!created';
//		}
//	]
//);

//superTodoControllers.controller('StickersListCtrl', function($scope){alert("ta-dam");
//	$scope.stickers = [
//		{
//			"title": "The first sticker",
//			"memo": "Hello! If you can read me, then the developers do something :)",
//			"created": "2015-11-03",
//			"folder": "root"
//		},
//		{
//			"title": "I`m a sticker number two!", //And you must to do!
//			"memo": "Memo writes here",
//			"created": "2015-11-01",
//			"folder": "root"
//		},
//		{
//			"title": "St#3",
//			"memo": "If you wont make the fucking report, boss will cut your balls!!!",
//			"created": "2015-11-02",
//			"folder": "Work"
//		},
//		{
//			"title": "Product list",
//			"memo": "",
//			"created": "2015-10-30",
//			"folder": "Market"
//		},
//		{
//			"title": "Must do",
//			"memo": "",
//			"created": "2015-10-01",
//			"folder": "root"
//		}
//	];
//
//	$scope.orderProp = '!created';
//});

//superTodoControllers.controller('FoldersListCtrl', function($scope){
//	$scope.folders = [
//		{
//			"name": "root",
//			"user": "user"
//		},
//		{
//			"name": "Work",
//			"user": "user"
//		},
//		{
//			"name": "Market",
//			"user": "user"
//		}
//	];
//});
//
//superTodoControllers.controller('StickersDetailCtrl', function($scope, $routeParams){
//	$scope.id = $routeParams.id;
//});

var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvide){
	$routeProvide
		.when('/stickers', {
			templateUrl: 'static/templates/stickers.html',
			controller: 'StickersCtrl'
		})
		.otherwise({
			redirectTo: '/stickers'
		});
}]);

app.controller('StickersCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
	console.log($location.url());
}]);