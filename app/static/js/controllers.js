'use strict';

var superTodo = angular.module('superTodo', []);

superTodo.controller('StickersListCtrl', function($scope){
	$scope.stickers = [
		{
			"title": "The first sticker",
			"memo": "Hello! If you can read me, then the developers do something :)",
			"created": "2015-11-03",
			"folder": "root"
		},
		{
			"title": "I am a sticker number two!",
			"memo": "Memo writes here",
			"created": "2015-11-01",
			"folder": "root"
		},
		{
			"title": "St#3",
			"memo": "If you wont make the fucking report, boss will cut your balls!!!",
			"created": "2015-11-02",
			"folder": "Work"
		},
		{
			"title": "Product list",
			"memo": "",
			"created": "2015-10-30",
			"folder": "Market"
		},
		{
			"title": "Must do",
			"memo": "",
			"created": "2015-10-01",
			"folder": "root"
		}
	]

	$scope.orderProp = '!created';
});

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