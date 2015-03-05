/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

var utils = require('utils');

var casper = require("casper").create({
    verbose: true,
    logLevel: 'error',
    clientScripts: ["includes/jquery-2.1.1.js"],
  viewportSize: {
          width: 1024,
          height: 768
  },
  pageSettings: {
    loadImages: true,
    loadPlugins: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
  }
});

var LOGIN_URL = 'https://www.linkedin.com';

// Eddie Naff   **** THROTTLED 9/2/14!!! ****
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
        ["https://www.linkedin.com/pub/lip-bu-tan/46/a78/284", "Cadence"],
        ["https://www.linkedin.com/pub/rick-mahoney/0/86b/764", "Cadence"],
        ["https://www.linkedin.com/profile/view?id=32737242&authType=NAME_SEARCH&authToken=M6Yd&locale=en_US&srchid=1734430451408567887491&srchindex=1&srchtotal=1&trk=vsrp_people_res_name&trkInfo=VSRPsearchId%3A1734430451408567887491%2CVSRPtargetId%3A32737242%2CVSRPcmpt%3Aprimary", "Cadence"],
        ["https://www.linkedin.com/profile/view?id=76439383&authType=NAME_SEARCH&authToken=LZv3&locale=en_US&srchid=1734430451408567910257&srchindex=1&srchtotal=1&trk=vsrp_people_res_name&trkInfo=VSRPsearchId%3A1734430451408567910257%2CVSRPtargetId%3A76439383%2CVSRPcmpt%3Aprimary", "Cadence"],
    ];

// If we don't set a limit, it could go on forever
var upTo = ~~casper.cli.get(0) || 5;

var currentLink = 0;

var companyTarget = 'test';

// Get the links, and add them to the links array
// (It could be done all in one step, but it is intentionally splitted)
function addLinks(link) {
    this.then(function() {
        var found = this.evaluate(searchLinks);
        var sameTerm = links[currentLink][1];
        this.echo('Current Company = ' + links[currentLink][1]);
        this.echo('Current Link = ' + links[currentLink][0]);
        this.echo(found.length + " links found on " + link);
        links = links.push( [found, sameTerm] );
        // links = links.concat(found);
    });
}

// Fetch all <a> elements from the page and return
// the ones which contains a href starting with 'https://'
function searchLinks() {
    var filter, map;
    filter = Array.prototype.filter;
    map = Array.prototype.map;

    // BETTER JQUERY VERSION (THAT DOESN'T WORK)
    // var found_links = [];
    //     $('div.insights-browse-map h4 a').find('a').each(function() {

    //         this.echo($(this).attr('href'));
    //         var found_link = $(this).attr('href');
    //         // return (found_links);
    //         found_links.push(found_link)
    //         return found_links;
    //     });
// #results > li > div > h3 > a
    return map.call(filter.call(document.querySelectorAll('a.browse-map-photo'), function(a) {
        return  (/^https:.*/i).test(a.getAttribute("href"));
                }), function(a) {
        return a.getAttribute("href");
    });


    // casper.then(function() {
    //     isMySelectorInDom = this.evaluate(function () {
    //         return $('a.browse-map-photo');
    // });


    // casper.evaluate(function() {
    //     var quickTest = $('a.browse-map-photo');
    //     casper.echo( 'TEST: ' + quickTest );
    // });


}



