import pymongo
import os
from dotenv import load_dotenv
import json
load_dotenv()
from bson import ObjectId
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
import base64
from bson import ObjectId
from image_generation import generate_image_local

client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]


def add_value_document(collection_name, document_id, field_name, field_value):
    collection = db[collection_name]

    query = {"_id": document_id}
    update = {"$set": {field_name: field_value}}

    result = collection.update_one(query, update, upsert=True)

    if result.modified_count > 0 or result.upserted_id:
        print("added value")
        return {"message": "Field updated or added successfully"}
    else:
        print("value not added")
        return {"message": "No changes made"}


def insert_entry(data, collection_name):
    collection = db[collection_name]
    entry = collection.insert_one(data)

    if entry:
        return entry
    else:
        return {"message": "entry was not added"}


def add_images_to_cards(collection_name):
    collection = db[collection_name]
    all_documents = collection.find()

    for character in all_documents:
        if "name" in character and "wearing" in character:
            image_path = generate_image_local(512, 512, f'{character["gender"]} portrait, and is wearing {character["wearing"]}, detailed, amazing. ')
            print(character)
            with open(image_path, "rb") as image_file:
                base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
                add_value_document(collection_name, ObjectId(character["_id"]), "image_base64", base64_encoded)


def add_images_npc_images_to_cards(collection_name):
    collection = db[collection_name]
    all_documents = collection.find()

    for character in all_documents:
        if "name" in character and "wearing" in character:
            print(character)
            image_path = generate_image_local(512, 512, f'{character["gender"]} portrait, half body, headshot, facing camera, {character["appearance"]}, and is wearing {character["wearing"]}, detailed, amazing. ')
            print(character)
            with open(image_path, "rb") as image_file:
                base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
                add_value_document(collection_name, ObjectId(character["_id"]), "image_base64", base64_encoded)


add_images_to_cards("PlayerCharacters")

add_images_npc_images_to_cards("NpcCharacters")