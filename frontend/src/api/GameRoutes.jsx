import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const GetGame = async (_id, username) => {
    _id = _id.replace(":", "")
    const response = await axios.post(apiUrl+"/get_game", {
        params: {"collection_name": "Games", "_id": _id, "username": username}
    });
    return response.data["message"]
}


export const GetBotResponse = async (gameData, username, userMessage, timestampStr, PromptFormat) => {
    const response = await axios.post(apiUrl+"/get_bot_response", {
        params: {"gameData": gameData, "username": username, "userMessage": userMessage, "timestamp": timestampStr, "PromptFormat": PromptFormat}
    });
    return response.data["message"]
}


export const UndoLastMessage = async (gameData, username) => {
    const response = await axios.post(apiUrl+"/undo_last_message", {
        params: {"gameData": gameData, "username": username}
    });
    return response.data["message"]
}

export const ResetStory = async (gameData, username) => {
    const response = await axios.post(apiUrl+"/reset_story", {
        params: {"gameData": gameData, "username": username}
    });
    return response.data["message"]
}