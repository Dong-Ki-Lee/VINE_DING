var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/emotion', function(request, response) {

    var search_word = request.query.search_word;
    request.session.search_word = search_word;
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("connected successfully to server");
        var table_name = search_word + "mapReduce";
        console.log(table_name);
        db.listCollections({name: table_name}).next(function (err, collinfo) {
            if (collinfo) {
                response.render('emotion_view.html');
            } else {
                response.render('mapreduce_request.html');
            }
        })
    })
});

router.get('/searchEmotion', function(request, response) {

    var search_word = request.session.search_word;
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("connected successfully to server");
        var table_name = search_word + "mapReduce";
        console.log(table_name);
        db.listCollections({name : table_name}).next(function(err, collinfo) {
            if(collinfo) {

                console.log(table_name + "exist and return result");

                db.collection(table_name).find({}).toArray(function(err, results){
                    console.log(results);
                    response.send(results);
                })
            }
        })
    })
});

module.exports = router;