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

