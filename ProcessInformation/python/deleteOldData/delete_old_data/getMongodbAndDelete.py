from datetime import datetime
import pymongo
import time

while (True):
    try:
        now = datetime.now()
        if now.hour == 4:

            client = pymongo.MongoClient("localhost", 26543)

            database_name = "twitter_api"
            database = client[database_name]
            email_db = client["email_list"]

            collection = database.collection_names(include_system_collections=False)
            for collect in collection:
                if "mapReduce" in collect:
                    database.drop_collection(collect)
            email_db.drop_collection("email_list")
            print("delete mapreduce data and wait 2 hours")

    except Exception as e:
        print(e)

    print("wait 35")
    time.sleep(2100)
