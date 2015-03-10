var filters = angular.module('wReader.filters', []);


filters.filter('formattedDate', function() {
  return function(d) {
    return d ? moment(d).fromNow() : '';
  };
});


filters.filter('formattedFullDate', function() {
  return function(d) {
    return d ? moment(d).format('MMMM Do YYYY, h:mm a') : '';
  };
});

filters.filter('extractCompany', function() {
        return function(currentLiTitle) {
    var unChoppedLiTitle = currentLiTitle;
    var findAt = unChoppedLiTitle.indexOf(" at ");
    var choppedTitle = unChoppedLiTitle.substring(0, findAt);
            // do some bounds checking here to ensure it has that index
            return choppedTitle;
        };
});
