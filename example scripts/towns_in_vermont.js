var utils = require('utils');
var casper = require('casper').create({
  verbose: true,
  logLevel: 'error',
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
  },
  clientScripts: ['lib/jquery.min.js'] // Inject jquery library, allows use of $ variables
});

var i = 0;
var links = [];
var town_data = [];

function getTownLinks () {
  var links = document.querySelectorAll('table.sortable.wikitable tbody tr td:nth-of-type(2) a');
  return [].map.call(links, function(link) {
    return link.getAttribute('href');
  });
}

function loopThroughTownLinks() {
  // Recurses until all links are processed
  if (i < links.length) {
    this.echo('[LINK #' + i + '] ' + links[i]);
    getTownData.call(this, links[i]);
    i++;
    this.run(loopThroughTownLinks);
  } else {
    utils.dump(town_data);
    this.exit();
  }
}

function getTownData(link) {
  this.start(link, function() {

    // Get name of town from the infobox
    var name = this.fetchText('span.fn.org');

    // Get the elevation text from the infobox
    var elevation = this.evaluate(function() {
      return $('th:contains("Elevation") + td').text();
    });

    // Add the name & elevation data to the town_data array!
    var data = {
      name: name,
      elevation: elevation
    };
    town_data.push(data);

    // Only works for a handful. Incorrect for many.
    // var elevation = this.fetchText('table.infobox tbody tr:nth-of-type(15) td');
  });
}

casper.start('http://en.wikipedia.org/wiki/List_of_towns_in_Vermont', function() {
  links = this.evaluate(getTownLinks);

  // Convert relative links to absolute URLs
  for (var i = 0; i < links.length; i++) {
    links[i] = "http://en.wikipedia.org" + links[i];
  }

  utils.dump(links);
});

casper.run(loopThroughTownLinks);

/** References:
 1. http://stackoverflow.com/questions/16035404/is-there-a-css-sibling-contains-selector?rq=1
 2. http://stackoverflow.com/questions/15981450/casperjs-cant-find-variable
 **/
