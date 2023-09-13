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


from database.game_functions import get_user_games


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

# import io
# from PIL import Image
# import pyperclip
# import os


# collection = db["images"]
# all_documents = collection.find()

# index = 0
# for image_object in all_documents:
#     if 'image_base64' in image_object:
#         base64_string = image_object["image_base64"]

#         image_data = base64.b64decode(base64_string)
#         image = Image.open(io.BytesIO(image_data))

#         # Step 3: Resize the image to 512x512 pixels
#         new_size = (512, 512)
#         resized_image = image.resize(new_size)

#         # Step 4: Apply compression settings (e.g., reduce quality)
#         # You can adjust the quality parameter as needed.
#         compressed_image = resized_image.copy()
#         compressed_image.save("compressed_image.jpg", format="JPEG", quality=90)

#         # Step 4: Convert the compressed image back to a base64 string if needed
#         with open("compressed_image.jpg", "rb") as compressed_file:
#             compressed_image_data = compressed_file.read()

#         compressed_base64 = base64.b64encode(compressed_image_data).decode()

#         print("saved: ", str((len(base64_string)-len(compressed_base64))))

#         pyperclip.copy(compressed_base64)

#         # index += 1

#         add_value_document("images", image_object["_id"], "image_base64", compressed_base64)

        # if index == 5:
        #     break

# Games
# Scenarios
# NpcCharacters
# PlayerCharacters


def mod_inverse(a, m):
    for x in range(1, m):
        if (a * x) % m == 1:
            return x
    return None

def affine_encrypt(text, additive_key, multiplicative_key):
    encrypted_text = ""
    for char in text:
        if char.isalpha():
            is_upper = char.isupper()
            char = char.lower()
            char_num = ord(char) - ord('a')
            encrypted_char_num = (additive_key * char_num + multiplicative_key) % 26
            encrypted_char = chr(encrypted_char_num + ord('a'))
            if is_upper:
                encrypted_char = encrypted_char.upper()
            encrypted_text += encrypted_char
        else:
            encrypted_text += char
    return encrypted_text

def affine_decrypt(text, additive_key, multiplicative_key):
    decrypted_text = ""
    a_inverse = mod_inverse(additive_key, 26)
    if a_inverse is not None:
        for char in text:
            if char.isalpha():
                is_upper = char.isupper()
                char = char.lower()
                char_num = ord(char) - ord('a')
                decrypted_char_num = (a_inverse * (char_num - multiplicative_key)) % 26
                decrypted_char = chr(decrypted_char_num + ord('a'))
                if is_upper:
                    decrypted_char = decrypted_char.upper()
                decrypted_text += decrypted_char
            else:
                decrypted_text += char
    return decrypted_text

# Example usage:
plaintext = "hello?"
a = 3
b = 8

encrypted_text = affine_encrypt(plaintext, a, b)
print("Encrypted:", encrypted_text)

decrypted_text = affine_decrypt(encrypted_text, a, b)
print("Decrypted:", decrypted_text)