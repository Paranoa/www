// var services= angular.module('MyFirstServices',['ngResource'])
app.factory('PhoneService',['$http',function($http){

	var queryData = function(id){
		console.log('query-id: '+id);
		return $http.get('/WWW/public/data/data.json')
	}

	return {
		query: function(id){
			return queryData(id);
		},	
		list: function(){
			return queryData();
		}
	}
}]);
