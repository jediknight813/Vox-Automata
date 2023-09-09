import pymongo
import os
from dotenv import load_dotenv
import json
import bcrypt
load_dotenv()
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
A1111_URL = os.getenv("A1111_URL")
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]
from jwt_token_creator import create_jwt_token


def create_user(username, password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    collection = db["user"]
    user = collection.insert_one(
        {
            "username": username, 
            "password": hashed_password.decode('utf-8'),
            "generated_words": 0,
            "typed_words": 0,
            "profile_image_id": ""
        }
    )
    return login_user(username, password)


def login_user(username, password):
    collection = db["user"]
    user = collection.find_one({"username": username})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        access_token = create_jwt_token(data={"sub": username})
        return {"message": "login successful", "username": username, "access_token": access_token}
    else:
        return {"message": "user not found or invalid credentials"}

