/*
작성자 : DongKi Lee
수정일 : 2018-05-13
기능 : 
1. 요청을 받으면 현재 데이터의 갯수를 보내줌
change log : 
2018-05-13 : 설명 추가
*/

var express = require('express');
var router = express.Router();
//데이터의 갯수를 파악하기 위한 요청을 처리함

router.get('/getDatabaseData', function(request, response) {

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:26543/twitter_api';
    
    MongoClient.connect(url, function(err, db) {
        db.collection('twitter_data').count(function(err, count) {
            console.log(count);
            var returnValue = {count: count};
            response.send(returnValue);
        });
        db.admin().listDatabases(function(err, lists) {
        });
    });
});

module.exports = router;
