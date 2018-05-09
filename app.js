var app = angular.module('app', ['firebase','ui.grid', 'ui.grid.edit','ui.grid.rowEdit', 'ui.grid.cellNav']);

//firebase stuff starts here...
app.controller('MainCtrl', ['$scope', '$firebase', '$q', '$interval','uiGridConstants',
  function($scope, $firebase, $q, $interval, uiGridConstants) {

// Add Firebase db CHANGED FROM ARRAY TO USING FB PUSH IDS PER KATOS SUGGESTION
var ref = new Firebase('https://cybergigz.firebaseIO.com/drivers');

// create an AngularFire reference to the data
var sync = $firebase(ref);

// create a synchronized array for use in our HTML code
$scope.drivers = sync.$asArray();

    $scope.gridOptions = {
      enableRowSelection : true,
  		enableRowHeaderSelection : false,
  		multiSelect : false,
  		enableSorting : true,
  		enableFiltering : true,
  		enableGridMenu : true,
      data: $scope.drivers,
    };
    $scope.gridOptions.columnDefs = [
         {
            name: 'name',
            field: 'name',
            displayName: 'Name',
            enableCellEdit: true,
            enableSorting : true,
            width : 100,

          },
          {
            name: 'gender',
            displayName: 'gender',
            maxWidth: 50,
            minWidth: 50,
            width : 100,
            enableSorting : true,
          },
          {
            name: 'car',
            displayName: 'Car',
            maxWidth: 50,
            minWidth: 50,
            width : 100,
            enableSorting : true,
          },
          {
            name: 'plate',
            displayName: 'plate',
            maxWidth: 50,
            minWidth: 50,
            width : 100,
            enableSorting : true,
          }
      ];
    // };

//firebase stuff 3 way binding stuff
$scope.gridOptions.onRegisterApi = function(gridApi){

  //set gridApi on scope
  $scope.gridApi = gridApi;
  gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
};

$scope.saveRow = function( rowEntity ) {

  //Firebase save and promise return
  $scope.drivers.$save(rowEntity).then(function(ref){
    ref = $scope.drivers;
  });

  // create a fake promise - normally you'd use the promise returned by $http or $resource
  var promise = $q.defer();
  $scope.gridApi.rowEdit.setSavePromise( $scope.gridApi.grid, rowEntity, promise.promise );

  // fake a delay of 1 seconds whilst the save occurs, return error if item is empty
  $interval( function() {
    if (rowEntity === '' ){
      promise.reject();
    } else {
        promise.resolve();
      }
    }, 1000, 1);

};
//end of firebase stuff

  }
]);
