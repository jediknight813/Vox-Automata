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


export const GetGenerateScenarioResponse = async (generate_local, character_one_name, character_two_name, character_one_description, character_two_description, scenario_prompt) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/generate_scenario", {
        params: {"generate_local": generate_local, "character_one_name": character_one_name, "character_two_name": character_two_name, "character_one_description": character_one_description, "character_two_description": character_two_description, "scenario_prompt": scenario_prompt}
    }, {headers} );
    return response.data["message"]
}

