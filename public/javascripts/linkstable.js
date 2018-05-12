var $ = require('jquery');
var dt = require('datatables.net');
var URL = require('url-parse');
var request = require('request');
var cheerio = require('cheerio');


var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url;
var baseUrl;
var hostname;

const generateLinks = function (urlStr) {
    // http://www.arstechnica.com
    pagesToVisit.push(urlStr);
    console.log(urlStr);
    url = new URL(urlStr);
    hostname = url.hostname;
    baseUrl = url.protocol + "//" + url.hostname;
    return new Promise(crawl)
};

function collectInternalLinks(url, $) {
    let allRelativeLinks = [];

    let relativeLinks = $("a[href^='/'], a[href^='?'], a[href*='\"+hostname+\"']," +
        " a:not([href^='mailto']):not([href$='.js']):not([href$='.css'])");
    relativeLinks.each(function () {
        let link = baseUrl + $(this).attr('href');
        if (!(link in allRelativeLinks))
            allRelativeLinks.push(link);
    });

    allRelativeLinks.forEach(link => {
        if (!pagesToVisit.includes(link) && pagesVisited[link] === undefined)
            pagesToVisit.push(link);
    });

    pagesVisited[url].id = "" + numPagesVisited;
    pagesVisited[url].name = $("title").text();
    pagesVisited[url].url = url;
    pagesVisited[url].links = allRelativeLinks;
}

function crawl(resolve) {
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        crawl(resolve);
    } else if (nextPage !== undefined) {
        visitPage(nextPage, resolve, crawl);
    }
    else if (pagesToVisit.length === 0) {
        console.log("resolve");
        let data = Object.values(pagesVisited);
        data.forEach(node => {
                let relatesTo = [];
                node.links.forEach(link => {
                    if (pagesVisited[link] !== null && pagesVisited[link] !== undefined &&
                        pagesVisited[link].id !== undefined && !relatesTo.includes(pagesVisited[link].id)) {
                        relatesTo.push(pagesVisited[link].id);
                    }
                });
                node.relatesTo = relatesTo;
                delete node.links;
            }
        );
        resolve(data);
    }
}

function visitPage(url, resolve, callback) {
    request(url, function (error, response, body) {
        if (!response || response.statusCode !== 200) {
            callback(resolve);
            return;
        }
        pagesVisited[url] = {};
        numPagesVisited++;
        // Parse the document body
        var $ = cheerio.load(body);
        // var isWordFound = searchForWord($, SEARCH_WORD);
        // if(isWordFound) {
        //     console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
        // } else {
        collectInternalLinks(url, $);
        callback(resolve);
        // }
    });
}

function searchForWord($, word) {
    var bodyText = $('html > body').text().toLowerCase();
    return (bodyText.indexOf(word.toLowerCase()) !== -1);
}


module.exports.generateLinks = generateLinks;