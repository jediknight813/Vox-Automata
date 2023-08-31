import pymongo
import os
from dotenv import load_dotenv
import json
load_dotenv()
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
A1111_URL = os.getenv("A1111_URL")
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]


def login_user(username, password):
    collection = db["user"]
    user = collection.find_one({"username": username, "password": password})
 
    if user:
        user["_id"] = str(user["_id"])
        return {"message": user}
    else:
        return {"message": "user not found"}


def create_user(username, password):
    # check if user exists.
    user_check = login_user(username, password)
    if user_check["message"] != "user not found":
        return {"message": "user exists"}


    collection = db["user"]
    user = collection.insert_one(
        {
            "username": username, 
            "password": password
        }
    )

    return login_user(username, password)

