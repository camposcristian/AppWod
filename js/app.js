var app = angular.module('starter', [
    'ionic', 
    'starter.controllers', 
    'starter.directives',
    'pascalprecht.translate'
]);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.config(function($stateProvider, $urlRouterProvider, $translateProvider, $sceProvider) {
    for(lang in translations){
        $translateProvider.translations(lang, translations[lang]);
    }
    $translateProvider.preferredLanguage('es');

    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/redirectAbstractView.html"
        })
        .state('app.home', {
            url: "/home",
            views: {
                'mainPage' :{
                    templateUrl: "templates/home.html",
                    controller: 'homeController'
                }
            }
        })
        .state('app.profile', {
            url: "/profile",
            views: {
                'mainPage' :{
                    templateUrl: "templates/profile.html",
                    controller: 'profileController'
                }
            }
        })
        .state('app.freeWOD', {
            url: "/freeWOD",
            views: {
                'mainPage' :{
                    templateUrl: "templates/freeWOD.html",
                    controller: 'freeWODController'
                }
            }
        })
        .state('app.shareProfile', {
            url: "/shareProfile",
            views: {
                'mainPage' :{
                    templateUrl: "templates/shareProfile.html",
                    controller: 'shareProfileController'
                }
            }
        })
        .state('app.configuration', {
            url: "/configuration",
            views: {
                'mainPage' :{
                    templateUrl: "templates/configuration.html",
                    controller: 'configurationController'
                }
            }
        })
        .state('app.statistics', {
            url: "/statistics",
            views: {
                'mainPage' :{
                    templateUrl: "templates/statistics.html",
                    controller: 'statisticsController'
                }
            }
        })
        .state('app.calendar', {
            url: "/calendar",
            views: {
                'mainPage' :{
                    templateUrl: "templates/calendar.html",
                    controller: 'calendarController'
                }
            }
        })
        .state('app.training', {
            url: "/training",
            views: {
                'mainPage' :{
                    templateUrl: "templates/training.html",
                    controller: 'trainingController'
                }
            }
        })
        .state('app.videoExplanation', {
            url: "/videoExplanation/:videoId",
            views: {
                'mainPage' :{
                    templateUrl: "templates/videoExplanation.html",
                    controller: 'videoExplanationController'
                }
            }
        }
    );
    $urlRouterProvider.otherwise('/app/home');
    $sceProvider.enabled(false);
});

app.factory('stadistics', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    var stadistics = {
        fetch: function() {
            var deferred = $q.defer();
            $timeout(function() {
                $http.get('../resources/stadistics.json').success(function(data) {
                    deferred.resolve(data);
                });
            }, 30);
            return deferred.promise;
        }
    }
    return stadistics;
}]);

app.factory('profileExercises', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    var exercises = {
        fetch: function() {
            var deferred = $q.defer();
            $timeout(function() {
                $http.get('../resources/exercises.json').success(function(data) {
                    deferred.resolve(data);
                });
            }, 30);
            return deferred.promise;
        }
    }
    return exercises;
}]);

app.factory('trainingExercises', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    var exercises = {
        fetch: function() {
            var deferred = $q.defer();
            $timeout(function() {
                $http.get('../resources/training.json').success(function(data) {
                    deferred.resolve(data);
                });
            }, 30);
            return deferred.promise;
        }
    }
    return exercises;
}]);