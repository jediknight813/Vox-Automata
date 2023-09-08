import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;
import { GetJwtHeader } from "./utils";


export const GetChatGptResponse = async (PromptList) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/get_chat_gpt_response", {
        params: {"PromptList": PromptList}
    }, {headers} );
    return response.data["message"]
}


export const GetGenerateCharacterResponse = async (generate_local, character_prompt) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/generate_character", {
        params: {"generate_local": generate_local, "character_prompt": character_prompt}
    }, {headers} );
    return response.data["message"]
}
