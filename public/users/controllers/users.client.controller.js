angular.module('users').controller('UsersController', ['$scope',
    '$routeParams',
    '$location',
    'Authentication',
    'Users',
    function($scope, $routeParams, $location, Authentication, Users){
        
        
        
        $scope.statusChanges    =   [];
        $scope.socket = function(){
            var socket = io.connect('http://localhost:3000');    
            socket.on('userStatusChange', function(){
                    console.log('userStatusChange recieved');
                    console.log(Date.now());
                    location.reload();
            });
        }; 

        $scope.sendStatusChange = function(){
            var socket = io.connect('http://localhost:3000');
            console.log('sendStatusChange event');
            socket.emit('userStatusChange');
        };

        $scope.$on('$destroy', function(){
            socket.removeListener('chatMessage');
        });
        



        $scope.name = Authentication.user ? Authentication.user.fullName : '' ;
        $scope.authentication = Authentication.user;

        //console.log('called');
        $scope.test = "test";

        $scope.find = function(){ 
            $scope.users = Users.query();
            // console.log('Users-find');
        };


        //Search and sort on users table
        // https://scotch.io/tutorials/sort-and-filter-a-table-using-angular
        // http://fontawesome.io/cheatsheet/
        $scope.sortType     = 'name'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchText   = '';     // set the default search/filter term







        $scope.findOne = function(){
             console.log("test-findOne");
             $scope.user = Users.get({
                userId:  $routeParams.userId
            });
        };


        $scope.findOneById = function(userId){
             //console.log("test-findOne");
             Users.get({userId});
        };



        $scope.update = function (){
            console.log("test-update");
            $scope.user.$update(function(){

            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            } );
        };


        $scope.updateRedirect = function (){
            console.log("test-update");
            $scope.user.$update(function(){
                $location.path('users/' + $scope.user_id );  
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            } );
        };


        $scope.deleteRedirect = function(){
            console.log('test-delete');
            $scope.user.$delete(function(){
                $location.path('users/' + $scope.user_id);
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            } );
        };

        
  
    }
]);