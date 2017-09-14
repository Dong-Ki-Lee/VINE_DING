import csv
import time
from datetime import datetime
from bson.json_util import dumps, loads
from pymongo import MongoClient

#connect MongoDB
client = MongoClient('localhost', 26543)
db = client.twitter_api
korean_coll = db.twitter_korean_data
emotion_coll = db.twitter_korean_emotion_data_v1

#cursor counter
counter = 6776788
time.sleep(3600)
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
            emotion = 0

            file = open('./polarity.csv', 'r')
            CSVReader = csv.reader(file)
            for dict in CSVReader:
                if dict[0] in text:
                    if "POS" in dict[7]:
                        emotion += float(dict[8])
                    if "NEG" in dict[7]:
                        emotion -= float(dict[8])

            obj = {"created_at": created_at, "id_str": id_str, "text": text, "emotion": emotion}

            emotion_coll.insert_one(obj)
            print("saved split korean data")
            counter += 1
    except Exception as e:
        print(e)
        print("occur some error")
        print("maybe saved this point")
        print(counter)

    print("maybe saved this point")
    print(counter)
    print("wait 4 hours")
    time.sleep(14400)



