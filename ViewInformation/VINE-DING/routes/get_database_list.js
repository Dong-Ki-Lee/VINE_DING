/*
작성자 : DongKi Lee
수정일 : 2018-05-13
기능 : 
1. 요청을 받으면 현재 데이터베이스에 쌓인 sns 데이터의 양을 giga byte 단위로 보여준다.
change log : 
2018-05-13 : 설명 추가
*/

var express = require('express');
var router = express.Router();
//용량을 파악하기 위한 요청을 처리함

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
