angular.module ('login-dir',[])
.directive('login', [function() {
  var hide = "hide";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$focused = false;
      var container = document.getElementById("loginheader");
      var ang_container = angular.element(container);
      element.bind('focus', function(evt) {
        ang_container.addClass(hide);
        scope.$apply(function() {ctrl.$focused = true;});
      }).bind('blur', function(evt) {
        ang_container.removeClass(hide);
        scope.$apply(function() {ctrl.$focused = false;});
      });
    }
  }
}]);