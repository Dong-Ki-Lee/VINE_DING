/*
작성자 : DongKi Lee
수정일 : 2018-05-13
기능 : 
각 요청에 대한 설명

/emotion = 검색어를 전달받고, 기존에 계산된 결과면 결과페이지로, 계산해야하는 데이터면 계산요청페이지로 보낸다.

/searchEmotion = 결과창에 보여줄 결과를 데이터베이스에서 읽어들여서 보내줌.

/getNegativeEmotion = 부정적인 데이터를 몇가지 가져옴

/getPositiveEmotion = 긍정적인 데이터를 몇가지 가져옴

change log : 
2018-05-13 : 설명 추가
2018-06-02 : 모듈 호출 var -> const 로 변경
*/

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient, assert = require('assert');

router.get('/emotion', function(request, response) {

    var search_word = request.query.search_word;
    request.session.search_word = search_word;
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
        });
    });
});

router.get('/searchEmotion', function(request, response) {

    var search_word = request.session.search_word;
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
                });
            }
        });
    });
});


router.get('/getNegativeEmotion', function(request, response) {

    var search_word = request.session.search_word;
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
                });
            }
        });
    });
});


router.get('/getPositiveEmotion', function(request, response) {

    var search_word = request.session.search_word;
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
                });
            }
        });
    });
});

module.exports = router;