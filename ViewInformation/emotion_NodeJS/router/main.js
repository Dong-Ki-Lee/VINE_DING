
module.exports = function(app) {
	app.get('/',function(req, res) {
		res.render('search.html')
	});

	app.get('/searchEmotion', function(request, response) {
//		response.render('loading.html');
		var search_word = request.query.search_word;


		var MongoClient = require('mongodb').MongoClient, assert = require('assert');
		var url = 'mongodb://localhost:26543/twitter_api';
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			console.log("connected successfully to server");
			var test_emotion = db.collection('test_emotion_data');

            var map = function() {
                emit(this.created_at, this.emotion);
            };

            var reduce = function(keyCreatedAt, valuesEmotion) {
                emotion_values = { positive: 0, negative: 0 };
                for (var counter = 0; counter < valuesEmotion.length; counter++) {
                    if (valuesEmotion[counter] > 5) {
                        emotion_values.positive++;
                    } else {
                        emotion_values.negative++;
                    }
                }
                return emotion_values;
            };

            db.collection('test_emotion_data').mapReduce(
                map,
                reduce,
                {"out": {"replace": "map_reduce_test" }}
                , function(err, coll) {
                    coll.find({}).toArray(function(err, results){
                       response.send(JSON.stringify(results));
                    })
                    //response.send(JSON.stringify({result:true}));
                    //response.send("<html><body><h1>Hello,World!</h1></body></html>");
                });
			
		});
	});
};
