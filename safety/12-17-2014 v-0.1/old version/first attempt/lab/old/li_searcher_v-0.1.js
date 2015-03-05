/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

// USAGE:
// casperjs --ssl-protocol=tlsv1 li_searcher_v-0.2_EXPERIMENTAL.js

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
}); // Initialize Casperjs browser settings

var LI_LOGIN_URL = 'http://www.linkedin.com';
var LI_LOGIN_USERNAME = 'enaff@clearslide.com';
var LI_LOGIN_PASSWORD = 'dataN1nj@'; // LinkedIn login info

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
    "https://www.linkedin.com/sales/search?keywords=eddie+naff+clearslide&search=",
    "https://www.linkedin.com/sales/search?keywords=supreet+chahal&search="
];

casper.start(LI_LOGIN_URL, function () {'use strict';

    this.echo('Logging in', 'debug');
    this.fill('form', {
        'session_key': LI_LOGIN_USERNAME,
        'session_password': LI_LOGIN_PASSWORD
    }, true);

    this.echo('Logged in', 'debug');

}).each(links, function(self, link) {
    self.thenOpen(link, function() {
        // this.echo(this.getTitle());
        //
        // this.waitForSelector('h3.name', function() {
        //     this.capture('innerTest.png');
        //     var namesLength = this.evaluate(function() {
        //         var names = $('h3.name').text();
        //         return names;
        //     });
        //     this.echo('I found some names: ' + namesLength);
        // });


        this.waitForSelector('ul.results'); // , function() {
        this.capture('whahappen.png');
        var leadInfo = this.evaluate(function() {
            this.capture('insideLeadInfoFunction.png');
              $('li.entity').each(function(){
                    this.capture('insideEachFunction.png');
                    var name = $(this).find('h3.name > a').text();
                    var link = $(this).find('h3.name > a').attr('href');
                    var titleMessy = $(this).find('p.headline').text();
                    var d = currentDate.mmddyyyy();
                    // var connectionProfile
                    // var timestamp
                    // searchTarget
                    var lead = 'MDR:\t' + name + '\t \t \t' + titleMessy + '\t' + 'https://www.linkedin.com' + link + '\t' + d + '\n';
                    // return lead;
                    this.echo(lead);
              });
        });
        this.echo(leadInfo);
        // });
    });
});

casper.run();
