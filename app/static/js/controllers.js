'use strict';

var superTodo = angular.module('superTodo', []);

 superTodo.controller(
 	'StickersListCtrl',
 	[
 		'$scope',
 		'$http',
 		function($scope, $http) {
   			$http.get('api/v1.0/stickers').success(function(data) {
     			$scope.stickers = data.stickers;
   			});

  		 	$scope.orderProp = '!created';
 		}
 	]
 );

superTodo.controller('FoldersListCtrl', function($scope){
	$scope.folders = [
		{
			"name": "root",
			"user": "user"
		},
		{
			"name": "Work",
			"user": "user"
		},
		{
			"name": "Market",
			"user": "user"
		}
	]
});