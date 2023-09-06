import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const GetModels = async () => {
    const response = await axios.post(apiUrl+"/get_models");
    return response["data"]
}

export const UnloadModels = async () => {
    const response = await axios.post(apiUrl+"/unload_model");
    return response["data"]
}


export const LoadModel = async (modal_name) => {
    const response = await axios.post(apiUrl+"/load_model", {
        params: {"modal_name": modal_name}
    });
    return response.data
}


export const DownloadModel = async (modal_data) => {
    const response = await axios.post(apiUrl+"/download_model", {
        params: modal_data
    });
}