import {Base64} from "js-base64";
import getCookie from "./cookies";
function authHeaders() {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + Base64.encode( getCookie('token')+ ":0"));
    return headers;

}

export default authHeaders;