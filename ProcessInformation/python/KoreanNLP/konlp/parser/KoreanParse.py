import konlpy
import nltk
import time
from bson.json_util import dumps, loads
from pymongo import MongoClient

#connect MongoDB
client = MongoClient('localhost', 26543)
db = client.twitter_api
korean_coll = db.twitter_korean_data
split_korean_coll = db.twitter_split_korean_data

#cursor counter
counter = 0

# Define a chunk grammar, or chunk rules, then chunk
grammar = """
NP: {<N.*>*<Suffix>?}   # Noun phrase
VP: {<V.*>*}            # Verb phrase
AP: {<A.*>*}            # Adjective phrase
"""
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
            id_str = document_loaded["id_str"]
            text = document_loaded["text"]
            words = konlpy.tag.Twitter().pos(text)
            parser = nltk.RegexpParser(grammar)
            chunks = parser.parse(words)
            split_text = ''
            for subtree in chunks.subtrees():
                if subtree.label() == "NP" or subtree.label() == "VP" or subtree.label() == "AP":
                    split_text += ' '.join((e[0] for e in list(subtree))) + ' '
            obj = {"created_at": created_at, "id_str": id_str, "split_text": split_text}
    #        print(obj)
            split_korean_coll.insert_one(obj)
            print("saved split korean data")
            counter += 1
    except:
        print("occur some error")
        print("maybe saved this point")
        print(counter)

    print("maybe saved this point")
    print(counter)
    print("wait 120 minute")
    time.sleep(180)



