import pymongo
import os
from dotenv import load_dotenv
load_dotenv()
from bson import ObjectId
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"


client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]



def get_user_npc_characters(username, page_number=1, page_size=10):
    entries = []
    collection = db["NpcCharacters"]

    # Find documents where the 'username' field matches the provided username
    query = {"username": username}

    total_count = collection.count_documents(query)

    # Calculate the skip value and limit for the current page
    skip = (page_number - 1) * page_size
    limit = page_size

    # Retrieve documents for the current page
    cursor = collection.find(query).skip(skip).sort("last_modified", pymongo.DESCENDING).limit(limit)

    for entry in cursor:
        entry["_id"] = str(entry["_id"])
        entries.append(entry)

    # Calculate if there are more pages
    more_pages = (skip + limit) < total_count

    return entries, more_pages