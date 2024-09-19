import React, {useEffect, useState} from 'react';
import styles from './AddPhoto.module.css'
import {ApiGetRequest, FileDownload, HandleImageUpload} from "@/services/admin";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faPlus} from "@fortawesome/free-solid-svg-icons";

function AddPhotoComp(props) {

    const {uid}= props
    const [isPhotoExist, setIsPhotoExist] = useState(false)
    // //console.log("userType");
    // //console.log(userType);
    const changeUserPic = async () => {
        let userPic = document.getElementById("userPic")
        let inputPic = document.getElementById("inputPic")
        // //console.log("inputText pic onchange 1")
        userPic.src = URL.createObjectURL(inputPic.files[0])
        let response = await HandleImageUpload(inputPic.files[0], "profile_photo", uid, "profile_photo")
        // //console.log(response);
        if (response?.errorMessage !== null) {
            await Swal.fire({
                title: "Hata",
                icon: "error",
                text: response.errorMessage,
                confirmButtonText: "Tamam",
            });

        } else {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarıyla Eklendi!",
                showConfirmButton: false,
                timer: 1500
            });
            // await Swal.fire({title:"Başarıyla Eklendi!", denyButtonText:"Tamam", icon:"success"});

        }



    }
    const getUserPhoto = async () => {

        const fileList = await ApiGetRequest("/File/GetByReferenceId", `referenceId=${uid}`)
        if (fileList.errorMessage !== null) {
            await Swal.fire({
                title: "Hata",
                icon: "error",
                text: fileList.errorMessage,
                denyButtonText: "Tamam",
            });
        }

        // await FileDownload()


        if (fileList?.fileVMList.length > 0) {
            // //console.log(fileList?.fileVMList[0]);
            const blob = await FileDownload(fileList?.fileVMList[0].uId)
            let userPic = document.getElementById("userPic")
            userPic.src = URL.createObjectURL(blob);
            setIsPhotoExist(true)

        }
        // //console.log(fileList);
    }


    useEffect(() => {
        getUserPhoto()
    }, [])

    return (
        <div className={"d-flex flex-column align-items-center text-center"}>
            <label htmlFor="inputPic" className={"btn btn-primary"}>
                <FontAwesomeIcon className={"me-2"}
                                 icon={faPlus}/>Fotoğraf Ekle</label>
            <input onChange={() => changeUserPic()}
                // defaultValue={"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                   className={"d-none"}
                   id={"inputPic"} type={"file"}
                   accept={"image/jpg, image/png, image/jpg"}/>
            <br/>
            <img alt={""}
                 id={"userPic"}
                 className={"rounded "+ (!isPhotoExist&&"d-none1")}
                 width={"100%"}
                 // height={"150px"}
                 src={"/no_image.jpg"}/>
            {/*<span*/}
            {/*    className={"fw-bold"}>Ahmet Doğru*/}
            {/*</span>*/}

            <br/>

            <hr className={"w-100 d-md-none"}/>

        </div>


    );
}

export default AddPhotoComp;