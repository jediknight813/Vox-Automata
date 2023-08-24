from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from backend_functions import login_user, create_user, insert_entry, get_user_entries, remove_user_entry, get_single_user_entry, update_single_user_entry

app = FastAPI()

origins = [
    "http://localhost:5174",  # Replace with your desired origin(s)
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
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8888)

