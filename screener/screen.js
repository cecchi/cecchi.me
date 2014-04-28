var _        = require('underscore'),
    fs       = require('fs'),
    config   = require('config.js'),
    casper   = require('casper').create({
        verbose: true,
        logLevel: "debug",
        waitTimeout: 10000
    }),
    login    = 'https://login.fidelity.com/ftgw/Fas/Fidelity/RtlCust/Login/Response',
    screener = 'https://research2.fidelity.com/fidelity/screeners/commonstock/main.asp?saved=' + config.screener.id,
    stocks   = [],
    columns  = [];

casper.echo('Connecting to Fidelity...');

casper.start();

// Login
casper.open(login, {
    method: 'POST',
    data:   {
        'SSN': config.user.username,
        'PIN':  config.user.password,
        'SavedIdInd': 'N'
    }
});

// Open screener
casper.thenOpen(screener)

// Load custom view
casper.waitForSelector('.screener-control a[key=custom]', function() {
    this.click('.screener-control a[key=custom]');
});

// Kick off pagination
casper.then(paginate);

// Wait for table to load, scrape, repeat
function paginate() {
    // Wait for the table to update, otherwise try scraping anyway
    casper.waitForSelectorTextChange('#table-results', scrape, scrape);

    casper.then(function() {
        if(this.exists('.pager a[page=next]:not(.disabled)')) {
            this.click('.pager a[page=next]');
            paginate();
        } else {
            save();
        }
    });
}

// Scraping
function scrape() {
    var data = casper.evaluate(function() {
        return [].slice.call($('#table-results').find('tr').map(function() {
            return [[].slice.call($(this).find('td:not(:first-child), th:not(:first-child)').map(function() {
                var cell = $(this);
                return (cell.find('.minisnap').length ? cell.find('.ticker').text() : cell.text()).replace(',', '\,');
            }))];
        }));
    });

    columns = data.shift();

    stocks = stocks.concat(data);
}

// Save output
function save() {
    var now, clean, csv;

    // Restructure
    var clean = _.map(stocks, function(stock) {
        return _.map(stock, function(property, index) {
            return { 'label' : columns[index], 'value': property };
        });
    });

    // Sort by Return on Assets
    clean = _.sortBy(clean, function(stock) {
        return parseFloat(_.findWhere(stock, {
            'label' : 'Return on Assets (TTM)'
        }).value.replace(/[^0-9]\./g, ''))
    }).reverse();

    // Save Return on Assets Rank
    _.each(clean, function(stock, index) {
        clean[index].push({
            'label' : 'Return on Assets Rank',
            'value' : index
        });
    });

    // Sort by Earnings Yield
    clean = _.sortBy(clean, function(stock) {
        return parseFloat(_.findWhere(stock, {
            'label' : 'Earning Yield (TTM)'
        }).value.replace(/[^0-9\.]/g, ''))
    }).reverse();

    // Save Earnings Yield Rank
    _.each(clean, function(stock, index) {
        clean[index].push({
            'label' : 'Earnings Yield Rank',
            'value' : index
        });
    });

    // Sort by Combined Rank
    clean = _.sortBy(clean, function(stock) {
        return _.findWhere(stock, {
            'label' : 'Earnings Yield Rank'
        }).value + _.findWhere(stock, {
            'label' : 'Return on Assets Rank'
        }).value;
    });

    // Save Combined Rank
    _.each(clean, function(stock, index) {
        clean[index].push({
            'label' : 'Combined Rank',
            'value' : index
        });
    });

    // Return to original format
    columns = _.pluck(clean[0], 'label');
    clean   = _.map(clean, function(stock) {
        return _.pluck(stock, 'value');
    });
    clean.unshift(columns);

    // Convert to CSV
    csv = _.map(clean, function(stock) {
        return _.map(stock, function(property) {
            return '"' + property.toString().replace(/\"/g, '""') + '"';
        }).join(',');
    }).join('\n');

    // Save
    now = new Date();
    fs.write('stocks/' + (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear() + '.csv', csv, 'w');

    casper.exit();
}

casper.run(function() {
  this.echo('Done.').exit();
});