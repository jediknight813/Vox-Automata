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
from database.image_functions import create_image_dream_studio, insert_image, handle_image_generation
from database.user_functions import add_value_document
import time

client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]


# def update_single_user_entry(collection_name, username, _id, new_entry):
#     collection = db[collection_name]
#     new_entry.pop("_id")
#     new_entry = handle_image_generation(collection_name, new_entry, "new")

#     # Find the document where the 'username' field matches the provided username and '_id' matches the given _id
#     query = {"username": username, "_id": ObjectId(_id)}
#     update_result = collection.update_one(query, {"$set": new_entry})

#     if update_result.modified_count > 0:
#         return {"message": "Entry updated successfully"}
#     else:
#         return {"message": "No entry was updated"}


# def add_images_to_cards(collection_name):
#     collection = db[collection_name]
#     all_documents = collection.find()

#     for character in all_documents:
#         if "name" in character and "wearing" in character:
#             image_path = create_image_dream_studio(512, 512, f'{character["gender"]} portrait, and is wearing {character["wearing"]}, detailed, amazing. ')
#             print(character)
#             del character["image_base64"]
#             with open(image_path, "rb") as image_file:
#                 base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
#                 entry = insert_image({"image_base64", base64_encoded})

#                 update_single_user_entry(collection_name, ObjectId(character["username"]), "image_id", character["id"])


# def add_images_npc_images_to_cards(collection_name):
#     collection = db[collection_name]
#     all_documents = collection.find()

#     for character in all_documents:
#         if "name" in character and "wearing" in character:
#             print(character)
#             image_path = create_image_dream_studio(512, 512, f'{character["gender"]} portrait, half body, headshot, facing camera, {character["appearance"]}, and is wearing {character["wearing"]}, detailed, amazing. ')
#             print(character)
#             with open(image_path, "rb") as image_file:
#                 base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
#                 add_value_document(collection_name, ObjectId(character["_id"]), "image_id", base64_encoded)


# def delete_document_by_id(collection_name, document_id):
#     collection = db[collection_name]
#     query = {"wearing": "jedi"}
#     result = collection.delete_one(query)
#     if result.deleted_count == 1:
#         print("Document deleted successfully.")
#     else:
#         print("Document not found or not deleted.")

# # Replace 'PlayerCharacters' with your actual collection name and provide the correct document ID
# delete_document_by_id("PlayerCharacters", "64e6b4c0d61aa3377189f8eb")
    # if "image_base64" in character:
    #     imgId = insert_image({"image_base64": character["image_base64"]})
    #     del character["image_base64"]
    #     character["image_base64_id"] = str(imgId)
    #     print(character)
    #     query = {"_id": ObjectId(character["_id"])}
    #     update_result = collection.update_one(query, {"$set": character})

# Scenarios

# 64eff3f2be94d94f49fac3b8

# collection = db["PlayerCharacters"]
# all_documents = collection.find()

# for character in all_documents:
#      # sets the time it was last modified
#     time.sleep(1)
#     current_timestamp = int(time.time() * 1000)
#     timestamp_str = str(current_timestamp)
#     add_value_document("PlayerCharacters", character["_id"], "last_modified", timestamp_str)


# Games
# Scenarios
# NpcCharacters
# PlayerCharacters