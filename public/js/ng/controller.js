app.controller('listCtrl',['$scope','PhoneService',function($scope,PhoneService){
	PhoneService.list().success(function(data){
		$scope.phones = data;
	});
}]);

app.controller('detailCtrl',['$scope','$routeParams','PhoneService',function(
	$scope,$routeParams,PhoneService){
	PhoneService.query($routeParams.id*1).success(function(data){
		$scope.phone = data[$routeParams.id*1-1];
	});
}]);

