// From https://gist.github.com/michaelhollman/6072862

// USAGE: casperjs --ssl-protocol=tlsv1 nestedThenOpen.js

casper.start('http://www.hudl.com', function () {'use strict';

// this.echo('Logging in', 'debug');
// this.fill('form', {
//   'session_key': LI_LOGIN_USERNAME,
//   'session_password': LI_LOGIN_PASSWORD
// }, true);
//
// this.echo('Logged in', 'debug');
});

//nesting thens
casper.then(function () {
    this.log('THEN #1', 'info', 'then');

    this.then(function () {
        this.log('THEN #2', 'info', 'then');
        this.then(function () {
            this.log('THEN #3', 'info', 'then');
        });
        this.log('THEN #4', 'info', 'then');
        this.then(function () {
            this.log('THEN #5', 'info', 'then');
        });
        this.log('THEN #6', 'info', 'then');
    });

    this.log('THEN #7', 'info', 'then');

    this.then(function () {
        this.log('THEN #8', 'info', 'then');
        this.then(function () {
            this.log('THEN #9', 'info', 'then');
        });
        this.log('THEN #10', 'info', 'then');
        this.then(function () {
            this.log('THEN #11', 'info', 'then');
        });
        this.log('THEN #12', 'info', 'then');
    });

    this.log('THEN #13', 'info', 'then');
});

//nesting thenopens
casper.thenOpen('http://www.linkedin.com', function () {

    this.log('THENOPEN #1: ' + this.getTitle(), 'info', 'LOG Label');

    this.thenOpen('', function () {
        this.log('THENOPEN #2: ' + this.getTitle(), 'info', 'thenOpen');
        this.thenOpen('', function () {
            this.log('THENOPEN #3', 'info', 'thenOpen');
        });
        this.log('THENOPEN #4', 'info', 'thenOpen');
        this.thenOpen('', function () {
            this.log('THENOPEN #5', 'info', 'thenOpen');
        });
        this.log('THENOPEN #6', 'info', 'thenOpen');
    });

    this.log('THENOPEN #7', 'info', 'thenOpen');

    this.thenOpen('', function () {
        this.log('THENOPEN #8', 'info', 'thenOpen');
        this.thenOpen('', function () {
            this.log('THENOPEN #9', 'info', 'thenOpen');
        });
        this.log('THENOPEN #10', 'info', 'thenOpen');
        this.thenOpen('', function () {
            this.log('THENOPEN #11', 'info', 'thenOpen');
        });
        this.log('THENOPEN #12', 'info', 'thenOpen');
    });

    this.log('THENOPEN #13', 'info', 'thenOpen');
});

//nested waitFors
casper.waitFor(function () { return true }, function () {
    this.log('WAITFOR #1', 'info', 'waitFor');

    this.waitFor(function () { return true }, function () {
        this.log('WAITFOR #2', 'info', 'waitFor');
        this.waitFor(function () { return true }, function () {
            this.log('WAITFOR #3', 'info', 'waitFor');
        });
        this.log('WAITFOR #4', 'info', 'waitFor');
        this.waitFor(function () { return true }, function () {
            this.log('WAITFOR #5', 'info', 'waitFor');
        });
        this.log('WAITFOR #6', 'info', 'waitFor');
    });

    this.log('WAITFOR #7', 'info', 'waitFor');

    this.waitFor(function () { return true }, function () {
        this.log('WAITFOR #8', 'info', 'waitFor');
        this.waitFor(function () { return true }, function () {
            this.log('WAITFOR #9', 'info', 'waitFor');
        });
        this.log('WAITFOR #10', 'info', 'waitFor');
        this.waitFor(function () { return true }, function () {
            this.log('WAITFOR #11', 'info', 'waitFor');
        });
        this.log('WAITFOR #12', 'info', 'waitFor');
    });

    this.log('WAITFOR #13', 'info', 'waitFor');
});


casper.run(function () {
    this.test.done();
});
