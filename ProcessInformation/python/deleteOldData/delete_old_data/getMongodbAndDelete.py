from datetime import datetime
import pymongo
import time

while (True):
    try:
        now = datetime.now()
        if now.hour == 4 & now.minute == 0 & now.second == 0:

            client = pymongo.MongoClient("localhost", 26543)

            database_name = "twitter_api"
            database = client[database_name]

            collection = database.collection_names(include_system_collections=False)
            for collect in collection:
                if "mapReduce" in collect:
                    database.drop_collection(collect)

            print("delete mapreduce data and wait 2 hours")

    except Exception as e:
        print(e)

    print("wait 2 hours")
    time.sleep(7200)
