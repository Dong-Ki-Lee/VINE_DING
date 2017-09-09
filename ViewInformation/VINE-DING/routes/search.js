var express = require('express');
var router = express.Router();

router.get('/search', function(req, res, next) {
    res.render('search.html');
});

router.get('/search_get', function(req, res) {
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {
        db.listCollections().toArray(function(err, collinfo) {
            res.send(collinfo);
        });
    });
});

module.exports = router;
