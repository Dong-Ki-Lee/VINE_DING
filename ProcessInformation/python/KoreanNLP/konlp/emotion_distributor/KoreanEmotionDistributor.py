import konlpy
import nltk
import random
import time
from datetime import datetime
from bson.json_util import dumps, loads
from pymongo import MongoClient

#connect MongoDB
client = MongoClient('localhost', 26543)
db = client.twitter_api
korean_coll = db.twitter_korean_data
test_coll = db.test_emotion_data

#cursor counter
counter = 33813

while True:
    try:
        print("start this point")
        print(counter)
        cursor = db.twitter_korean_data.find().skip(counter)
        #extract text with korean
        for document in cursor:
            document = dumps(document)
            document_loaded = loads(document)
            created_at = document_loaded["created_at"]
            d = datetime.strptime(created_at, '%a %b %d %H:%M:%S %z %Y')
            created_at = d.strftime('%Y%m%d');
            id_str = document_loaded["id_str"]
            text = document_loaded["text"]
            obj = {"created_at": created_at, "id_str": id_str, "text": text, "emotion": random.randrange(1, 11)}
    #        print(obj)
            test_coll.insert_one(obj)
            print("saved split korean data")
            counter += 1
    except:
        print("occur some error")
        print("maybe saved this point")
        print(counter)

    print("maybe saved this point")
    print(counter)
    print("wait 120 minute")
    time.sleep(144003)



