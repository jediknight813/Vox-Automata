import pymongo
import os
from dotenv import load_dotenv
import json
load_dotenv()
from bson import ObjectId
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
from image_generation import generate_image_local, create_image_dream_studio
import base64
import requests
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


def insert_entry(data, collection_name):
    data = handle_image_generation(collection_name, data)


    collection = db[collection_name]
    entry = collection.insert_one(data)

    if entry:
        return {"message": "entry was added"}
    else:
        return {"message": "entry was not added"}


def get_user_entries(collection_name, username):
    entries = []
    collection = db[collection_name]

    # Find documents where the 'username' field matches the provided username
    query = {"username": username}
    cursor = collection.find(query)

    for entry in cursor:
        entry["_id"] = str(entry["_id"])
        entries.append(entry)

    return entries


def get_single_user_entry(collection_name, username, _id):
    entries = []
    collection = db[collection_name]

    # Find documents where the 'username' field matches the provided username
    query = {"username": username, "_id": ObjectId(_id)}
    cursor = collection.find(query)

    for entry in cursor:
        entry["_id"] = str(entry["_id"])
        entries.append(entry)

    return entries


def add_value_document(collection_name, document_id, field_name, field_value):
    collection = db[collection_name]

    query = {"_id": ObjectId(document_id)}
    update = {"$set": {field_name: field_value}}

    result = collection.update_one(query, update, upsert=True)

    if result.modified_count > 0 or result.upserted_id:
        return {"message": "Field updated or added successfully"}
    else:
        return {"message": "No changes made"}


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
        "messages": game_entry["messages"]
    }

    return {"message": data}


def get_all_npc_characters(collection_name):
    collection = db[collection_name]

    npc_characters = []
    cursor = collection.find({})

    for npc in cursor:
        npc_characters.append(npc)

    return npc_characters


def update_game_messages(username, _id, new_value):
    collection = db["Games"]
    query = {"username": username, "_id": ObjectId(_id)}
    update_result = collection.update_one(query, {"$push": {"messages": new_value}})


    if update_result.modified_count > 0:
        return {"message": "Value added to the list successfully"}
    else:
        return {"message": "No changes were made"}


def update_single_user_entry(collection_name, username, _id, new_entry):
    collection = db[collection_name]
    new_entry.pop("_id")
    new_entry = handle_image_generation(collection_name, new_entry)

    # Find the document where the 'username' field matches the provided username and '_id' matches the given _id
    query = {"username": username, "_id": ObjectId(_id)}
    update_result = collection.update_one(query, {"$set": new_entry})

    if update_result.modified_count > 0:
        return {"message": "Entry updated successfully"}
    else:
        return {"message": "No entry was updated"}



def check_url(url, timeout=200): 
    try:
        response = requests.get(url, timeout=timeout)
        return response.status_code == 200
    except (requests.ConnectionError, requests.Timeout):
        return False


def handle_image_generation(collection_name, data): 
    use_local_image_generation = check_url(url=f'{A1111_URL}/info')
    print("is using local image gen: ", use_local_image_generation)
    if collection_name == "NpcCharacters":

        if use_local_image_generation == True:
            image_path = generate_image_local(512, 512, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, {data["appearance"]}, and is wearing {data["wearing"]}, detailed, amazing. ')
        else:
            image_path = create_image_dream_studio(512, 512, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, {data["appearance"]}, and is wearing {data["wearing"]}, detailed, amazing. ')


        with open(image_path, "rb") as image_file:
            base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
            data["image_base64"] = base64_encoded
            os.remove(image_path)

    if collection_name == "PlayerCharacters":

        if use_local_image_generation == True:
            image_path = generate_image_local(512, 512, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, and is wearing {data["wearing"]}, detailed, amazing. ')
        else:
            image_path = create_image_dream_studio(512, 512, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, and is wearing {data["wearing"]}, detailed, amazing. ')

        with open(image_path, "rb") as image_file:
            base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
            data["image_base64"] = base64_encoded
            os.remove(image_path)


    return data


def remove_user_entry(collection_name, username, _id):
    collection = db[collection_name]

    # Define the query to find the specific document
    query = {"username": username, "_id": ObjectId(_id)}

    # Remove the document that matches the query
    result = collection.delete_one(query)

    if result.deleted_count == 1:
        return f"Entry with _id {_id} has been successfully removed."
    else:
        return f"No entry with _id {_id} found for username {username}."


def create_user(username, password):
    # check if user exists.f
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
