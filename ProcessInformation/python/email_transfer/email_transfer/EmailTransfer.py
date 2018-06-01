'''
작성자 : DongKi Lee
기록 시작일 : 2018-06-02
기능 : 
계산 요청을 한 고객들의 요청이 완료 되었을 경우,
해당 고객들에게 이메일을 자동으로 보내주는 모듈
change log : 
2018-06-02 : 설명 추가
2018-06-02 : 중복되는 부분 
'''

import smtplib
import pymongo
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

MAIL_ACCOUNT = "your gmail account id"
MAIL_PASSWORD = "your gmail account pw"
TITLE = "VINE-DING 에서 당신의 검색어가 준비 되었음을 알려드립니다."
CONTENT = "저희 VINE-DING 을 이용해 주셔서 감사합니다. 다음 링크를 클릭하여 당신의 검색어를 확인해 주세요 http://vineding.tk/emotion?search_word="
MONGODB_PORT = 26543
MONGODB_IP = "localhost"


def sending_email_using_gmail(to, title, description):
    from_address = MAIL_ACCOUNT
    msg = get_message_formatted(from_address, to, title, description)

    try:
        smtp = smtplib.SMTP('smtp.gmail.com:587')
        smtp.starttls()
        smtp.login(MAIL_ACCOUNT, MAIL_PASSWORD)
        smtp.sendmail(from_address, to, msg.as_string())

    except Exception as e:
        print(e)
        print("email_send_error")

def get_message_formatted(from_address, to, title, description):
    msg = MIMEMultipart('localhost')
    msg['Subject'] = title
    msg['From'] = from_address

    content = MIMEText(description, 'plain', _charset="utf-8")
    msg.attach(content)
    return msg

def confirm_search_list(search_word):
    try:
        client = pymongo.MongoClient(MONGODB_IP, MONGODB_PORT)

        database_name = "email_list"
        database = client[database_name]
        collection = database.email_list

        list = collection.find({"search_word": search_word})
        for i in list:
            print(i['email'])
            sending_email_using_gmail(i['email'], TITLE, CONTENT+search_word)

        collection.remove({"search_word": search_word})

    except Exception as e:
        print(e)

while (True):
    try:
        client = pymongo.MongoClient(MONGODB_IP, MONGODB_PORT)

        database_name = "twitter_api"
        database = client[database_name]

        collection = database.collection_names(include_system_collections=False)
        for collect in collection:
            if "mapReduce" in collect:
                confirm_search_list(collect.replace('mapReduce', ''))

    except Exception as e:
        print(e)

    print("wait 120 second")
    time.sleep(120)
