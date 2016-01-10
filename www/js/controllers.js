angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope,$auth, $ionicModal, $state, $http, $location) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.order = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
   $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $auth.login($scope.loginData).then(function(data) {
        $scope.username = data['username']
        $scope.modal.hide();
         $http
      .get('http://stuffcontrol.ddns.net:8080/rest_get_things/')
      .success(function (data, status, headers, config){
        $scope.things = data;
      })
      });

    };
})


.controller('ThingsCtrl', function($scope, $http, $state, socket, $cordovaToast) {
  $scope.doRefresh = function() {
      $http
      .get('http://stuffcontrol.ddns.net:8080/rest_get_things/')
      .success(function (data, status, headers, config){
        $scope.things = data;
        var things = []
        for( var i = 0; i < $scope.things.length; i++ ){
          things.push($scope.things[i].key);
        }

        socket.emit('joinserver',$scope.username,'user',things);

        socket.on('isconected', function(thing,value){
          if(value){
            document.getElementById(thing).className = " green icon ion-disc";
          }
          else{
            document.getElementById(thing).className = " red icon ion-close-circled";
          }
        });  
      })
      .error(function (data, status, headers, config) {
        $cordovaToast.showLongCenter('No se han podido recargar los datos')
      })
      .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });

  }

  $http
      .get('http://stuffcontrol.ddns.net:8080/rest_get_things/')
      .success(function (data, status, headers, config){
        $scope.things = data;
        var things = []
        for( var i = 0; i < $scope.things.length; i++ ){
          things.push($scope.things[i].key);
        }

        socket.emit('joinserver',$scope.username,'user',things);

        socket.on('isconected', function(thing,value){
          if(value){
            document.getElementById(thing).className = " green icon ion-disc";
          }
          else{
            document.getElementById(thing).className = " red icon ion-close-circled";
          }
        });  
      })
      .error(function (data, status, headers, config) {
        $scope.modal.show();
      })
})

.controller('ThingCtrl', function($scope, $stateParams, $http, $cordovaToast, socket) {
$scope.$on( "$ionicView.enter", function( scopes, states ) {
            screen.lockOrientation('portrait');
            $cordovaToast.showLongCenter('Funciona!!')
        });
  setTimeout(function(){ 
        toaster.pop('success', "title", "text");
        console.log('FUNCIONA');
      }, 1000);

  $http.get('http://stuffcontrol.ddns.net:8080/rest_get_thing_elements/'+$stateParams['ThingId'])
      .success(function (data, status, headers, config){
        console.log(data);
        $scope.thing_details = data;

      }) 
})
.controller('SensorCtrl', function($scope, $stateParams,$http,$window, socket) {

  screen.lockOrientation('landscape');
 var chart= new Highcharts.Chart({
        chart: {
            renderTo: 'chart_time',
            defaultSeriesType: 'spline'
        },
        rangeSelector : {
            selected : 100
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: $stateParams.SensorIdentifier,
                margin: 80
            }
        },
        series: [{
            name: $stateParams.SensorIdentifier,
            data: []
        }]
    });
   socket.on('sensor_values', function (identifier, value) {
      if(identifier === $stateParams.SensorIdentifier){
          var series = chart.series[0];
          var date = new Date().getTime();
          date = date +3600000*2;
          series.addPoint([date, value]);
      }
    });


})
.controller('ControllerCtrl', function($scope, $stateParams,$http, socket) {
   $scope.SendAction = function() {
    data = {
      key: $stateParams.ThingKey,
      value: $scope.order.order,
      identifier: $stateParams.ControllerIdentifier
    }
    console.log(data)
    $http.post('http://stuffcontrol.ddns.net:8080/rest_order_controller/', data)
      .success(function (data, status, headers, config){

      });
   }

});