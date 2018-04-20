var $ = require('jquery');
var dt = require('datatables.net');
var URL = require('url-parse');
var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;


var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url;
var baseUrl;

jsdom.jQueryify(window, "http://code.jquery.com/jquery.js", function () {
    var $ = window.$;
    $(document).ready(function () {
        let urlStr = $('#links_table').attr('data');
        console.log(urlStr);
        let data = generateLinks(urlStr);
        $('#links_table').DataTable({
            data: data
        });
    });
});

const generateLinks = function (urlStr) {
    // http://www.arstechnica.com
    pagesToVisit.push(urlStr);
    console.log(urlStr);
    url = new URL(urlStr);
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
    return pagesVisited;
};

function collectInternalLinks(url, $) {
    var allRelativeLinks = [];
    var allAbsoluteLinks = [];

    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function () {
        let link = baseUrl + $(this).attr('href');
        if (!(link in allRelativeLinks))
            allRelativeLinks.push(link);
    });

    var absoluteLinks = $("a[href^='http']");
    absoluteLinks.each(function () {
        let link = $(this).attr('href');
        let url = new URL(link);
        if (url.protocol + "//" + url.hostname === baseUrl) {
            if (!(link in allRelativeLinks))
                allRelativeLinks.push(link);
        } else if (!(link in allAbsoluteLinks))
            allAbsoluteLinks.push(link);
    });

    pagesVisited[url].links = allRelativeLinks;
    pagesVisited[url].externalLinks = allAbsoluteLinks;

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
    pagesVisited[url] = true;
    numPagesVisited++;

    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
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
        collectInternalLinks(url, $);
        callback();
        // }
    });
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return (bodyText.indexOf(word.toLowerCase()) !== -1);
}


module.exports.generateLinks = generateLinks;