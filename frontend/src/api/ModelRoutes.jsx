import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const GetModels = async () => {
    const response = await axios.post(apiUrl+"/get_models");
    console.log(response["data"])
    return response["data"]
}

export const UnloadModels = async () => {
    const response = await axios.post(apiUrl+"/unload_model");
    console.log(response["data"])
    return response["data"]
}


export const LoadModel = async (modal_name) => {
    const response = await axios.post(apiUrl+"/load_model", {
        params: {"modal_name": modal_name}
    });
    return response.data["message"]
}


export const DownloadModel = async (modal_data) => {
    const response = await axios.post(apiUrl+"/download_model", {
        params: modal_data
    });
    return response.data["message"]
}