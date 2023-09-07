import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const Login = async (username, password) => {
    const response = await axios.post(apiUrl+'/Login', {
        params: {"password": password, "username": username}
    });
    return response.data
}


export const CreateUser = async (username, password) => {
    const response = await axios.post(apiUrl+'/SignUp', {
        params: {"password": password, "username": username}
    });
    return response.data
}


export const GetImage = async (_id) => {
    _id = _id.replace(":", "")
    const response = await axios.post(apiUrl+"/get_image_base64", {
        params: {"image_id": _id}
    });
    return response.data["message"]
}