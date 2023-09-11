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
import time


def insert_entry(data, collection_name):
    data = handle_image_generation(collection_name, data, "new")
    collection = db[collection_name]

    # sets the time it was last modified
    current_timestamp = int(time.time() * 1000)
    timestamp_str = str(current_timestamp)
    data["last_modified"] = timestamp_str


    entry = collection.insert_one(data)

    if entry:
        return {"message": "entry was added"}
    else:
        return {"message": "entry was not added"}


def get_user_entries(collection_name, username, page_number=1, page_size=10):
    entries = []
    collection = db[collection_name]

    # Find documents where the 'username' field matches the provided username
    query = {"username": username}

    # Count the total number of documents that match the query
    total_count = collection.count_documents(query)

    # Calculate the skip value and limit for the current page
    skip = (page_number - 1) * page_size
    limit = page_size

    # Retrieve documents for the current page
    cursor = collection.find(query).skip(skip).limit(limit)

    for entry in cursor:
        entry["_id"] = str(entry["_id"])
        entries.append(entry)

    # Calculate if there are more pages
    more_pages = (skip + limit) < total_count

    return entries, more_pages


def get_single_user_entry(collection_name, username, _id):
    entries = []
    collection = db[collection_name]

    # Find documents where the 'username' field matches the provided username
    query = {"username": username, "_id": ObjectId(_id)}
    cursor = collection.find(query)

    # sets the time it was last modified
    # current_timestamp = int(time.time() * 1000)
    # timestamp_str = str(current_timestamp)
    
    # add_value_document(collection_name, _id, "last_modified", timestamp_str)

    for entry in cursor:
        entry["_id"] = str(entry["_id"])
        entries.append(entry)

    return entries


def update_user_profile_stat(username, field_name, field_value):
    collection = db["user"]
    query = {"username": username}
    user_profile = collection.find_one(query)

    if field_name in user_profile:
        updated_value = (int(user_profile[field_name])+int(field_value))
        add_value_document("user", user_profile["_id"], field_name, updated_value)
    else:
        add_value_document("user", user_profile["_id"], field_name, field_value)


def get_profile_stats(username):
    collection = db["user"]
    query = {"username": username}
    user_profile = collection.find_one(query)

    stats = {}
    stats["generated_words"] = user_profile["generated_words"]
    stats["typed_words"] = user_profile["typed_words"]
    stats["profile_image_id"] = user_profile["profile_image_id"]

    return stats


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

    # sets the time it was last modified
    current_timestamp = int(time.time() * 1000)
    timestamp_str = str(current_timestamp)
    new_entry["last_modified"] = timestamp_str
    
    # Find the document where the 'username' field matches the provided username and '_id' matches the given _id
    query = {"username": username, "_id": ObjectId(_id)}
    update_result = collection.update_one(query, {"$set": new_entry})

    if update_result.modified_count > 0:
        return {"message": "Entry updated successfully"}
    else:
        return {"message": "No entry was updated"}
    