var directives = angular.module('wReader.directives', []);


directives.directive('wKeydown', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      switch (e.keyCode) {

        case 222: // ' //72: // H
          e.preventDefault();
          return scope.$apply(attr.wStar);

        case 34: // PgDn
        case 40: // down arrow
          e.preventDefault();
          return scope.$apply(attr.wDown);

        case 33: // PgUp
        case 38: // up arrow
          e.preventDefault();
          return scope.$apply(attr.wUp);

        case 85: // U
          return scope.$apply(attr.wRead);
      }
    });
  };
});
