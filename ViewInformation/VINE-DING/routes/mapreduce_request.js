/*
작성자 : DongKi Lee
수정일 : 2018-05-13
기능 : 
1. 이메일정보, 검색어 정보를 포함한 연산 요청을 받는다.
2. 받은 이메일 정보와 검색어 정보를 데이터베이스에 저장한다.
3. 기존에 처리되어있는 검색어 인지 확인하고, 있다면 바로 다음페이지로 넘긴다.
4. 새로 처리해야 한다면, 감정을 처리하는 map reduce 연산을 실행시킨다.
5. map reduce 연산을 실행한 후에 다음 페이지로 넘어간다.
change log : 
2018-05-13 : 설명 추가
*/

var express = require('express');
var router = express.Router();
//MongoDB에 내장되어있는 map reduce 연산을 요청하고 그 결과를 받음.

router.get('/mapreduceRequest', function(request, response) {

    var request_email = request.query.request_email;

    var search_word = request.session.search_word;
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    var url = 'mongodb://localhost:26543/twitter_api';
    var save_email_list_url = 'mongodb://localhost:26543/email_list';

    MongoClient.connect(save_email_list_url, function(err, db) {
        db.collection('email_list').insertOne( {
            email : request_email,
            search_word : search_word
        });

        colls = db.collection('email_list').find({"search_word": search_word}).toArray(function (err, documents) {
            console.log(documents.length);
            if(documents.length > 1) {
                console.log("direct go");
                response.render('inter_page_v1.html');
            } else {

                console.log("calculate");
                MongoClient.connect(url, function(err, db) {
                    assert.equal(null, err);
                    console.log("connected successfully to server");
                    var table_name = search_word + "mapReduce";
                    console.log(table_name);
                    var dt = new Date();
                    dt.setDate(dt.getDate() - 10);
                    function dateToYYYYMMDD(date){
                        function pad(num) {
                            num = num + '';
                            return num.length < 2 ? '0' + num : num;
                        }
                        return date.getFullYear() + pad(date.getMonth()+1) + pad(date.getDate());
                    }

                    var search_created_at = dateToYYYYMMDD(dt);
                    console.log(search_created_at);

                    var map = function() {
                        if(this.created_at >= search_created_at) {
                            if(this.text.contains(search_word)) {
                                if(this.emotion < -2) {
                                    emit(this.created_at, {positive : 0, negative : 1});
                                } else {
                                    emit(this.created_at, {positive : 1, negative : 0});
                                }
                            }
                        }

                    };

                    var reduce = function(keyCreatedAt, valuesEmotion) {
                        var positive = 0;
                        var negative = 0;

                        for(var counter in valuesEmotion) {
                            positive += valuesEmotion[counter].positive;
                            negative += valuesEmotion[counter].negative;
                        }

                        return {positive : positive, negative : negative, count : 1};
                    };

                    db.collection('twitter_korean_emotion_data_v1').mapReduce(
                        map,
                        reduce,
                        {
                            "out": {"replace": table_name },
                            "scope" : {
                                "search_created_at" : search_created_at,
                                "search_word" : search_word
                            }
                        }


                    );
                });
                response.render('inter_page_v1.html');
            }
        });

    });



});

module.exports = router;
