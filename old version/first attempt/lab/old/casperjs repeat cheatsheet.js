var numTimes = 10, count = 1;

casper.repeat(numTimes, function() {
    this.thenEvaluate(function(count) {
        nextPage(count);
    }, ++count);

    this.then(function() {
        this.echo(this.getHTML());
        this.echo('----------------------');
    });
});
