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
                response.render('emotion_view_v2.html');
            } else {
                response.render('mapreduce_request_v2.html');
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


router.get('/getNegativeEmotion', function(request, response) {

    var search_word = request.session.search_word;
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("connected successfully to server");
        db.listCollections({name : "twitter_korean_emotion_data_v1"}).next(function(err, collinfo) {
            if(collinfo) {

                var find_option = {emotion: {$lte: -20}, text:{$regex:search_word}};
                db.collection("twitter_korean_emotion_data_v1").find(find_option).limit(4).toArray(function(err, results){
                    console.log(results);
                    response.send(results);
                })
            }
        })
    })
});


router.get('/getPositiveEmotion', function(request, response) {

    var search_word = request.session.search_word;
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    var url = 'mongodb://localhost:26543/twitter_api';
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("connected successfully to server");
        db.listCollections({name : "twitter_korean_emotion_data_v1"}).next(function(err, collinfo) {
            if(collinfo) {

                var find_option = {emotion: {$gte: 12}, text:{$regex:search_word}};
                db.collection("twitter_korean_emotion_data_v1").find(find_option).limit(4).toArray(function(err, results){
                    console.log(results);
                    response.send(results);
                })
            }
        })
    })
});
module.exports = router;