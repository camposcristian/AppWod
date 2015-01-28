var app = angular.module('starter.directives', []);

app.directive('disableTap', ['$timeout', function($timeout) {
 	return {
  		link: function() {
   			$timeout(function() {
    			var tab = document.getElementsByClassName('fc-widget-content');
			    for (i = 0; i < tab.length; ++i) {
     				tab[i].setAttribute('data-tap-disabled', 'true');
     				console.log(tab[i]);
    			}
   			}, 500);
  		}
 	};
}]);