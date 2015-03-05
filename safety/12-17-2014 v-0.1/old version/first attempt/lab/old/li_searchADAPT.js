/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

// USAGE:
// casperjs --ssl-protocol=tlsv1 li_searchADAPT.js

var utils = require('utils');

var casper = require("casper").create({
    verbose: true,
    logLevel: 'error',
  viewportSize: {
          width: 1024,
          height: 768
  },
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
  }
});

var LOGIN_URL = 'http://www.linkedin.com';
var LOGIN_USERNAME = 'enaff@clearslide.com';
var LOGIN_PASSWORD = 'dataN1nj@';

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var hh = this.getHours().toString();
   var mins = this.getMinutes().toString();
   return yyyy + ' ' + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]) + ' ' + hh + '_' + mins; // padding
  };

currentDate = new Date();
currentDate.yyyymmdd();

var fs = require('fs');

var suspects = [];

// The base links array,
var links = [
    "https://www.linkedin.com/sales/search?keywords=Krista+Drock+Pevonia+International&search=",
    "https://www.linkedin.com/sales/search?keywords=HMAD+HEDI+EMLV&search=",
    "https://www.linkedin.com/sales/search?keywords=Lynn+Courtoreille+Lakeside+Outreach&search=",
    "https://www.linkedin.com/sales/search?keywords=Micahel+Chirico+SCSU&search=",
    "https://www.linkedin.com/sales/search?keywords=Johnny+Test+ABC+Inc.&search="
];

var targets = [
    {
      searchTerm: '',
      name: '',
      company: '',
      email: '',

    },

]


// If we don't set a limit, it could go on forever
var upTo = ~~casper.cli.get(0) || 400;

var currentLink = 0;

// Get the links, and add them to the links array
// (It could be done all in one step, but it is intentionally splitted)
function addLinks(link) {
    this.then(function() {

        var found = this.evaluate(searchLinks);

        this.echo(found.length + " links found on " + link);
        links = links.concat(found);
    });
}

// Fetch all <a> elements from the page and return
// the ones which contains a href starting with 'https://'
function searchLinks() {

    // casper.waitForSelector("div.insights-browse-map ul li h4 a", function() {
    //     this.echo("I'm sure div.insights-browse-map ul li h4 a is available in the DOM");


    // });

    var filter, map;
    filter = Array.prototype.filter;
    map = Array.prototype.map;

    return map.call(filter.call(document.querySelectorAll('a'), function(a) {
        return  (/^https:.*/i).test(a.getAttribute("href"));
                }), function(a) {
        return a.getAttribute("href");
    });


}

getContactInfo = function() {
  var contact;
    if (!casper.exists('span.full-name') || !casper.exists('header h5 a') || !casper.exists('header h4 a')) {
              contact = {
                        fullName: 'NONE',
                        title: 'NONE',
                        locale: 'NONE',
                        liLink: 'NONE',
                        currentEmployer: 'NONE'
                    }
                    suspects.push(contact);
  } else {
    contact = {
              fullName: this.getHTML('span.full-name').replace(/^\s+|\s+$/g, ""),
              title: this.getHTML('header h4 a').replace(/^\s+|\s+$/g, ""),
              locale: this.getHTML('span.locality').replace(/^\s+|\s+$/g, ""),
              liLink: this.getCurrentUrl(),
              currentEmployer: this.fetchText('header:first-of-type h5 a').replace(/^\s+|\s+$/g, "")
          }
          contact.searchTerm = links[currentLink];
          suspects.push(contact);
  }

  return contact;
};

outputHtml = function () {
  var html, suspect, _i, _len;
  html = '<html>\n<head></head>\n  <body><table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Title</th>\n      <th>Company</th>\n      <th>Locale</th>\n      <th>LinkedIn Link</th>\n      <th>Search Term</th>\n    </thead>\n  <tbody>';
  for (_i = 0, _len = suspects.length; _i < _len; _i++) {
    suspect = suspects[_i];
    html = html + generateRow(suspect);
  }
  html += '  </tbody>\n</table>\n</body>\n</html>';
  fs.write('results/' + LOGIN_USERNAME + ' ' + currentDate.yyyymmdd() + ' LIL results.html', html, 'w');
};

generateRow = function(suspect) {
  var data;
  if (suspect.fullName == 'LinkedIn Member') {
    return data = "";
  } else {
                return data = "<tr>\n  <td>" + suspect.fullName + "</td>\n  <td>" + suspect.title + "</td>\n <td>" + suspect.currentEmployer + "</td>\n <td>" + suspect.locale + "</td>\n <td><a href=\"" + suspect.liLink + "\"> LinkedIn</a></td>\n <td>" + suspect.searchTerm + "</td>\n</tr>";
            }
};
// End import from linkedInlasso2.js

// Just opens the page and prints the title
function start(link) {
    this.start(link, function() {

          var current_search_selector = '#pivot-bar';
          var current_title_selector = 'p.title';

          if (casper.exists(current_title_selector)) {
                current_title = this.getHTML(current_title_selector).replace(/^\s+|\s+$/g, "");
                this.echo(current_title);

            }
    });
}

// As long as it has a next link, and is under the maximum limit, will keep running
function check() {
    if (links[currentLink] && currentLink < upTo) {
        // place a function call to loop or map the array to append 'https://www.linkedin.com'
        this.echo('--- Link ' + currentLink + ' ---');
        start.call(this, links[currentLink]);
        getContactInfo.call(this, links[currentLink]);
        // addLinks.call(this, links[currentLink]);
        currentLink++;
        outputHtml.call(this, suspects[currentLink]);

        this.run(check);
    } else {
        this.echo("All done.");
        this.exit();
    }
}

casper.start(LOGIN_URL, function () {'use strict';

     this.log('Logging in', 'debug');
     this.fill('form', {
          'session_key': LOGIN_USERNAME,
          'session_password': LOGIN_PASSWORD
     }, true);

     this.log('Logged in', 'debug');

});

phantom.casperTest = true;

casper.run(check);
