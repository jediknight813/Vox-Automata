import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const GetChatGptResponse = async (PromptList) => {
    const response = await axios.post(apiUrl+"/get_chat_gpt_response", {
        params: {"PromptList": PromptList}
    });
    return response.data["message"]
}

