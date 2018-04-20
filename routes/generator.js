var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var parser = require('../public/scripts/linkstable');
var router = express();

router.get('/', function (req, res, next) {
    res.render('generator');
});

router.post('/', function (req, res, next) {
    // http://www.arstechnica.com
    res.render('links', {url: req.body.url});
});

module.exports = router;
