var app = angular.module('routeApp',['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/phones',{
		templateUrl:'ng/list.html',
		controller:'listCtrl'
	})
	.when('/phones/:id',{
		templateUrl:'ng/phoneDetail.html',
		controller:'detailCtrl'
	})
	.otherwise({redirectTo: '/'});
}]);

