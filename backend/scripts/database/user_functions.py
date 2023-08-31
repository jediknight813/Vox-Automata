import pymongo
import os
from dotenv import load_dotenv
import json
load_dotenv()
from bson import ObjectId
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
import base64
import requests
A1111_URL = os.getenv("A1111_URL")
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]
from .image_functions import handle_image_generation


def insert_entry(data, collection_name):
    data = handle_image_generation(collection_name, data, "new")
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


def update_single_user_entry(collection_name, username, _id, new_entry):
    collection = db[collection_name]
    new_entry = handle_image_generation(collection_name, new_entry, "update")
    new_entry.pop("_id")
    
    # Find the document where the 'username' field matches the provided username and '_id' matches the given _id
    query = {"username": username, "_id": ObjectId(_id)}
    update_result = collection.update_one(query, {"$set": new_entry})

    if update_result.modified_count > 0:
        return {"message": "Entry updated successfully"}
    else:
        return {"message": "No entry was updated"}
    