var express = require('express');
var router = express.Router();

/* POST url generating. */
router.get('/', function(req, res, next) {
    res.render('generator');
});

router.post('/', function(req, res, next) {
    res.send(req);
});

module.exports = router;
