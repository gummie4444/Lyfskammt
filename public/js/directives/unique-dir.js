angular.module('unique-dir',[])

.directive('ensureUnique', ['$http', '$timeout', function($http, $timeout) {
  var checking = null;
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function() {
       
       

        if (!checking) {
          checking = $timeout(function() {
          

              $http({
                method: 'POST',
                url: '/api/users/check/' + c.$modelValue,
                data: {'field': c.$modelValue}
              }).success(function(data, status, headers, cfg) {
             
               
                  c.$setValidity('unique', data.isUnique);
                  checking = null;
                  
 
              }).error(function(data, status, headers, cfg) {
                  checking = null;
              });
            }, 5000);
        };
        
        
      });
    }
  }
}]);