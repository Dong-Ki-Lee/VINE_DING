import smtplib
import pymongo
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

MAIL_ACCOUNT = "vinedingproject@gmail.com"
MAIL_PASSWORD = "yourpassword"
TITLE = "VINE-DING 에서 당신의 검색어가 준비 되었음을 알려드립니다."
CONTENT = "저희 VINE-DING 을 이용해 주셔서 감사합니다. 다음 링크를 클릭하여 당신의 검색어를 확인해 주세요 http://vineding.tk/emotion?search_word="


def send_via_gmail(to, title, description):
    from_address = MAIL_ACCOUNT
    msg = get_message_formatted(from_address, to, title, description)

    try:
        s = smtplib.SMTP('smtp.gmail.com:587')
        s.starttls()
        s.login(MAIL_ACCOUNT, MAIL_PASSWORD)
        s.sendmail(from_address, to, msg.as_string())

    except Exception as e:
        print(e)
        print("error")

def get_message_formatted(from_address, to, title, description):
    msg = MIMEMultipart('localhost')
    msg['Subject'] = title
    msg['From'] = from_address

    content = MIMEText(description, 'plain', _charset="utf-8")
    msg.attach(content)
    return msg

def confirm_search_list(search_word):
    try:
        client = pymongo.MongoClient("localhost", 26543)

        database_name = "email_list"
        database = client[database_name]
        collection = database.email_list

        list = collection.find({"search_word": search_word})
        for i in list:
            print(i['email'])
            send_via_gmail(i['email'], TITLE, CONTENT+search_word)

        collection.remove({"search_word": search_word})

    except Exception as e:
        print(e)

while (True):
    try:
        client = pymongo.MongoClient("localhost", 26543)

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
