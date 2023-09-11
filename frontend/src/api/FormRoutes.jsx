import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;
import { GetJwtHeader } from "./utils";


export const CreateEntry = async (params) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/create_entry", { params: params }, { headers } );
    return response.data["message"]
}


export const GetEntries = async (collection_name, username, page_number, page_size) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/get_entries", {
        params: {"collection_name": collection_name, "username": username, "page_number": page_number, "page_size": page_size}
    }, { headers } );
    return response.data["message"]
}


export const RemoveEntry = async (collection_name, _id, username) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/remove_entry", { params: {"collection_name": collection_name, "_id": _id, "username": username}}, { headers });
    return response.data["message"]
}


export const GetUserEntry = async (collection_name, _id, username) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/get_user_entry", {
        params: {"collection_name": collection_name, "_id": _id, "username": username}
    }, { headers } );
    return response.data["message"]
}

export const updateUserEntry = async (collection_name, _id, username, updated_entry) => {
    const headers = GetJwtHeader()
    const response = await axios.post(apiUrl+"/update_user_entry", {
        params: {"collection_name": collection_name, "_id": _id, "username": username, "updated_entry": updated_entry}
    }, { headers } );
    return response.data["message"]
}

export const EditEntry = async (params) => {
    const headers = GetJwtHeader()
    const response = await axios.get(apiUrl+"/edit_entry", {
        data: params
    }, { headers } );
    return response.data["message"]
}

