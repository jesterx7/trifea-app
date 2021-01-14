var app = angular.module('busApp', []);

app.config(function($routeProvider){
	$routeProvider.when('/', {
		controller: 'homeController'
	}).when('/login', {
		controller: 'LoginController'
	})
});

app.controller('LoginController', function($scope, $http){
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;

		$http({
			url: 'http://localhost/admin.bus/server.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username=' + username + '&password=' + password
		}).then(function($response){
			console.log(response.data);
		});
	}
});

app.controller('AuthController', ['$scope', function($scope){
	$username = $scope.username;
	$password = $scope.password;
}]);