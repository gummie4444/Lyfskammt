angular.module('mobiscroll-dir', [])

.directive("mobiscroll", function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      scroller : '=mobiscroll',
      update : '=update',
      model : '=ngModel'
    },
    link: function (scope, elm, attrs, ctlr, ngModel) {
        elm.mobiscroll().time({
                theme: scope.scroller.theme,
                display: scope.scroller.display,
                mode: scope.scroller.mode,
                minWidth: scope.scroller.minWidth,
                height: scope.scroller.height,
                timeFormat: scope.scroller.timeFormat,
                timeWheels: scope.scroller.timeWheels,
                layout: scope.scroller.layout,
                stepMinute: scope.scroller.stepMinute
                // onChange: function() {
                //     scope.update();
                // }
            });

        scope.$watch("model", function(value) {
                elm.mobiscroll('setValue',value);
            });
    }
  };
});