'''
작성자 : DongKi Lee
수정일 : 2018-06-01
기능 : 
1. 트위터의 데이터를 서버의 mongodb에 저장함.
2. 저장하는 데이터의 형식은
    a. 트위터에서 받아오는 전체 데이터
    b. 한글이 포함된 글의 전체 데이터
    c. 한글이 포함된 글의 감정분석 데이터
    위와 같다.

change log : 
2018-06-01 : 설명 추가
need to change :
1. 감정분석 알고리즘의 개선이 필요함
2. 예외처리시에 다른 처리들이 필요함
'''

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

# 트위터 api access 코드
access_token = "yours"
access_token_secret = "yours"
consumer_key = "yours"
consumer_secret = "yours"

# 이 프로그램의 서버는 mongodb의 포트로 26543번을 사용.
client = MongoClient('localhost', 26543)
db = client.twitter_api
coll = db.twitter_data
all_coll = db.twitter_all_data
korean_coll = db.twitter_korean_data
emotion_coll = db.twitter_korean_emotion_data_v1

# 정규식으로 한글을 포함하고 있는 데이터를 판단
korean = re.compile('.*[ㄱ-ㅣ가-힣]+.*')

# output data를 받을 listener를 정의. 여기서 받은 데이터를 처리함.
class StdOutListener(StreamListener):
    def on_data(self, data):
        print("save")
        try:
            tweet = json.loads(data)
            created_at = tweet["created_at"]
            id_str = tweet["id_str"]
            text = tweet["text"]

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