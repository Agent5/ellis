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


casper.start(LOGIN_URL, function () {'use strict';

      this.getHTML();

      
     this.capture('captureTest.png');


});


phantom.casperTest = true;

casper.run();
