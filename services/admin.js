import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";


const ApiGetRequest = async (pathname, query = "") => {
    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl +'/'+ pathname + (query !== "" ? ("?" + query) : "")

    apiUrl= apiUrl.replace("//", '/')
    const response = await fetch(apiUrl, {
        method: 'GET', headers: {
            "Authorization": `Bearer ${token}`, // "Cache-Control": "no-cache"
        }

    });


    if (response.status > 300) {
        if (response.status === 401) {
            // throw new Error('Yetkisiz kullanıcı')
        }
        // throw new Error('Failed to fetch users');
    }
    return response.json()
}


const AdminGetRequest = async (pathname, query = "") => {
    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl + '/admin' + pathname + (query !== "" ? ("?" + query) : "")

    apiUrl=apiUrl.replace("//", '/')
    const response = await fetch(apiUrl, {
        method: 'GET', headers: {
            "Authorization": `Bearer ${token}`, // "Cache-Control": "no-cache"
        }

    });


    if (response.status > 300) {
        if (response.status === 401) {
            // throw new Error('Yetkisiz kullanıcı')
        }
        // throw new Error('Failed to fetch users');
    }
    return response.json()
}

const ApiGetRequestWithToken = async (token, pathname, query = "") => {

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl+"/" + pathname + (query !== "" ? ("?" + query) : "")
    apiUrl=apiUrl.replace("//","/")

    const response = await fetch(apiUrl, {
        method: 'GET', headers: {
            "Authorization": `Bearer ${token}`, // "Cache-Control": "no-cache"
        }

    });


    if (response.status > 300) {
        if (response.status === 401) {
            // throw new Error('Yetkisiz kullanıcı')
        }
        // throw new Error('Failed to fetch users');
    }

    return response.json()
}

