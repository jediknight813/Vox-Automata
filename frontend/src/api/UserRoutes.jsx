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


export const GetImages = async (number_of_images) => {
    const response = await axios.post(apiUrl+"/get_images", {
        params: {"number_of_images": number_of_images}
    });
    return response["data"]["message"]
}


export const GetUserProfileDetails = async (username) => {
    const response = await axios.post(apiUrl+"/get_user_profile_details", {
        params: {"username": username}
    });
    return response["data"]["message"]
}

