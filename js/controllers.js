var app = angular.module('starter.controllers', [
    'ui.calendar', 
    'ui.bootstrap',
    'ngCordova'
]);


Date.prototype.getDayName = function() {
    var d = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    return d[this.getDay()];
}

app.controller('homeController', ['$scope', function($scope) {
    $scope.mainmenu = [
        {
            id: 'profile', 
            icon: 'icon-menu-profile'
        },
        {
            id: 'freeWOD', 
            icon: 'icon-menu-free-wod'
        },
        {   
            id: 'training', 
            icon: 'icon-menu-training'
        },
        {   
            id: 'travelWOD', 
            icon: 'icon-menu-travel-wod'
        },
        {   
            id: 'calendar', 
            icon: 'icon-menu-calendar'
        },
        {   
            id: 'configuration', 
            icon: 'icon-menu-config'
        }
    ];
}]);

app.controller('profileController', ['$scope', '$location', 'profileExercises', '$cordovaCamera', function($scope, $location, profileExercises, $cordovaCamera) {
    $scope.pageTitle = 'profile'; 
    $scope.beginAngularBracket = '> '
    $scope.endAngularBracket = ' <';
    $scope.iconHeader = 'user-human-title';
    
    if (!window.localStorage['imageURI']) {
        window.localStorage['imageURI'] = './img/iconsSVG/Perfil gris.svg';
        $scope.imageURI = './img/iconsSVG/Perfil gris.svg';
    } else {
        $scope.imageURI = window.localStorage['imageURI'];
    }
    window.localStorage['measurement'] === 'true' ? $scope.measurementProfile = 'kg' : $scope.measurementProfile = 'lb'; /* True significa que es kg, false significa que es lb */
    console.log(window.localStorage['measurement']);
    

    $scope.usuario = [];
    $scope.usuario.nombre = "";
    $scope.usuario.pais = "arg";
    $scope.usuario.flag = "country-arg";
    $scope.usuario.nivel = "";
    $scope.usuario.club = "Crossfit Argos";
    $scope.usuario.localizacionClub = "Buenos Aires";


    $scope.isNombreApellidoCompleted = function() {
        return angular.isDefined($scope.usuario.nombre) && $scope.usuario.nombre !== "";
    };

    $scope.show = function ( path ) {
        $location.path( '/app' + path );
    };

    profileExercises.fetch().then(function(data) {
        $scope.exercises = data;
    });

    $scope.getPicture = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };
        $cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.ImageURI = "data:image/jpeg;base64," + imageURI;
            window.localStorage['imageURI'] = "data:image/jpeg;base64," + imageURI;
        });
    }
}]);

app.controller('freeWODController', ['$scope', '$location', 'trainingExercises', function($scope, $location, trainingExercises) {
    $scope.pageTitle = 'WOD Libre';
    $scope.iconHeader = 'config-red';
    trainingExercises.fetch().then(function(data) {
        $scope.training = data;
    });

    $scope.show = function ( path ) {
        $location.path( '/app' + path );
    };

    var hour = 0, minute = 0, second = 0, tenthSecond = 0;
    $scope.timeChronometer = '00:00';
    $scope.stopped = true;
    $scope.vueltas = 0;
    var stop;

    $scope.startChronometer = function () {
        if (angular.isDefined(stop)) return;
        stop = $interval(chronometer, 10);
        $scope.stopped = false;
    }

    var chronometer = function () {
        if ($scope.stopped == false) {
            tenthSecond++;
            if (tenthSecond > 99) {
                tenthSecond = 0;
                second++;
            }
            if (second > 59) {
                second = 0;
                minute++;
            }
            if (minute > 59) {
                minute = 0;
                hour++;
            }
            $scope.showChronometer();
        }
    }

    $scope.showChronometer = function () {
        timeChronometerView = ((minute < 10) ? "0" + minute : minute) + ':';
        timeChronometerView += ((second < 10) ? "0" + second : second) + ':';
        timeChronometerView += (tenthSecond < 10) ? "0" + tenthSecond : tenthSecond;
        $scope.timeChronometer = timeChronometerView;
    }

    $scope.stopChronometer = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
            $scope.stopped = true;
            $scope.vueltas++;
            $scope.cleanChronometer();
        }
    }

    $scope.cleanChronometer = function () {
        hour = minute = second = tenthSecond = 0;
        $scope.showChronometer();
    }
}]);

app.controller('configurationController', ['$scope', '$location', '$translate', function($scope, $location, $translate) {
    $scope.pageTitle = 'configuration';
    $scope.iconHeader = 'configuration-white';
    
    if (!window.localStorage['language']) {
        window.localStorage['language'] = "es";  
        $scope.language = "es";
    } else {
        $scope.language = window.localStorage['language'];
    }
    if (!window.localStorage['measurement']) {
        window.localStorage['measurement'] = "true";
        $scope.measurement = true; /* True significa que es kg, false significa que es lb */
    } else {
        $scope.measurement = Boolean(window.localStorage['measurement']); /* True significa que es kg, false significa que es lb */
    }
    if (!window.localStorage['help']) {
        window.localStorage['help'] = "true";
        $scope.help = true;
    } else {
        $scope.help = Boolean(window.localStorage['help']);
    }
    
    $scope.show = function ( path ) {
        $location.path( '/app' + path );
    };

    $scope.changeMeasurement = function() {
        $scope.measurement = !$scope.measurement;
        window.localStorage['measurement'] = $scope.measurement;
    }

    $scope.changeHelp = function() {
        $scope.help = !$scope.help;
        window.localStorage['help'] = $scope.help;
    }

    $scope.changeLanguage = function(){
        $translate.use($scope.language);
        window.localStorage['language'] = $scope.language;
    }
}]);

