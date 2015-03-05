var wReader = angular.module('wReader', ['wReader.filters', 'wReader.services', 'wReader.directives', 'xeditable'])

    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });


function AppController($scope, $http, items, scroll) {

  $scope.items = items;

  $scope.refresh = function() {
    items.getItemsFromServer();
  };

  $scope.handleSpace = function() {
    if (!scroll.pageDown()) {
      items.next();
    }
  };

  $scope.formData = {};

  $scope.processForm = function() {
    $http({
      method  : 'POST',
      url     : 'https://docs.google.com/a/clearslide.com/forms/d/1Bgm73IeWPiVGnXCIUM-ARW2c8vpLKcuSEtBqTujS4Qc/formResponse',
      data    : $.param($scope.formData),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
     })
      .success(function(data) {
        console.log(data);

        if (!data.success) {
          // if not successful, bind errors to error variables
          $scope.errorName = data.errors.name;
          $scope.errorSuperhero = data.errors.superheroAlias;
        } else {
          // if successful, bind success message to message
          $scope.message = data.message;
        }
      });
  };

  $scope.$watch('items.selectedIdx', function(newVal, oldVal, scope) {
    if (newVal !== null) scroll.toCurrent();
  });
}

AppController.$inject = ['$scope', '$http', 'items', 'scroll']; // For JS compilers.


// Top Menu/Nav Bar
function NavBarController($scope, items) {

  $scope.showAll = function() {
    items.clearFilter();
  };

  $scope.showUnread = function() {
    items.filterBy('read', false);
  };

  $scope.showStarred = function() {
    items.filterBy('starred', true);
  };

  $scope.showRead = function() {
    items.filterBy('read', true);
  };
}

NavBarController.$inject = ['$scope', 'items'];  // For JS compilers.



document.addEventListener('DOMContentLoaded', function(e) {
  //On mobile devices, hide the address bar
  window.scrollTo(0);
}, false);
