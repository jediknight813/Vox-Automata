from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database.auth_functions import login_user, create_user
from database.user_functions import (
    insert_entry,
    remove_user_entry,
    get_single_user_entry,
    get_user_entries,
    add_value_document,
    update_single_user_entry,
    update_user_profile_stat,
    get_profile_stats,
)
from database.game_functions import (
    get_user_game,
    update_game_messages,
    check_for_streaming_message,
    get_user_games,
)
from database.image_functions import find_image_base64, get_number_of_images
from database.npc_functions import get_user_npc_characters
from text_generation import (
    generate_response,
    generate_character_local,
    local_generate_scenario,
)
from chat_gpt import getChatGPTResponse, gpt_generate_character, gpt_generate_scenario
from dotenv import load_dotenv
from jwt_token_creator import get_current_user
from utils import affine_decrypt, affine_encrypt, encrypt_messages, encrypt_fields
import os
import requests

load_dotenv()
FRONTEND_URL = os.environ.get("FRONTEND_URL")
MONGO_URL = os.environ.get("MONGO_URL")
import uvicorn
import time


ENCRYPTION_KEY_MULTIPLICATIVE_KEY = os.environ.get("ENCRYPTION_KEY_MULTIPLICATIVE_KEY")
ENCRYPTION_KEY_ADDITIVE_KEY = os.environ.get("ENCRYPTION_KEY_ADDITIVE_KEY")

app = FastAPI()


