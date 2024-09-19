import {ApiGetRequest, ApiGetRequestWithToken, ApiPostRequest} from "@/services/admin";

export async function verifyJwtToken(token) {

    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);

        const requestOptions = {
            method: "POST", headers: myHeaders, redirect: "follow"
        };


        const response = await ApiGetRequestWithToken(token,"/validate-jwt", "")
        if (!response.error) {
            return response.result;
        } else {
            console.log('Token Error in auth js:', response.statusText);
            return null
        }
    } catch (error) {
        console.error('Bir hata oluştu:', error);
        return null
    }


}