getContactInfo = function() {

  // casper.waitForSelector('div[id^="experience"] > header > h4', function() {
  //     this.echo('I see div[id^="experience"] > header > h4 in the DOM!!!');
  // });



  // var contact;
  // contact = {
  //           fullName: this.getHTML('span.full-name').replace(/^\s+|\s+$/g, ""),
  //           title: this.getHTML('header h4 a').replace(/^\s+|\s+$/g, ""),
  //           locale: this.getHTML('span.locality').replace(/^\s+|\s+$/g, ""),
  //           liLink: this.getCurrentUrl(),
  //           currentEmployer: this.fetchText('header:first-of-type h5 a').replace(/^\s+|\s+$/g, "")
  //       }
  //       contact.searchTerm = links[currentLink];
  //       suspects.push(contact);



  if (casper.exists('header h5 a')) {
        // current_title = this.fetchText('header h5 a');
        var h1s = document.querySelectorAll('header h5 a');
        var myH1;
        if (h1s.length > 0) {
          myH1 = h1s[0];
        } else {
          // Trigger error
          this.echo('Couldn\'t find it!');
          myH1 = 'Not Found';
        }

    }


    if ( !casper.exists('span.full-name') || !casper.exists('header h4 a') ) {
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
              liLink: this.getCurrentUrl() //,
              // currentEmployer: this.fetchText('header:first h5').replace(/^\s+|\s+$/g, "")
              // currentEmployer: this.fetchText('span:first-of-type.miniprofile-container')
          }

          var companyNameText = this.evaluate(function() {
              var getCompanyName = $('span[id^="yui-gen"]:first').text();
              // this.echo( getCompanyName );
              return getCompanyName;
              // });
            });

          contact.searchTerm = companyNameText;
          suspects.push(contact);
          this.echo(companyNameText);
  }

  return contact;
    // }
};

outputHtml = function () {
  var html, suspect, _i, _len;
  html = '<html>\n<head></head>\n  <body><table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Title</th>\n      <th>Company</th>\n      <th>Locale</th>\n      <th>LinkedIn Link</th>\n      <th>Search Target</th>\n  </thead>\n  <tbody>';
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
                return data = "<tr>\n  <td>" + suspect.fullName + "</td>\n  <td>" + suspect.title + "</td>\n <td>" + suspect.currentEmployer + "</td>\n <td>" + suspect.locale + "</td>\n <td>" + suspect.liLink + "</td>\n <td>" + suspect.searchTerm + "</td>\n</tr>";
            }
};
// End import from linkedInlasso2.js


// Just opens the page and prints the title
function start(link) {
    this.start(link, function() {

      // this.page.injectJs('includes/jquery-2.1.1.min.js');

          var current_search_selector = '#pivot-bar';
          var current_title_selector = 'span.full-name';

          if (casper.exists(current_title_selector)) {
                current_title = this.getHTML(current_title_selector).replace(/^\s+|\s+$/g, "");
                this.capture('testPngs/' + LOGIN_USERNAME + ' ' + currentDate.yyyymmdd() + ' ' + currentLink + '.png')
                this.echo(current_title);

            }
    });
}

// As long as it has a next link, and is under the maximum limit, will keep running
function check() {
    if (links[currentLink][0] && links[currentLink][1] && currentLink < upTo) {
        this.echo('--- Link ' + currentLink + ' ---\n' + links[currentLink][0]);
        start.call(this, links[currentLink][0]);
        getContactInfo.call(this, links[currentLink][0]);
        addLinks.call(this, links[currentLink][0]);
        currentLink++;
        outputHtml.call(this, suspects[currentLink]);

        this.run(check);
    } else {
        this.echo("All done.");
        this.exit();
    }
}

casper.start(LOGIN_URL, function () {'use strict';
      this.waitForResource("logo_132x32_2.png", function() {
        this.echo('logo_132x32_2.png has been loaded.');
      });
     this.capture('captureTest.png');
     this.log('Logging in', 'error');
     this.fill('form#login', {
          'session_key': LOGIN_USERNAME,
          'session_password': LOGIN_PASSWORD
     }, true);

     this.log('Logged in', 'error');

});


casper.then(function() {
    var isMySelectorInDom = this.evaluate(function () {
        // return $('a.profile-photo').attr('href');
        // this.echo( isMySelectorInDom );
        return $('#recent-activities-widget > div.header > h3').text();
    });

    this.echo( isMySelectorInDom );

    if (isMySelectorInDom.length > 0) {
        this.echo( 'Your Selector is visible in the DOM via JQuery!!!' + isMySelectorInDom );
    } else {
      this.echo( '...the hell?!' );
    }
});


phantom.casperTest = true;

casper.run(check);
