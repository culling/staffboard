angular.module('users').factory('Users', ['$resource', 
function($resource){
    //return $resource('/api/users');
    return $resource('/api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }   
    });
}]);