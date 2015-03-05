/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

// USAGE:
// casperjs --ssl-protocol=tlsv1 get_li_data-v.0.2.js

// VERSION DIFF --trying to export this as JSON rather than HTML

var utils = require('utils');

var casper = require("casper").create({
  verbose: true,
  logLevel: 'debug',
  clientScripts: ["includes/jquery-2.1.1.js"],
  viewportSize: {
    width: 1024,
    height: 768
  },
  test: true,
  pageSettings: {
    loadImages: true,
    loadPlugins: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
  }
}); // Initialize Casperjs and determine the browser settings

casper.options.waitTimeout = 7000;

casper.options.onWaitTimeout = function() {

  this.echo('RESULTS NOT FOUND ');
  // this.capture('error.png');

};

var fs = require('fs');

var suspects = [];

var colorizer = require('colorizer').create('Colorizer');

var LI_LOGIN_URL = 'http://www.linkedin.com';
var LI_LOGIN_USERNAME = 'enaff@clearslide.com';
var LI_LOGIN_PASSWORD = 'dataN1nj@'; // LinkedIn login info

// The starting links array,
var links = [
    {num: "1", owner: "Marketing Queue", targetName: "Ryan Williams", company: "Pearle Vision Jacksonville", title: "", leadSource: "Marketing-Customer Referral", address: "", email: "ryanw@drbrink.com", dateCreated: "2014-12-02", sfdcID: "00Qi000000feJFK", status: "Open", liSearch: "https://www.linkedin.com/sales/search?keywords=Ryan+Williams+Pearle+Vision+Jacksonville"},
    {num: "2", owner: "Marketing Queue", targetName: "Brian Stephens", company: "Dell", title: "", leadSource: "Marketing-Customer Referral", address: "", email: "brian_stephens@dell.com", dateCreated: "2014-12-03", sfdcID: "00Qi000000gjov5", status: "Open", liSearch: "https://www.linkedin.com/sales/search?keywords=Brian+Stephens+Dell"}
  ];

