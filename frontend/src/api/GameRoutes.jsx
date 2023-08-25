import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const GetGame = async (_id, username) => {
    _id = _id.replace(":", "")
    const response = await axios.post(apiUrl+"/get_game", {
        params: {"collection_name": "Games", "_id": _id, "username": username}
    });
    return response.data["message"]
}

