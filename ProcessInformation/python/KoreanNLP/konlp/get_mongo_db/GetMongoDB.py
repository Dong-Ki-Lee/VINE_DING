import re
import time
from bson.json_util import dumps, loads
from pymongo import MongoClient

#connect MongoDB
client = MongoClient('localhost', 26543)
db = client.twitter_api
korean_coll = db.twitter_korean_data

#cursor counter
counter = 123950970


#regular expression
korean = re.compile('.*[ㄱ-ㅣ가-힣]+.*')

while True:
    try:
        print("start this point")
        print(counter)
        cursor = db.twitter_data.find().skip(counter)
        #extract text with korean
        for document in cursor:
            document = dumps(document)
            document_loaded = loads(document)
            created_at = document_loaded["created_at"]
            id_str = document_loaded["id_str"]
            text = document_loaded["text"]
            with_korean = korean.match(text)
            if with_korean:
                obj = {"created_at": created_at, "id_str": id_str, "text": text}
                korean_coll.insert_one(obj)
                print("saved korean data")
            counter += 1
    except:
        print("occur some error")
        print("maybe saved this point")
        print(counter)

    print("maybe saved this point")
    print(counter)
    print("wait 4 hours")
    time.sleep(14400)

