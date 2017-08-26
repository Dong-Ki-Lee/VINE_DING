from http.client import IncompleteRead

from tweepy.streaming import StreamListener
from pymongo import MongoClient

from tweepy import OAuthHandler
from tweepy import Stream
import json

from urllib3.exceptions import ProtocolError

access_token = "892006530941202432-RrpdVwsIFk1epMMxUmH78ajLJkdgCxG";
access_token_secret = "u0VioiUGtLBfYvewg9iXb14dh5XaVfIXCsqdgWEi7CVOa";
consumer_key = "v669aHLKMEjt7lKOK4S4x34fO";
consumer_secret = "UkmJ5RtnckaX0DbrnU3dynTpAXGKGFx9utT8aF3xes5llhrnmc";

client = MongoClient('localhost', 26543)
db = client.twitter_api
coll = db.twitter_data
all_coll = db.twitter_all_data


class StdOutListener(StreamListener):
    def on_data(self, data):
        print("save")
        try:
            tweet = json.loads(data)
            created_at = tweet["created_at"]
            id_str = tweet["id_str"]
            text = tweet["text"]

            obj = {"created_at": created_at, "id_str": id_str, "text": text}
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