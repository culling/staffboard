angular.module('users').config(['$routeProvider', 
    function($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl:    'users/views/list-users.client.view.html'
            })
            .when('/#!/users', {
                templateUrl:    'users/views/list-users.client.view.html'
            })
            .when('/users/:userId/edit', {
                templateUrl:    'users/views/edit-users.client.view.html'
            })
            .otherwise({
                redirectTo:     '/'
            });
    }
]);