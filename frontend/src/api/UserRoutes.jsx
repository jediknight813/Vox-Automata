import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API_ADDRESS;


export const Login = async (params) => {
    const response = await axios.get(apiUrl+'/Login', {
        params: params
    });
    return response.data["message"]
}


export const CreateUser = async (params) => {
    const response = await axios.get(apiUrl+'/SignUp', {
        params: params
    });
    return response.data["message"]
}


export const GetImage = async (_id) => {
    _id = _id.replace(":", "")
    const response = await axios.post(apiUrl+"/get_image_base64", {
        params: {"image_id": _id}
    });
    return response.data["message"]
}