casper.start(LI_LOGIN_URL, function () {'use strict';

    this.echo('Logging in', 'debug');
    this.fill('form', {
        'session_key': LI_LOGIN_USERNAME,
        'session_password': LI_LOGIN_PASSWORD
    }, true);

    this.echo('Logged in', 'debug');
}).each(links, function(self, link, index) {
    var usable_uri = link.liSearch;
    var tmp_file_name = link.targetName + "_" + link.company;
    var file_name = tmp_file_name.replace(' ', '_');
    var search_target = link.targetName + ' ' + link.company;
    var lead_name = link.targetName;
    var sfdc_id = link.sfdcID;
    var num = link.num;
    var target_company = link.company;
    var lead_owner = link.owner;
    var first_name = link.targetName;
    var title = link.title;
    var lead_source = link.leadSource;
    var address = link.address;
    var email = link.email;
    var date_created = link.dateCreated;
    var lead_id = link.leadID;
    var lead_status = link.status;
    var search_date = link.dateCreated;

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

    var selectorPresent = false;

    self.thenOpen(usable_uri, function() {
        this.waitForSelector("li.entity", function() {
            this.echo("Found 'li.entity'");
            selectorPresent = true;
        }); // Wait for 'li.entity' to appear in the remote enviro, then grab the ul.results HTML, then write to file

        var results = this.evaluate(function() {
            var entityResults = [];

            $('.entity').each(function(searchIndex){
              var leadInfoSet = {};
              var fullName = $(this).find('h3.name > a').text();
              var firstName = fullName.split(' ').slice(0, -1).join(' ');
              var lastName = fullName.split(' ').slice(-1).join(' ');

              leadInfoSet.lastName = lastName;
              leadInfoSet.firstName = firstName;
              leadInfoSet.link = 'http://www.linkedin.com' + $(this).find('h3.name > a').attr('href');
              leadInfoSet.title = $(this).find('p.abstract').first().text();
              leadInfoSet.location = $(this).find('dd.location').text();
              leadInfoSet.industry = $(this).find('dd.industry').text();
              leadInfoSet.searchIndex = searchIndex;

              this.thenOpen(leadInfoSet.link, function(){
                leadIndivPage.link = 'http://www.linkedin.com' + $('h3.company-name > a').attr('href');
                this.capture('testCompanyPage.png');

                this.thenOpen(leadIndivPage.link, function(){
                  this.echo('Page title is: ' + this.evaluate(function() {
                    return document.title;
                  }), 'INFO'); // Will be printed in green on the console
                });
              });

              entityResults.push(leadInfoSet);

            });
            return entityResults;
          });


          // self.thenOpen(results.uri, function(){
          //   this.capture('testCompanyPage.png');
          // });






        // this.thenOpen(results.link, function() {
        //
        // this.capture('testCompanyPage.png');
        //
        //
        // });

        // this.echo(entityResults);









        var d = currentDate;

        var personResults = {}; // the top-level object to hold the results of the searches

        personResults.name = lead_name;
        personResults.search_target = search_target;
        personResults.sfdc_id = sfdc_id;
        personResults.num = num;
        personResults.target_company = target_company;
        personResults.date_of_search = d.Current;
        personResults.usable_uri = usable_uri;
        personResults.file_name = file_name;
        personResults.search_target = search_target;
        personResults.lead_owner = lead_owner;
        personResults.first_name = first_name;
        personResults.title = title;
        personResults.lead_source = lead_source;
        personResults.address = address;
        personResults.email = email;
        personResults.date_created = link.dateCreated; //date_created;
        personResults.lead_id = lead_id;
        personResults.lead_status = lead_status;
        personResults.linkSearchResults = results;
        personResults.search_date = search_date;

        var csv_results = '';
        var csv_results_header = '';

        tsv_results_header = 'Lead Name\tSearch Terms\tLI URI\tSFDC ID\tCompany\tLead Owner\tTitle\tLead Source\tAddress\tEmail\tDate Created\tLead Status\tSearch Results';
        tsv_results = lead_name + '\t' + lead_name + ' ' + target_company + '\t' + usable_uri + '\t' + sfdc_id + '\t' + target_company + '\t' + lead_owner + '\t' + title + '\t' + lead_source + '\t' + address + '\t' + email+ '\t' + date_created + '\t' + lead_status + '\t' + JSON.stringify(results, '    ') + '\n';

        var search_results ={};
        search_results = personResults;

        // var entry = [{}];
        //
        // entry[0] = search_results;


        var totalSet = JSON.stringify(search_results, null, '    ');

        // var jsonFileContents = fs.open('data/json/LI_results_v-0.7.json', 'r');

        var jsonHeader = '{"version":"1.0","encoding":"UTF-8","feed":{"xmlns":"http://www.w3.org/2005/Atom","xmlns$openSearch":"http://a9.com/-/spec/opensearchrss/1.0/","xmlns$blogger":"http://schemas.google.com/blogger/2008","xmlns$georss":"http://www.georss.org/georss","xmlns$gd":"http://schemas.google.com/g/2005","xmlns$thr":"http://purl.org/syndication/thread/1.0","id":{"$t":"tag:blogger.com,1999:blog-2471378914199150966"},"updated":{"$t":"2014-12-10T16:28:20.974-08:00"},"category":[{"term":"chrome web store"},{"term":"extensions"},{"term":"security"},{"term":"googlechrome"},{"term":"devtools"},{"term":"html5"},{"term":"dart"},{"term":"native client"},{"term":"webgl"},{"term":"New Features"},{"term":"v8"},{"term":"webkit"},{"term":"webp"},{"term":"websockets"},{"term":"webrtc"},{"term":"chrome apps"},{"term":"chromeframe"},{"term":"chromeos"},{"term":"chromium"},{"term":"javascript"},{"term":"webaudio"},{"term":"linux"},{"term":"mobile"},{"term":"open web"},{"term":"releases"},{"term":"spdy"},{"term":"ssl"},{"term":"Chrome Frame"},{"term":"accessibility"},{"term":"benchmarks"},{"term":"beta"},{"term":"blink"},{"term":"cloud print"},{"term":"gdd"},{"term":"incognito"},{"term":"mac"},{"term":"na"},{"term":"octane"},{"term":"rlz"},{"term":"web intents"},{"term":"webtiming"}],"title":{"type":"text","$t":"Chromium Blog"},"subtitle":{"type":"html","$t":""},"link":[{"rel":"http://schemas.google.com/g/2005#feed","type":"application/atom+xml","href":"http:\/\/blog.chromium.org\/feeds\/posts\/default"},{"rel":"self","type":"application/atom+xml","href":"http:\/\/www.blogger.com\/feeds\/2471378914199150966\/posts\/default?alt=json"},{"rel":"alternate","type":"text/html","href":"http:\/\/blog.chromium.org\/"},{"rel":"hub","href":"http://pubsubhubbub.appspot.com/"},{"rel":"next","type":"application/atom+xml","href":"http:\/\/www.blogger.com\/feeds\/2471378914199150966\/posts\/default?alt=json\u0026start-index=26\u0026max-results=25"}],"author":[{"name":{"$t":"Emily Wood"},"email":{"$t":"noreply@blogger.com"},"gd$image":{"rel":"http://schemas.google.com/g/2005#thumbnail","width":"16","height":"16","src":"http:\/\/img2.blogblog.com\/img\/b16-rounded.gif"}}],"generator":{"version":"7.00","uri":"http://www.blogger.com","$t":"Blogger"},"openSearch$totalResults":{"$t":"352"},"openSearch$startIndex":{"$t":"1"},"openSearch$itemsPerPage":{"$t":"25"},\n "entry": [\n';

        var jsonResults = totalSet;

        var searchLength = links.length;

        if(index < 1) {
          // do something
          jsonResults = jsonHeader + totalSet;
          fs.write('data/json/json_results.json', jsonResults, 'a');
          fs.write('data/tsv/tsv_results.tsv', tsv_results_header + '\n' + tsv_results, 'a');
          this.echo('Initiating File\nSearch length = ' + searchLength + '\n' + 'No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.target + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id);
        } else if(index < searchLength - 1) {
          // do something else
          jsonResults = totalSet;
          fs.write('data/json/json_results.json', ',\n' + jsonResults, 'a');
          this.echo('No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.target + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id);

          fs.write('data/tsv/tsv_results.tsv', tsv_results, 'a');
          this.echo('Initiating File\nSearch length = ' + searchLength + '\n' + 'No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.name + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id);
        } else {
          jsonResults = totalSet;
          fs.write('data/json/json_results.json', ',\n' + jsonResults + '\n]\n}\n}', 'a');
          this.echo('No: ' + (index + 1) + ', ' + colorizer.colorize('Name: ', 'INFO') + link.target + ', ' + colorizer.colorize('Company: ', 'INFO') + link.company + ', ' + colorizer.colorize('ID: ', 'INFO') + link.id + '\nCompleting the file.\nGoodbye.\n');
        }
        // if LI_results_v-0.7.json is empty then append a '[', else append a ',' plus the data


    }); // Open each URI and set the remote context
}); // Iterate through each link in the 'links' array of objects

casper.run();
