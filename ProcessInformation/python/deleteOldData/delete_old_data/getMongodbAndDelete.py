'''
작성자 : DongKi Lee
기록 시작일 : 2018-06-02
기능 :
일정 시간마다 돌면서, 하루에 한번씩 계산된 데이터를 초기화 해주는 모듈
change log :
2018-06-02 : 설명 추가
2018-06-02 : 중복되는 부분 수정
2018-06-07 : delete loop, enroll in crontab this program.
'''

from datetime import datetime
import pymongo
import time

MONGODB_PORT = 26543
MONGODB_IP = "localhost"

try:
    client = pymongo.MongoClient(MONGODB_IP, MONGODB_PORT)

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
