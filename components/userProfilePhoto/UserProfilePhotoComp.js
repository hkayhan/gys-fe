import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest, FileDownload, HandleImageUpload} from "@/services/admin";
import Swal from "sweetalert2";

function UserProfilePhotoComp(props) {
    const {uid, userType, photoType} = props
    // //console.log("userType");
    // //console.log(userType);
    const changeUserPic = async () => {
        let userPic = document.getElementById("userPicUpdate")
        let inputPic = document.getElementById("inputPic")
        // //console.log("inputText pic onchange 1")
        userPic.src = URL.createObjectURL(inputPic.files[0])
        let response = await HandleImageUpload(inputPic.files[0], (photoType?photoType:"profile_photo"), uid, (photoType?photoType:"profile_photo"))
        // //console.log(response);
        if (response?.errorMessage !== null) {
            await Swal.fire({
                title: "Hata",
                icon: "error",
                text: response.errorMessage,
                confirmButtonText: "Tamam",
            });

        } else {
            // await Swal.fire("Başarıyla Eklendi!");
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarıyla Eklendi!",
                showConfirmButton: false,
                timer: 1500
            });
        }


        /*    // inputPic.onchange
            inputPic.onchange=function () {
                //console.log("inputText pic onchange 2")
                userPic.src=URL.createObjectURL(inputPic.files[0])

            }*/
    }
    const getUserPhoto = async () => {

        const fileList = await ApiGetRequest("/File/GetByReferenceId", `referenceId=${uid}`)
        if (fileList.errorMessage !== null) {
            await Swal.fire({
                title: "Hata",
                icon: "error",
                text: fileList.errorMessage,
                confirmButtonText: "Tamam",
            });
        }

        // await FileDownload()


        if (fileList?.fileVMList.length > 0) {
            const blob = await FileDownload(fileList?.fileVMList[0].uId)
            console.log(blob);
            let userPic = document.getElementById("userPicUpdate")
            userPic.src = URL.createObjectURL(blob);

        }
        console.log(fileList);
    }


    useEffect(() => {
        getUserPhoto()
    }, [])

    return (
        <div className={"d-flex flex-column align-items-center text-center"}>
            {uid}
            <img alt={""}
                 id={"userPicUpdate"}
                 className={"  " + (userType === "person" ? "rounded-circle" : "rounded")}
                 width={"150px"}
                 height={"150px"}
                 src={"/images/no_image.jpg"}
            />


            <br/>
            <label htmlFor="inputPic" className={"btn btn-danger"}>
                <FontAwesomeIcon className={"me-2"}
                                 icon={faPencil}/>Fotoğrafı
                Güncelle</label>
            <input onChange={() => changeUserPic()}
                // defaultValue={"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                   className={"d-none"}
                   id={"inputPic"} type={"file"}
                   accept={"image/jpg, image/png, image/jpg"}/>
            <br/>
            <hr className={"w-100 d-md-none"}/>

        </div>


    );
}

export default UserProfilePhotoComp;