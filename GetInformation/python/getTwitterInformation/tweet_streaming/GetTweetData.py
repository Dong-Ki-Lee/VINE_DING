from http.client import IncompleteRead

from tweepy.streaming import StreamListener
from pymongo import MongoClient

from tweepy import OAuthHandler
from tweepy import Stream

from datetime import datetime

import csv
import json
import re

from urllib3.exceptions import ProtocolError

access_token = "yours"
access_token_secret = "yours"
consumer_key = "yours"
consumer_secret = "yours"

client = MongoClient('localhost', 26543)
db = client.twitter_api
coll = db.twitter_data
all_coll = db.twitter_all_data
korean_coll = db.twitter_korean_data
emotion_coll = db.twitter_korean_emotion_data_v1

#regular expression
korean = re.compile('.*[ㄱ-ㅣ가-힣]+.*')

class StdOutListener(StreamListener):
    def on_data(self, data):
        print("save")
        try:
            tweet = json.loads(data)
            created_at = tweet["created_at"]
            id_str = tweet["id_str"]
            text = tweet["text"]

            obj = {"created_at": created_at, "id_str": id_str, "text": text}
            with_korean = korean.match(text)
            if with_korean:
                obj = {"created_at": created_at, "id_str": id_str, "text": text}
                korean_coll.insert_one(obj)
                print("saved korean data")
                created_at = obj["created_at"]
                d = datetime.strptime(created_at, '%a %b %d %H:%M:%S %z %Y')
                created_at = d.strftime('%Y%m%d')
                id_str = obj["id_str"]
                text = obj["text"]
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
                print("saved emotion data")
                emotion_coll.insert_one(obj)
            coll.insert_one(obj)
            all_coll.insert_one(tweet)
        except KeyError:
            print("delete twits")
        except ProtocolError:
            print("protocol error")
        except IncompleteRead:
            print("incomp")
        except AttributeError:
            print("ATTR")
        return True

    def on_error(self, status):
        print("error : ")
        print(status)


if __name__ == '__main__':
    while(True):
        listener = StdOutListener()
        auth = OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        stream = Stream(auth, listener)
        try:
            stream.sample()
        except ProtocolError:
            print("protocol error")
        except:
            print("ev")