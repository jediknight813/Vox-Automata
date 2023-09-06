import pymongo
import os
from dotenv import load_dotenv
import json
load_dotenv()
from bson import ObjectId
mongodb_url = os.environ.get("MONGO_URL")
database = "VOX_AUTOMATA"
import base64
from PIL import Image
import requests
import io
A1111_URL = os.getenv("A1111_URL")
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]
from text_generation import generate_scenario_location


def insert_image(data):
    collection = db["images"]
    entry = collection.insert_one(data)
    if entry:
        return entry.inserted_id


def check_url(url, timeout=200): 
    try:
        response = requests.get(url, timeout=timeout)
        return response.status_code == 200
    except (requests.ConnectionError, requests.Timeout):
        return False


def find_image_base64(image_id):
    collection = db["images"]
    query = {"_id": ObjectId(image_id)}
    entry = collection.find_one(query)
    if entry:
        return entry["image_base64"]


def update_image_base64(document_id, field_value):
    collection = db["images"]

    query = {"_id": ObjectId(document_id)}
    update = {"$set": {"image_base64": field_value}}

    result = collection.update_one(query, update, upsert=True)

    if result.modified_count > 0 or result.upserted_id:
        return result
    else:
        return result



def handle_image_generation(collection_name, data, type): 
    image_generated = False
    base64_encoded = ""

    if collection_name == "NpcCharacters":
        use_local_image_generation = check_url(url=f'{A1111_URL}/info')
        print("is using local image gen: ", use_local_image_generation)

        if use_local_image_generation == True:
            image_path = generate_image_local(512, 512, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, {data["appearance"]}, and is wearing {data["wearing"]}, detailed, amazing. ')
        else:
            image_path = create_image_dream_studio(1024, 1024, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, {data["appearance"]}, and is wearing {data["wearing"]}, detailed, amazing. ')


        with open(image_path, "rb") as image_file:
            base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
            os.remove(image_path)
            image_generated = True
        
    if collection_name == "PlayerCharacters":
        use_local_image_generation = check_url(url=f'{A1111_URL}/info')
        print("is using local image gen: ", use_local_image_generation)

        if use_local_image_generation == True:
            image_path = generate_image_local(512, 512, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, and is wearing {data["wearing"]}, detailed, amazing. ')
        else:
            image_path = create_image_dream_studio(1024, 1024, f'{data["gender"]} {data["age"]} portrait, half body, headshot, facing camera, and is wearing {data["wearing"]}, detailed, amazing. ')

        with open(image_path, "rb") as image_file:
            base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
            os.remove(image_path)
            image_generated = True


    if collection_name == "Scenarios":
        # generate background description.
        response = generate_scenario_location(data["scenario"])

        use_local_image_generation = check_url(url=f'{A1111_URL}/info')
        print("is using local image gen: ", use_local_image_generation)

        if use_local_image_generation == True:
            image_path = generate_image_local(512, 512, response, "people, man, women, child, group of people, comic, panel, comic panel, split, ")
        else:
            image_path = create_image_dream_studio(1024, 1024, response, "people, man, women, child, group of people, comic, panel, comic panel, split,  ")

        with open(image_path, "rb") as image_file:
            base64_encoded = base64.b64encode(image_file.read()).decode("utf-8")
            os.remove(image_path)
            image_generated = True


    if image_generated == True and type == "new":
        entry_id = insert_image({"image_base64": base64_encoded})
        data["image_base64_id"] = str(entry_id)
       
    if image_generated == True and type == "update":
        update_image_base64(data["image_base64_id"], base64_encoded) 


    return data


# handle image generation locally.
engine_id = "stable-diffusion-xl-1024-v1-0"
api_host = os.getenv('API_HOST', 'https://api.stability.ai')
api_key = os.getenv("STABILITY_API_KEY")

A1111_URL = os.getenv("A1111_URL")


if api_key is None:
    raise Exception("Missing Stability API key.")

def create_image_dream_studio(width, height, prompt, NegativePrompt=""):
    response = requests.post(
        f"{api_host}/v1/generation/{engine_id}/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {api_key}"
        },
        json={
            "text_prompts": [
                {
                    "text": prompt
                },
                {
                    "text": NegativePrompt+", blurry, badsfew",
                    "weight": -1
                }
            ],
            "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": int(height),
            "width": int(width),
            "samples": 1,
            "steps": 40,
        },
    )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))


    data = response.json()
    folder_path = "./images/"
    existing_images = os.listdir(folder_path)
    image_count = len(existing_images)

    image_path = ""

    for i, image in enumerate(data["artifacts"]):
        image_number = i + image_count
        image_path = os.path.join(folder_path, f"{image_number+1}.png")
        with open(image_path, "wb") as f:
            print("saving image.")
            f.write(base64.b64decode(image["base64"]))
            return image_path

    return image_path


def generate_image_local(width, height, prompt, NegativePrompt=""):
    payload = {
        "prompt": prompt,
        "negative_prompt": NegativePrompt+" 3d, disfigured, bad art, deformed, poorly drawn, strange colors, blurry, boring, lackluster, repetitive, cropped.",
        "batch_size": 1,
        "steps": 25,
        "height": height,
        "width": width,
        "cfg_scale": 7,
        "sampler_index": "Euler a",
    }


    # Trigger Generation
    response = requests.post(url=f'{A1111_URL}/sdapi/v1/txt2img', json=payload)
    print(response)
    # Read results
    r = response.json()
    result = r['images'][0]
    folder_path = "./images/"
    existing_images = os.listdir(folder_path)
    image_count = len(existing_images)
    image = Image.open(io.BytesIO(base64.b64decode(result.split(",", 1)[0])))
    image.save(folder_path+str(image_count+1)+".jpeg")

    return folder_path+str(image_count+1)+".jpeg"