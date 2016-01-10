// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngCordova', 'ui.router', 'satellizer','btford.socket-io'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.loginUrl = 'http://stuffcontrol.ddns.net:8080/rest_login/';

            // Redirect to the auth state if any other states
            // are requested other than users
  $urlRouterProvider.otherwise('/app');
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.things', {
      url: '/things',
      views: {
        'menuContent': {
          templateUrl: 'templates/things.html',
          controller: 'ThingsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/things/:ThingId',
    views: {
      'menuContent': {
        templateUrl: 'templates/thing.html',
        controller: 'ThingCtrl'
      }
    }
  })
  .state('app.sensor', {
    url: '/sensor/:ThingKey/:SensorIdentifier',
    views: {
      'menuContent': {
        templateUrl: 'templates/sensor.html',
        controller: 'SensorCtrl'
      }
    }
  })
  .state('app.controller', {
    url: '/controller/:ThingKey/:ControllerIdentifier',
    views: {
      'menuContent': {
        templateUrl: 'templates/controller.html',
        controller: 'ControllerCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/things');
});
