var wReader = angular.module('wReader', ['wReader.filters', 'wReader.services', 'wReader.directives', 'xeditable', 'truncate'])

    .run(function(editableOptions) {
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });


function AppController($scope, $http, items, scroll) {

  $scope.items = items;

  // ui accordion

  $scope.oneAtATime = true;

   $scope.groups = [
     {
       title: 'Dynamic Group Header - 1',
       content: 'Dynamic Group Body - 1'
     },
     {
       title: 'Dynamic Group Header - 2',
       content: 'Dynamic Group Body - 2'
     }
   ];

   // $scope.items = ['Item 1', 'Item 2', 'Item 3'];

   $scope.addItem = function() {
     var newItemNo = $scope.items.length + 1;
     $scope.items.push('Item ' + newItemNo);
   };

   $scope.status = {
     isFirstOpen: true,
     isFirstDisabled: false
   };

   // ui accordion

  $scope.refresh = function() {
    items.getItemsFromServer();
  };

  $scope.handleSpace = function() {
    if (!scroll.pageDown()) {
      items.next();
    }
  };

  $scope.chooseClicked = function( key_string, value_object ){
    // var the_key = $parse(key_string);
    // var the_value = value_object;
    // the_key.assign($scope, the_value);

    $parse(key_string).assign($scope.items.selected, value_object);
    // items.selected.firstName = item.firstName;
    $scope.apply();
    $scope.processForm();

  };

  $scope.chooseTitle = function( chosen ){
    // var atIndex = chosen.indexOf(" at ");
    // var newTitle = chosen.substring(0, atIndex);
    items.selected.title = chosen;
    $scope.processForm();

  };

  $scope.chooseFirstName = function( chosen ){
    items.selected.firstName = chosen;
    $scope.processForm();
  };
  $scope.chooseLastName = function( chosen ){
    items.selected.lastName = chosen;
    $scope.processForm();
  };
  $scope.chooseCompany = function( chosen ){
    // items.selected.company = chosen;

    // var unChoppedLiTitle = chosen;
    // var findAt = unChoppedLiTitle.indexOf(" at ") + 4;
    items.selected.company = chosen // unChoppedLiTitle.substring(findAt);
    $scope.processForm();
  };
  $scope.chooseLeadSource = function( chosen ){
    items.selected.leadSource = chosen;
    $scope.processForm();
  };
  $scope.chooseCreatedDate = function( chosen ){
    items.selected.createdDate = chosen;
    $scope.processForm();
  };

  $scope.processForm = function() {
    $http({
      method  : 'POST',
      // url     : 'https://docs.google.com/a/clearslide.com/forms/d/1Bgm73IeWPiVGnXCIUM-ARW2c8vpLKcuSEtBqTujS4Qc/formResponse',
      // url     : 'http://10.0.1.116:3000/choices',
      url     : 'http://10.0.1.122:3000/choices',
      // data    : $.param($scope.formData.fullName),  // pass in data as strings
      data    : $scope.items.selected,
      headers : { 'Content-Type': 'application/json' }
      // headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
     })
      .success(function(data) {
        console.log("Writing to database:\n" + JSON.stringify(data, null, '    '));

        if (!data.success) {
          // if not successful, bind errors to error variables
          // $scope.errorEmail = data.errors.email;
          // $scope.errorSuperhero = data.errors.superheroAlias;
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

// beg Accordion
function AccordionCtrl($scope, items) {

  $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    $scope.accItems = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.accItems.length + 1;
      $scope.accItems.push('Acc. Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
}
AccordionCtrl.$inject = ['$scope'];  // For JS compilers.

// end Accordion

document.addEventListener('DOMContentLoaded', function(e) {
  //On mobile devices, hide the address bar
  window.scrollTo(0);
}, false);
