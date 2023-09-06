from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.auth_functions import login_user, create_user
from database.user_functions import insert_entry, remove_user_entry, get_single_user_entry, get_user_entries, add_value_document, update_single_user_entry
from database.game_functions import get_user_game, update_game_messages
from database.image_functions import find_image_base64
from text_generation import generate_response
from chat_gpt import getChatGPTResponse
from dotenv import load_dotenv
import os
import requests
load_dotenv()
FRONTEND_URL = os.environ.get("FRONTEND_URL")
MONGO_URL = os.environ.get("MONGO_URL")
import uvicorn
import time


app = FastAPI()


origins = [
    # FRONTEND_URL,
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/Login")
async def Login(username: str, password: str):
    return login_user(username, password)


@app.get("/SignUp")
async def SignUp(username: str, password: str):
    return create_user(username, password)


@app.post("/create_entry")
async def create_entry(data: dict):
    data = data["params"]
    collection_name = data["field_name"]
    data.pop("field_name")
    return {"message": insert_entry(data, collection_name)}


@app.post("/remove_entry")
async def remove_entry(data: dict):
    data = data["params"]
    entries = remove_user_entry(data["collection_name"], data["username"], data["_id"])
    return {"message": entries}


@app.post("/get_game")
async def get_game(data: dict):
    data = data["params"]
    entries = get_user_game(data["collection_name"], data["username"], data["_id"])
    return {"message": entries}


@app.post("/undo_last_message")
async def undo_last_message(data: dict):
    data = data["params"]

    game_id = data["gameData"].replace(":", "")
    gameData = get_user_game("Games", data["username"], game_id)
    gameDataMessages = gameData["message"]["messages"]

    if isinstance(gameDataMessages, list) and len(gameDataMessages) > 0:
        gameDataMessages.pop() 

    add_value_document("Games", game_id, "messages", gameDataMessages)

    return {"message": "removed"}


@app.post("/reset_story")
async def undo_last_message(data: dict):
    data = data["params"]
    game_id = data["gameData"].replace(":", "")
    add_value_document("Games", game_id, "messages", [])
    return {"message": "restarted story"}


@app.post("/get_bot_response")
async def get_game(data: dict):
    data = data["params"]

    game_id = data["gameData"].replace(":", "")
    gameData = get_user_game("Games", data["username"], game_id)
    gameData = gameData["message"]

    if data["username"] != gameData["username"]:
        return
    

    npc_response = generate_response(gameData, data["userMessage"])
    current_timestamp = int(time.time() * 1000)
    timestamp_str = str(current_timestamp)

    update_game_messages(data["username"], game_id, {"name": gameData["player"]["name"], "type": "user", "message": data["userMessage"], "timestamp": data["timestamp"]})
    update_game_messages(data["username"], game_id, {"name": gameData["npc"]["name"], "type": "bot", "message": npc_response, "timestamp": timestamp_str})

    return {"message": {"response": npc_response, "timestamp": timestamp_str}}


@app.post("/get_user_entry")
async def get_user_entry(data: dict):
    data = data["params"]
    entries = get_single_user_entry(data["collection_name"], data["username"], data["_id"])
    return {"message": entries}


@app.post("/update_user_entry")
async def update_user_entry(data: dict):
    data = data["params"]
    entries = update_single_user_entry(data["collection_name"], data["username"], data["_id"], data["updated_entry"])
    return {"message": entries}


@app.post("/get_entries")
async def get_entries(data: dict):
    data = data["params"]
    entries = get_user_entries(data["collection_name"], data["username"])
    return {"message": entries}


# image routes


@app.post("/get_image_base64")
async def get_image_base64(data: dict):
    data = data["params"]
    entries = find_image_base64(data["image_id"])
    return {"message": entries}


# simple llama-cpp-server-routes

# get models
@app.post("/get_models")
async def get_models():
    url = "http://"+MONGO_URL+":4000/get_models"
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        return json_data["message"]
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


# load model
@app.post("/load_model")
async def load_model(data: dict):
    data = data["params"]
    url = "http://"+MONGO_URL+":4000/load_model/"+data["modal_name"]
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        print(json_data)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


# load model
@app.post("/download_model")
async def download_model(data: dict):
    data = data["params"]
    url = "http://"+MONGO_URL+":4000/download_model/"+data["author_name"]+"/"+data["author_repo"]+"/"+data["author_model"]
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        print(json_data)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


# unload model
@app.post("/unload_model")
async def unload_model():
    url = "http://"+MONGO_URL+":4000/unload_model"
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        print(json_data)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


# chat gpt routes
@app.post("/get_chat_gpt_response")
async def get_chat_gpt_response(data: dict):
    data = data["params"]
    response = getChatGPTResponse(data["PromptList"])
    return {"message": response}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)

# host=MONGO_URL