const ApiPostRequest = async (pathname, query = "", formDataArr = []) => {
    // console.log(formDataArr);

    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl +'/'+ pathname + (query !== "" ? ("?" + query) : "")
    apiUrl=apiUrl.replace("//","/")
    const formData = new FormData();

    try {
        for (let i = 0; i < formDataArr.length; i++) {
            formData.append(formDataArr[i].name, formDataArr[i].value);
        }

        const response = await fetch(apiUrl, {
            method: 'POST', headers: {
                "Authorization": `Bearer ${token}`, // 'Content-Type': 'application/json',
            }, body: formData,
        });

        if (!response.ok) {
            // throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data;
    } catch (error) {

        console.error('Error:', error);
        // throw error;
    }

}

const AdminPostRequest = async (pathname, query = "", formDataArr = []) => {
    // console.log(formDataArr);

    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl +'/admin/'+ pathname + (query !== "" ? ("?" + query) : "")
    apiUrl=apiUrl.replace("//","/")
    const formData = new FormData();

    try {
        for (let i = 0; i < formDataArr.length; i++) {
            formData.append(formDataArr[i].name, formDataArr[i].value);
        }

        const response = await fetch(apiUrl, {
            method: 'POST', headers: {
                "Authorization": `Bearer ${token}`, // 'Content-Type': 'application/json',
            }, body: formData,
        });

        if (!response.ok) {
            // throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return data;
    } catch (error) {

        console.error('Error:', error);
        // throw error;
    }

}
const ApiPostRequestWithModel = async (pathname, query = "", model) => {
    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const apiUrl = backendUrl +'/'+ pathname + (query !== "" ? ("?" + query) : "")
    //console.log("model");
    //console.log(model);
    apiUrl.replace("//",'/')
    try {
        const formData = new FormData();
        const arr = Object.entries(model)
            .filter(([name, value]) => value !== null) // Null olmayan öğeleri filtrele
            .map(([name, value]) => ({name, value}));
        //console.log("arr");
        //console.log(arr);
        for (let i = 0; i < arr.length; i++) {

            formData.append(arr[i].name, arr[i].value);

        }
        /*        formData.append("uid", "5f549f39-52a0-43f6-ac04-af77bd73214d");
                formData.append("email", "test@gmail.com4");
                formData.append("phone", "905554433223");*/
        const response = await fetch(apiUrl, {
            method: 'POST', headers: {
                "Authorization": `Bearer ${token}`, // 'Content-Type': 'application/json',
            }, body: formData,
        });


        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

const AdminPostRequestWithModel = async (pathname, query = "", model) => {
    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl +'/admin/'+ pathname + (query !== "" ? ("?" + query) : "")
    //console.log("model");
    //console.log(model);
    apiUrl=apiUrl.replace("//",'/')
    try {
        const formData = new FormData();
        const arr = Object.entries(model)
            .filter(([name, value]) => value !== null) // Null olmayan öğeleri filtrele
            .map(([name, value]) => ({name, value}));
        //console.log("arr");
        //console.log(arr);
        for (let i = 0; i < arr.length; i++) {

            formData.append(arr[i].name, arr[i].value);

        }
        /*        formData.append("uid", "5f549f39-52a0-43f6-ac04-af77bd73214d");
                formData.append("email", "test@gmail.com4");
                formData.append("phone", "905554433223");*/
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            }, body: formData,
        });


        if (!response.ok) {
            // throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        // throw error;
    }
}

const AdminPostRequestWithJSON = async (pathname, query = "", model) => {
    console.log("AdminPostRequestWithJSON");
    const cookies = new Cookies();
    const token = cookies.get("token") ?? null;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    let apiUrl = backendUrl +'/admin/'+ pathname + (query !== "" ? ("?" + query) : "")
    //console.log("model");
    //console.log(model);
    apiUrl=apiUrl.replace("//",'/')
    try {
        const formData = new FormData();
        const arr = Object.entries(model)
            .filter(([name, value]) => value !== null) // Null olmayan öğeleri filtrele
            .map(([name, value]) => ({name, value}));
        //console.log("arr");
        //console.log(arr);
        for (let i = 0; i < arr.length; i++) {

            formData.append(arr[i].name, arr[i].value);

        }
        /*        formData.append("uid", "5f549f39-52a0-43f6-ac04-af77bd73214d");
                formData.append("email", "test@gmail.com4");
                formData.append("phone", "905554433223");*/
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json',
            }, body: JSON.stringify(model),
        });


        if (!response.ok) {
            // throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        // throw error;
    }
}
const HandleImageUpload = async (fileInput, description, uid, fileType) => {
    if (!fileInput) {
        console.error('Lütfen bir resim seçin');
        return;
    }

    try {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const query = `description=${description}&referenceUId=${uid}&fileType=${fileType}`
        const formData = new FormData();
        formData.append('file', fileInput, fileInput.name);

        const requestOptions = {
            method: 'POST', headers: {
                "Authorization": `Bearer ${token}`, // 'Content-Type': 'application/json',
            }, body: formData, redirect: 'follow',
        };

        const response = await fetch(backendUrl + "/File/Upload?" + query, requestOptions);

        if (!response.ok) {
            alert('Resim yükleme hatası: ' + response.status);
        }

        // //console.log(response);
        return await response.json()
    } catch (error) {
        console.error('Resim yükleme hatası:', error);
    }
};

const HandleImageUploadByType = async (fileInput, description, fileType) => {
    if (!fileInput) {
        console.error('Lütfen bir resim seçin');
        return;
    }

    try {
        const cookies = new Cookies();
        const token = cookies.get("token") ?? null;

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const query = `description=${description}&fileType=${fileType}`
        const formData = new FormData();
        formData.append('file', fileInput, fileInput.name);

        const requestOptions = {
            method: 'POST', headers: {
                "Authorization": `Bearer ${token}`, // 'Content-Type': 'application/json',
            }, body: formData, redirect: 'follow',
        };

        const response = await fetch(backendUrl + "/File/UploadByType?" + query, requestOptions);

        if (!response.ok) {
            alert('Resim yükleme hatası: ' + response.status);
        }
        return await response.json()
    } catch (error) {
        console.error('Resim yükleme hatası:', error);
    }
};

const FileDownload = async (uid) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const apiUrl = backendUrl + "/File/DownloadFile?uId=" + uid

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Resim indirilemedi.');
    }
    return await response.blob();
}


const GetFileListByReferenceId = async (referenceId) => {
    const fileList = await ApiGetRequest("/File/GetByReferenceId", `referenceId=${referenceId}`)
    if (fileList.errorMessage === null) {
        return fileList.fileVMList
    }

}


export {
    ApiGetRequest,
    ApiGetRequestWithToken,
    ApiPostRequest,
    ApiPostRequestWithModel,
    HandleImageUpload,
    FileDownload,
    GetFileListByReferenceId,
    HandleImageUploadByType,
    AdminGetRequest,
    AdminPostRequest,
    AdminPostRequestWithModel,
    AdminPostRequestWithJSON
}