app.controller('statisticsController', ['$scope', 'stadistics', '$location', function($scope, stadistics, $location) {
    $scope.pageTitle = 'estadísticas';
    $scope.iconHeader = 'statistics-red-background';

    stadistics.fetch().then(function(data) {
        $scope.sports = data;
    });

    $scope.show = function ( path ) {
        $location.path( '/app' + path );
    };
}]);

app.controller('videoExplanationController', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
    this.video = "http://www.youtube.com/embed/" + $stateParams.videoId + "?autoplay=true";
}]);

app.controller('calendarController', ['$scope', function($scope) {

    $scope.pageTitle = 'calendario';
    $scope.iconHeader = 'calendar-white';

    $scope.monthArray = {1: 'Enero',2: 'Febrero',3: 'Marzo',4: 'Abril',5: 'Mayo',6: 'Junio',7: 'Julio',8: 'Agosto',9: 'Septiembre',10: 'Octubre',11: 'Noviembre',12: 'Diciembre'};

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.month = m;
    $scope.year = y;
    
    /*
    $scope.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    */

    $scope.previousEntries = function(){
        $scope.myCalendar.fullCalendar('prev');
        if($scope.month === 1) {
            $scope.year = $scope.year - 1;
            $scope.month = 12;
        } else {
            $scope.month = $scope.month -1;
        }
    };
  
    $scope.nextEntries = function(){
        $scope.myCalendar.fullCalendar('next');
        if($scope.month === 12) {
            $scope.year = $scope.year + 1;
            $scope.month = 1;
        } else {
            $scope.month = $scope.month + 1;
        }
    };
  
    $scope.todayEntries = function(){
        $scope.myCalendar.fullCalendar('today');
        $scope.month = date.getMonth();
        $scope.year = date.getFullYear();
    };

    var tempVar = "";

    $scope.dayClick = function(){
        // change the day's background color just for fun
        if (tempVar == "")
        {
            $(this).css('background-color', '#E60000 !important');
            $(this).css('color', '#FFFFFF !important');
            $(this).css('border-radius', '10px');
            tempVar = this;
        }
        else
        {
            $(this).css('background-color', '#E60000 !important');
            $(this).css('color', '#FFFFFF !important');
            $(this).css('border-radius', '10px');

            $(tempVar).css('background-color', '#FFFFFF !important');
            tempVar = this;
        }
    };

    $scope.events=[];

    $scope.initCalendar = function() {
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: false,
                header: false,
                events:[],
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                dayClick: $scope.dayClick,
            }
        };
        $scope.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lu", "Ma", "Mié", "Jue", "Vie", "Sá"];
        $scope.eventSources = $scope.events;
    }
}]);

app.controller('trainingController', ['$scope', '$location', '$interval', 'trainingExercises', function($scope, $location, $interval, trainingExercises) {
    $scope.pageTitle = 'Entrenamiento';
    $scope.iconHeader = 'icon-top-menu-training';
    trainingExercises.fetch().then(function(data) {
        var today = new Date();
        var todayName = today.getDayName();
        var i = 0;
        var j = 0;
        var k;
        $scope.training = [];
        for(i; i < data.length; i++) {
            if (data[i].day.toLowerCase() === todayName.toLowerCase() && i >= 2) {
                k = i-2;
                for(k; k < data.length; k++) {
                    $scope.training.push(data[k]);
                }
                for(j; j < i-2; j++) {
                    $scope.training.push(data[j]);
                }
                return;
            }
        }
    });

    $scope.show = function ( path ) {
        $location.path( '/app' + path );
    };

    $scope.groups = [];
    for (var i = 0; i < 10; i++) {
        $scope.groups[i] = {
            name: i,
            items: []
        };
        for (var j = 0; j < 3; j++) {
            $scope.groups[i].items.push(i + '-' + j);
        }
    }

    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };

    $scope.isActiveDay = function (day) {
        var today = new Date();
        var todayName = today.getDayName();
        return todayName.toLowerCase() === day.toLowerCase();
    }
}]);

app.controller('shareProfileController', ['$scope', '$location', function($scope, $location) {
    $scope.pageTitle = 'profile'; 
    $scope.beginAngularBracket = '> ';
    $scope.endAngularBracket = ' <';
    $scope.iconHeader = 'user-human-title';
    $scope.imageURI = './img/iconsSVG/Perfil gris.svg';
    
    $scope.usuario = [];
    
    $scope.usuario.flag = "arg-flag";
    $scope.usuario.nivel = "Crossfitter Nivel Intermedio";
    $scope.usuario.club = "Crossfit Argos";

    $scope.show = function ( path ) {
        $location.path( '/app' + path );
    };

    $scope.next = function() {
        $scope.$broadcast('slideBox.nextSlide');
    };

    $scope.previous = function() {
        $scope.$broadcast('slideBox.prevSlide');
    };
}]);
