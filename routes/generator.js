var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express();

var URL = require('url-parse');

var START_URL = "http://www.arstechnica.com";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url;
var baseUrl;

router.get('/', function (req, res, next) {
    res.render('generator');
});

router.post('/', function (req, res, next) {
    pagesToVisit.push(req.body.url);
    console.log(req.body.url);
    url = new URL(req.body.url);
    baseUrl = url.protocol + "//" + url.hostname;
    crawl();
    // var pageToVisit = "http://www.arstechnica.com";
    // console.log("Visiting page " + pageToVisit);
    // request(pageToVisit, function (error, response, body) {
    //     if (error) {
    //         console.log("Error: " + error);
    //     }
    //     // Check status code (200 is HTTP OK)
    //     console.log("Status code: " + response.statusCode);
    //     if (response.statusCode === 200) {
    //         // Parse the document body
    //         var $ = cheerio.load(body);
    //         console.log("Page title:  " + $('title').text());
    //     }
    // });
    res.send('ready')
});

module.exports = router;


function collectInternalLinks($) {
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function () {
        allRelativeLinks.push(baseUrl + $(this).attr('href'));
    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function () {
        allAbsoluteLinks.push($(this).attr('href'));
    });

    console.log("Found " + allRelativeLinks.length + " relative links");
    console.log("Found " + allAbsoluteLinks.length + " absolute links");
}

function crawl() {
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        // var isWordFound = searchForWord($, SEARCH_WORD);
        // if(isWordFound) {
        //     console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
        // } else {
        collectInternalLinks($);
        // In this short program, our callback is just calling crawl()
        callback();
        // }
    });
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return (bodyText.indexOf(word.toLowerCase()) !== -1);
}
