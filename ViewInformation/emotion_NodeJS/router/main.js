
module.exports = function(app) {
	app.get('/',function(req, res) {
		res.render('search.html');
	});
	app.get('/index.html', function (req, res) {
        res.render('index.html');
    });
	app.get('/searchEmotion', function(request, response) {

		var search_word = request.query.search_word;

		var MongoClient = require('mongodb').MongoClient, assert = require('assert');
		var url = 'mongodb://localhost:26543/twitter_api';
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			console.log("connected successfully to server");
            var table_name = search_word + "mapReduce"
            console.log(table_name);
            db.listCollections({name : table_name}).next(function(err, collinfo) {
                if(collinfo) {

                    console.log(table_name + "exist and return result");

                    db.collection(table_name).find({}).toArray(function(err, results){
                        //response.render('index', results);
                        console.log(results);
                        response.send(results);
                        //response.send(JSON.stringify(results));
                    })
                } else {
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
                        emit(this.created_at, this.emotion);
                    };

                    var reduce = function(keyCreatedAt, valuesEmotion) {
                        var reduced = {positive : 0, negative : 0};

                        for(var counter = 0; counter < valuesEmotion.length; counter++) {
                            if(valuesEmotion[counter].emotion < 0) {
                                reduced.negative++;
                            } else {
                                reduced.positive++;
                            }
                        }

                        return reduced;
                    };
                    db.collection('twitter_korean_emotion_data_v1').mapReduce(
                        map,
                        reduce,
                        {"out": {"replace": table_name }},
                        function(err, coll) {
                            db.collection(table_name).find({}).toArray(function(err, results){
                                //response.render('index', results);
                                console.log(results);
                               response.send(results.toJSON());
                            })
                            //response.send(JSON.stringify({result:true}));
                        });

                }
            })

		});
	});
};
