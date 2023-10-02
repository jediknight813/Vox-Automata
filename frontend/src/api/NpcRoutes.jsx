import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;
import { GetJwtHeader } from "./utils";


export const GetUserNpcs = async (username, page_number, page_size) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/user_npc_characters", {
        params: {"username": username, "page_number": page_number, "page_size": page_size}
    }, { headers } );
    return response.data["message"]
}

