var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var parser = require('../public/javascripts/linkstable');
var router = express();

router.get('/', function (req, res, next) {
    res.render('generator');
});

router.post('/', (req, res, next) => {
    // http://www.arstechnica.com
    res.render('links', {url: req.body.url});
});

router.post('/load', (req, res) => {
    const data = parser.generateLinks(req.body.data);
    data.then(function (d) {
        res.send({data: d});
    })
});

router.post('/download', (req, res) => {
    var data = req.body.data;
    console.log(data)
    var json = JSON.stringify(data);
    var filename = 'nodes.json';
    var mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition','attachment; filename='+filename);
    res.send( json );
});

router.post('/graph', (req, res) => {
    res.render('graph', {data: req.body.data});
})

module.exports = router;
