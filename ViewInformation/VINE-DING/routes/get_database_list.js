var express = require('express');
var router = express.Router();

router.get('/getDatabaseList', function(request, response) {

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {

        db.admin().listDatabases(function(err, lists) {
            var gbytes = 0;
            console.log(parseInt(lists.totalSize));
            gbytes = parseInt(lists.totalSize) / (1024 * 1024 * 1024);
            gbytes = Math.round(gbytes);
            response.send(gbytes.toString());

        });
    });
});

module.exports = router;
