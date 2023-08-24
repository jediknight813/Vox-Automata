import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const CreateEntry = async (params) => {
    const response = await axios.post(apiUrl+"/create_entry", {
        params: params
    });
    return response.data["message"]
}


export const GetEntries = async (collection_name, username) => {
    const response = await axios.post(apiUrl+"/get_entries", {
        params: {"collection_name": collection_name, "username": username}
    });
    return response.data["message"]
}


export const RemoveEntry = async (collection_name, _id, username) => {
    const response = await axios.post(apiUrl+"/remove_entry", {
        params: {"collection_name": collection_name, "_id": _id, "username": username}
    });
    return response.data["message"]
}


export const GetUserEntry = async (collection_name, _id, username) => {
    const response = await axios.post(apiUrl+"/get_user_entry", {
        params: {"collection_name": collection_name, "_id": _id, "username": username}
    });
    return response.data["message"]
}

export const updateUserEntry = async (collection_name, _id, username, updated_entry) => {
    const response = await axios.post(apiUrl+"/update_user_entry", {
        params: {"collection_name": collection_name, "_id": _id, "username": username, "updated_entry": updated_entry}
    });
    return response.data["message"]
}

export const EditEntry = async (params) => {
    const response = await axios.get(apiUrl+"/edit_entry", {
        data: params
    });
    return response.data["message"]
}

