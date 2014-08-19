angular.module('chart-resize', [])

.directive('resize', function ($window, $timeout) {
	return function ($scope, element) {
		var w = angular.element($window);
		$scope.getWindowDimensions = function () {
			return w.height();
		};
		$scope.$watch($scope.getWindowDimensions, function (newValue) {
			// $scope.windowHeight = newValue
			$timeout(function() {
			    $scope.$emit('heightChange');
			}, 10);
		});
	
		w.bind('resize', function () {
			$scope.$apply();
		});
	}
})