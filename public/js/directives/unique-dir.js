angular.module('unique-dir',[])

.directive('ensureUnique', ['$http', '$timeout', function() {
 
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function() {
        var search = true;
        for(i in scope.users){
          
          if(c.$modelValue== scope.users[i]){
            search = false;
           }
        }

       if(!search){
        c.$setValidity('unique', false); 
       }
       else{
        c.$setValidity('unique', true);
       }
   
         
      });
    }
  }
}]);