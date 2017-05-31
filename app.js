var officeJson = [];


if (typeof localStorage !== 'undefined') {
    if (typeof window.localStorage['office'] !== 'undefined'){
        officeJson = JSON.parse(window.localStorage['office']);
        console.log('getFromLocal');
        console.log(localStorage);
        var officeApp = angular.module('officeApp', ['ngRoute']);
        angular.element(document).ready(function() {
            angular.bootstrap(document, ["officeApp"]);
        });
        startIt(officeApp);
    }
    else {
        console.log('goto URL');
        getJSON('http://bashintrade.com/office.php',
        function(err, data) {
            if (err != null) {
                alert('Something went wrong: ' + err);
            } else {
                console.log(data);
                window.localStorage['office'] = angular.toJson(data);
                officeJson = JSON.parse(window.localStorage['office']);
                console.log(localStorage);
                var officeApp = angular.module('officeApp', ['ngRoute']);
                angular.element(document).ready(function() {
                    angular.bootstrap(document, ["officeApp"]);
                });
                startIt(officeApp);
            }
        });
    }
} else {
    // localStorage not defined
    console.log('localStorage not defined');
}

console.log(officeJson);


function startIt(officeApp){

console.log(officeApp);

officeApp.config( function($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/departments/:departmentId', {
        templateUrl: 'department.html',
        controller: 'departmentController'
    })
    .when('/employees/:employeeId', {
        templateUrl: 'employee.html',
        controller: 'employeeController'
    })
    .otherwise({
        redirectTo: '/'
    });
});


officeApp.controller("officeController", function ($scope) {
    $scope.departments = officeJson.departments;
});

officeApp.controller("employeeController", function ($scope, $routeParams) {
    officeJson.employees.forEach(function(item){
        if(item.id==$routeParams.employeeId){
            $scope.employee = item;
        }
    });

    officeJson.departments.forEach(function(item){
        if(item.id==$scope.employee.department){
            $scope.departmentName = item.name;
        }
    });

    officeJson.photos.forEach(function(item){
        if(item.id==$scope.employee.photo){
            $scope.employeePhoto = item.data;
        }
    });
});

officeApp.controller("departmentController", function ($scope, $routeParams, $http) {
    $scope.params = $routeParams;
    $scope.employees = officeJson.employees;
    var i = 0;
    officeJson.employees.forEach(function(item){
        if(item.department==$routeParams.departmentId) i++;
    });
    $scope.employeesInDepartment = i;
});



}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };
    xhr.send();
};
