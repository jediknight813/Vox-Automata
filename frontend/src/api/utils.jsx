import Cookies from "js-cookie"


export const GetJwtHeader = () => {
    const headers = {
        Authorization: `Bearer ${Cookies.get("vox_automata_access_token")}`,
    };
    return headers
}
