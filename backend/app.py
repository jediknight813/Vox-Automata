from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend_functions import login_user, create_user, insert_entry, get_user_entries, remove_user_entry, get_single_user_entry, update_single_user_entry, get_user_game, update_game_messages, add_value_document
from text_generation import generate_response
from dotenv import load_dotenv
import os
load_dotenv()
FRONTEND_URL = os.environ.get("FRONTEND_URL")
MONGO_URL = os.environ.get("MONGO_URL")
import uvicorn


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

    update_game_messages(data["username"], game_id, {"name": gameData["player"]["name"], "type": "user", "message": data["userMessage"]})
    update_game_messages(data["username"], game_id, {"name": gameData["npc"]["name"], "type": "bot", "message": npc_response})

    return {"message": npc_response}



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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)

# host=MONGO_URL