origins = [
    FRONTEND_URL,
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/Login")
async def Login(data: dict):
    data = data["params"]
    return login_user(data["username"], data["password"])


@app.post("/SignUp")
async def SignUp(data: dict):
    data = data["params"]
    return create_user(data["username"], data["password"])


@app.post("/create_entry")
async def create_entry(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    collection_name = data["field_name"]
    data.pop("field_name")

    return {"message": insert_entry(data, collection_name)}


@app.post("/remove_entry")
async def remove_entry(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    entries = remove_user_entry(data["collection_name"], current_user, data["_id"])
    return {"message": entries}


# game routes
@app.post("/get_game")
async def get_game(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    entries = get_user_game(data["collection_name"], current_user, data["_id"])
    entries["message"]["messages"] = encrypt_messages(entries["message"]["messages"])
    return {"message": entries}


# npc character routes
@app.post("/user_npc_characters")
async def npc_characters(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    entries, more_pages = get_user_npc_characters(
        data["username"], data["page_number"], data["page_size"]
    )
    # for character in entries:
    #     character = encrypt_fields(["name", "wearing", "personality", "appearance", "age", "gender"], character)

    entries_data = {"entries": entries, "more_results": more_pages}
    return {"message": entries_data}


@app.post("/undo_last_message")
async def undo_last_message(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]

    game_id = data["gameData"].replace(":", "")
    gameData = get_user_game("Games", data["username"], game_id)
    gameDataMessages = gameData["message"]["messages"]

    if isinstance(gameDataMessages, list) and len(gameDataMessages) > 0:
        gameDataMessages.pop()

    add_value_document("Games", game_id, "messages", gameDataMessages)

    return {"message": "removed"}


@app.post("/reset_story")
async def undo_last_message(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    game_id = data["gameData"].replace(":", "")
    add_value_document("Games", game_id, "messages", [])
    return {"message": "restarted story"}


@app.post("/get_bot_response")
async def get_bot_response(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]

    game_id = data["gameData"].replace(":", "")
    gameData = get_user_game("Games", current_user, game_id)
    gameData = gameData["message"]

    if current_user != gameData["username"]:
        return

    UserMessage = affine_decrypt(
        data["userMessage"],
        int(ENCRYPTION_KEY_ADDITIVE_KEY),
        int(ENCRYPTION_KEY_MULTIPLICATIVE_KEY),
    )

    npc_response = generate_response(gameData, UserMessage, data["PromptFormat"])
    current_timestamp = int(time.time() * 1000)
    timestamp_str = str(current_timestamp)

    # get number of words generated and save it to user stats.
    update_user_profile_stat(current_user, "generated_words", len(npc_response.split()))

    # get number of words typed by the user and save it to user stats.
    update_user_profile_stat(
        current_user, "typed_words", len(data["userMessage"].split())
    )

    update_game_messages(
        data["username"],
        game_id,
        {
            "name": gameData["player"]["name"],
            "type": "user",
            "message": UserMessage,
            "timestamp": data["timestamp"],
            "summarized": False,
            "ignored": False,
        },
    )
    update_game_messages(
        data["username"],
        game_id,
        {
            "name": gameData["npc"]["name"],
            "type": "bot",
            "message": npc_response,
            "timestamp": timestamp_str,
            "summarized": False,
            "ignored": False,
        },
    )

    return {
        "message": {
            "response": affine_encrypt(
                npc_response,
                int(ENCRYPTION_KEY_ADDITIVE_KEY),
                int(ENCRYPTION_KEY_MULTIPLICATIVE_KEY),
            ),
            "timestamp": timestamp_str,
        }
    }


@app.post("/get_user_game_entries")
async def get_user_game_entries(
    data: dict, current_user: str = Depends(get_current_user)
):
    data = data["params"]
    user_games, more_pages = get_user_games(
        current_user, data["page_number"], data["page_size"]
    )
    games_data = {"games": user_games, "more_results": more_pages}
    return {"message": games_data}


@app.post("/get_user_entry")
async def get_user_entry(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    entries = get_single_user_entry(data["collection_name"], current_user, data["_id"])
    return {"message": entries}


@app.post("/update_user_entry")
async def update_user_entry(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    entries = update_single_user_entry(
        data["collection_name"], current_user, data["_id"], data["updated_entry"]
    )
    return {"message": entries}


@app.post("/get_entries")
async def get_entries(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    user_entries, more_pages = get_user_entries(
        data["collection_name"],
        data["username"],
        data["page_number"],
        data["page_size"],
    )
    entries_data = {"entries": user_entries, "more_results": more_pages}
    return {"message": entries_data}


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
    url = "http://" + MONGO_URL + ":4000/get_models"
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
    url = (
        "http://"
        + MONGO_URL
        + ":4000/load_model/"
        + data["modal_name"]
        + "/"
        + str(data["gpu_threads"])
        + "/"
        + str(data["ctx_size"])
    )
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
    url = (
        "http://"
        + MONGO_URL
        + ":4000/download_model/"
        + data["author_name"]
        + "/"
        + data["author_repo"]
        + "/"
        + data["author_model"]
    )
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
    url = "http://" + MONGO_URL + ":4000/unload_model"
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        print(json_data)
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


# chat gpt routes
@app.post("/get_chat_gpt_response")
async def get_chat_gpt_response(
    data: dict, current_user: str = Depends(get_current_user)
):
    data = data["params"]
    response = getChatGPTResponse(data["PromptList"])

    # get number of words generated and save it to user stats.
    update_user_profile_stat(current_user, "generated_words", len(response.split()))

    return {"message": response}


# generate character route
@app.post("/generate_character")
async def generate_character(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    character = {}

    data["generate_local"] = True

    if (data["generate_local"]) == "false":
        response = gpt_generate_character(data["character_prompt"])
        character["name"] = response["character_name"]
        character["personality"] = response["character_personality"]
        character["appearance"] = response["character_appearance"]
        character["wearing"] = response["character_clothing"]
    else:
        response = generate_character_local(data["character_prompt"])
        character["name"] = response["character_name"]
        character["personality"] = (
            response["character_personality"]
            + " "
            + response["character_name"]
            + " is an "
            + response["character_mbti"]
            + "."
        )
        character["appearance"] = response["character_appearance"].strip()
        character["wearing"] = response["character_clothing"].strip()

    # get number of words generated and save it to user stats.
    update_user_profile_stat(
        current_user,
        "generated_words",
        sum(
            len(value.split()) for value in character.values() if isinstance(value, str)
        ),
    )

    # get number of words typed by the user and save it to user stats.
    update_user_profile_stat(
        current_user, "typed_words", len(data["character_prompt"].split())
    )

    return {"message": character}


@app.post("/generate_scenario")
async def generate_scenario(data: dict, current_user: str = Depends(get_current_user)):
    data = data["params"]
    scenario = ""

    data["generate_local"] = True

    if (data["generate_local"]) == "false":
        response = gpt_generate_scenario(
            data["character_one_name"],
            data["character_two_name"],
            data["character_one_description"],
            data["character_two_description"],
            data["scenario_prompt"],
        )
        scenario += response["backstory"] + "\n\n"
        # scenario += response["plot"]+"\n\n"
        scenario += response["situation"] + "\n"
    else:
        response = local_generate_scenario(
            data["character_one_name"],
            data["character_two_name"],
            data["character_one_description"],
            data["character_two_description"],
            data["scenario_prompt"],
        )
        scenario += response["situation_location"] + "\n\n"
        scenario += response["situation_intro"] + "\n\n"
        scenario += response["situation_scene"] + "\n"

    # get number of words generated and save it to user stats.
    update_user_profile_stat(current_user, "generated_words", len(scenario.split()))

    # get number of words typed by the user and save it to user stats.
    update_user_profile_stat(
        current_user, "typed_words", len(data["scenario_prompt"].split())
    )

    return {"message": scenario}


# text live streaming routes.
@app.post("/get_streaming_message")
async def get_streaming_message(
    data: dict, current_user: str = Depends(get_current_user)
):
    data = data["params"]
    current_message = check_for_streaming_message(data["game_id"], current_user)

    return {"message": current_message}


# user profile routes.
@app.post("/get_user_profile_details")
async def get_user_profile_details(data: dict):
    data = data["params"]
    stats = get_profile_stats(data["username"])
    return {"message": stats}


@app.post("/get_images")
async def get_images(data: dict):
    data = data["params"]
    images = get_number_of_images(data["number_of_images"])
    return {"message": images}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)
