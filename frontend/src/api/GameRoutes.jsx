import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;
import { GetJwtHeader } from "./utils";


export const GetGame = async (_id, username) => {
    const headers = GetJwtHeader()
    _id = _id.replace(":", "")
    const response = await axios.post(apiUrl+"/get_game", {
        params: {"collection_name": "Games", "_id": _id, "username": username}
    }, {headers} );
    return response.data["message"]
}


export const GetBotResponse = async (gameData, username, userMessage, timestampStr, PromptFormat) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/get_bot_response", {
        params: {"gameData": gameData, "username": username, "userMessage": userMessage, "timestamp": timestampStr, "PromptFormat": PromptFormat}
    }, {headers} );
    return response.data["message"]
}


export const UndoLastMessage = async (gameData, username) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/undo_last_message", {
        params: {"gameData": gameData, "username": username}
    }, {headers});
    return response.data["message"]
}

export const ResetStory = async (gameData, username) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/reset_story", {
        params: {"gameData": gameData, "username": username}
    }, {headers});
    return response.data["message"]
}