var express = require('express');
var router = express.Router();

router.get('/mapreduceRequest', function(request, response) {

    var request_email = request.query.request_email;

    var search_word = request.session.search_word;
    var MongoClient = require('mongodb').MongoClient, assert = require('assert');
    var url = 'mongodb://localhost:26543/twitter_api';

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

            for(counter in valuesEmotion) {
                positive += valuesEmotion[counter].positive;
                negative += valuesEmotion[counter].negative;
            }

            return {positive : positive, negative : negative};
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


        )
    });
    response.render('index.html')
});

module.exports = router;