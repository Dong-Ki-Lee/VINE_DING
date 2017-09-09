var express = require('express');
var router = express.Router();

router.get('/getDatabaseData', function(request, response) {

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {
        db.collection('twitter_data').count(function(err, count) {
            console.log(count);
        });
        response.render('index.html');
    });
});

module.exports = router;
