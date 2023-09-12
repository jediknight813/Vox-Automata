import pymongo
import os
from dotenv import load_dotenv
import json
load_dotenv()
from bson import ObjectId
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
A1111_URL = os.getenv("A1111_URL")
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]
from .user_functions import add_value_document, get_single_user_entry
import time


def check_for_streaming_message(game_id, username):
    current_game = get_single_user_entry("Games", username, game_id)
    
    if "streaming_message" in current_game:
        return current_game["streaming_message"]
    else:
        add_value_document("Games", game_id, "streaming_message", "")
        return ""


def update_streaming_message(game_id, message):
    print(message)
    add_value_document("Games", game_id, "streaming_message", message)


def get_user_game(collection_name, username, _id):
    collection = db[collection_name]

    # Find a single document where the 'username' field matches the provided username and '_id' matches the provided _id
    query = {"username": username, "_id": ObjectId(_id)}
    game_entry = collection.find_one(query)

    if game_entry:
        game_entry["_id"] = str(game_entry["_id"])

    if game_entry == None:
        return {"message": "game not found."}

    if "messages" not in game_entry:
        add_value_document(collection_name, _id, "messages", [])
        game_entry["messages"] = []

    current_timestamp = int(time.time() * 1000)
    timestamp_str = str(current_timestamp)
    add_value_document(collection_name, _id, "last_modified", timestamp_str)


    Scenario = get_single_user_entry("Scenarios", username, game_entry["scenario"])
    Npc = get_single_user_entry("NpcCharacters", username, Scenario[0]["npc"])
    Player = get_single_user_entry("PlayerCharacters", username, Scenario[0]["player"])


    data = {
        "game_id": game_entry["_id"],
        "name": game_entry["name"],
        "username": Scenario[0]["username"],
        "scenario": Scenario[0],
        "player": Player[0],
        "npc": Npc[0],
        "messages": game_entry["messages"],
        "last_modified": timestamp_str
    }

    return {"message": data}


def get_user_games(username, page_number=1, page_size=10):
    user_games = []

    collection = db["Games"]
    query = {"username": username}

    # Count the total number of documents that match the query
    total_count = collection.count_documents(query)

    # Calculate the skip value and limit for the current page
    skip = (page_number - 1) * page_size
    limit = page_size

    # Retrieve documents for the current page
    cursor = collection.find(query).skip(skip).limit(limit).sort("date_modified", pymongo.DESCENDING)

    for entry in cursor:
        total_words = 0

        if "messages" in entry:
            entry["number_of_messages"] = len(entry["messages"])

            if len(entry["messages"]) >= 1:
                for b in entry["messages"]:
                    total_words += len(b["name"].split(" ")+b["message"].split(" "))

                
            
            entry["total_words"] = total_words
            del entry["messages"]

        entry["_id"] = str(entry["_id"])
        print(entry)
        user_games.append(entry)


    # Calculate if there are more pages
    more_pages = (skip + limit) < total_count

    return user_games, more_pages


def update_game_messages(username, _id, new_value):
    collection = db["Games"]
    query = {"username": username, "_id": ObjectId(_id)}
    update_result = collection.update_one(query, {"$push": {"messages": new_value}})


    if update_result.modified_count > 0:
        return {"message": "Value added to the list successfully"}
    else:
        return {"message": "No changes were made"}