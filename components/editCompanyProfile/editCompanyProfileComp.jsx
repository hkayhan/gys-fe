'use client'
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faBookOpenReader,
    faBuilding,
    faCheck,
    faGraduationCap,
    faPencil,
    faPersonShelter,
    faPlus,
    faSave,
    faUserCheck,
    faUserPen
} from "@fortawesome/free-solid-svg-icons";
import Head from 'next/head';

import styles from './editCompanyProfile.module.css'
import TextEditor from "@/components/textEditor/textEditorComp";
import UserProfilePhotoComp from "@/components/userProfilePhoto/UserProfilePhotoComp";
import {useRouter, useSearchParams} from "next/navigation";
import {ApiGetRequest, ApiPostRequest, ApiPostRequestWithModel} from "@/services/admin";
import Swal from "sweetalert2";
import InputField from "@/FormComponents/inputText/InputText";
import LoadingComp from "@/components/loading/LoadingComp";
import CheckBox from "@/FormComponents/checbox/CheckBox";

function EditCompanyProfileComp(props) {
    const {userUid} = props
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState([])

    const getCurrentUserData = async () => {
        try {
            const response = await ApiGetRequest("/Users/GetCurrentUser")
            setUserData(response?.user)
            setIsLoading(true)
        } catch (error) {
            //console.log(error)
        }
    }


    const getUserDataByUid = async () => {
        try {
            const response = await ApiGetRequest("/Users/GetByUid","uId=" + userUid)
            setUserData(response?.user)

        } catch (error) {
        }
        setIsLoading(true)

    }


    useEffect(() => {
        if (userUid){
            getUserDataByUid()
        }else {
            getCurrentUserData()

        }
    }, [])


    const handleChange = (e) => {
        const {name, value} = e.target;
        //console.log("name, value");
        //console.log(name, value);

        setUserData(prevData => ({
            ...prevData, [name]: value
        }));
    };


    const handleChangeCheckbox = (e) => {
        const {name, checked} = e.target;
        setUserData(prevData => ({
            ...prevData, [name]: checked // checked değerini kullanın
        }));
    };

    const handleChangeEditor = (e) => {
        const data = e.editor.getData();
        setUserData(prevData => ({
            ...prevData, ["personalInfo"]: data // checked değerini kullanın
        }));
    };


    const updateProfile = async () => {
        try {
            // ${userData}

            let swalResult = await Swal.fire({
                title: "Değişiklikleri Kaydetmek İstiyor Musunuz?",
                // showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Evet",
                // denyButtonText: `Don't save`
                cancelButtonText: "Vazgeç"
            })

            /* Read more about isConfirmed, isDenied below */
            if (swalResult.isConfirmed) {
                // let query = `uid=${userData.uid}&identityNumber=${userData.identityNumber}&firstName=${userData.firstName}&lastName=${userData.lastName}&birthDate=${userData.birthdate}&phone=${userData.phone}&email=${userData.email}&address1=${userData.address1}h&address2=${userData.address2}&street=${userData.street}&district=${userData.district}&city=${userData.city}&showMyCVData=${userData.showMyCVData}&personalInfo=${userData.personalInfo}`
                // query = query.replace("null", "")

                // let query = "objectToString(userData)"
                let query = "a=b"
                /*
                                //console.log(query);

                               return
                */

                // const response = await AdminPostRequest("/Users/UpdateProfile", query, [])
                const response = await ApiPostRequestWithModel("/Users/UpdateProfile", query, userData)
                //console.log(response);

                if (response?.errorMessage !== null) {
                    //console.log(response);
                    await Swal.fire(response.errorMessage, "", "error")

                } else {
                    await Swal.fire("Kaydedildi!", "", "success")

                    const next = searchParams.get("next")
                    //console.log(next);


                    router.push(next ? next : "/companyProfile?uid=" + userData.uid);
                    router.refresh();


                }

            }


        } catch (error) {

        }
    }


    const objectToString = (object) => {
        return Object.entries(object)
            .filter(([key, value]) => value !== null && value !== undefined)
            .map(([key, value]) => key + "=" + value)
            .join("&");
    }

    if (!isLoading) {
        return <LoadingComp/>
    }

    return (<div>
        <div className={`${styles['companyProfileMain']} container rounded bg-white mt-5 mb-5 p-3`}>
            <div className={"d-flex justify-content-between align-items-center mb-3"}>
                <h4 className={"text-right"}>Şirket Profil Bilgileri</h4>
            </div>
            <hr/>
            <div className={"row"}>
                {/*profile photo*/}
                <div className={"col-12 col-sm-4 p-3 py-5"}>
                    <div className="">
                        <h5 className={"fw-bold border-bottom"}>
                            <FontAwesomeIcon className={"me-1"} icon={faBuilding}/>
                            Şirket Fotoğrafı</h5>
                    </div>
                    <UserProfilePhotoComp uid={userData?.uid} userType={userData?.userType?.key} photoType={"firm_logo"}/>
                </div>

                {/*şirket ad ve adres*/}
                <div className={"col-12 col-sm-8 p-md-3 py-md-5 row"}>
                    <div className="">
                        <h5 className={"fw-bold border-bottom"}>
                            <FontAwesomeIcon className={"me-1"} icon={faBuilding}/>
                            Şirket Bilgileri</h5>
                    </div>
                    {/*<hr/>*/}
                    <div className={"col-12"}>
                        <InputField
                            label="Şirket Adı"
                            name={"companyName"}
                            value={userData.companyName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12 mt-3">
                        <InputField
                            label="Adres"
                            name={"address1"}
                            value={userData.address1}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-12 mt-2">
                        <InputField
                            label="Adres Devamı"
                            name={"address2"}
                            value={userData.address2}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12 mt-2">
                        <InputField
                            label="Cadde/Sokak"
                            name={"street"}
                            value={userData.street}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 col-12 mt-2">
                        <InputField
                            label="İlçe"
                            name={"district"}
                            value={userData.district}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 col-12 mt-2">
                        <InputField
                            label="İl"
                            name={"city"}
                            value={userData.city}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 col-12 mt-2">
                        <InputField
                            label="Vergi Dairesi"
                            name={"taxOffice"}
                            value={userData.taxOffice}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 col-12 mt-2">
                        <InputField
                            label="Vergi Dairesi"
                            name={"taxNumber"}
                            value={userData.taxNumber}
                            onChange={handleChange}
                        />
                    </div>


                </div>

                {/*Şirket Yetkili İletişim*/}
                <div className={"col-12 col-sm-8 p-3 py-5 row"}>
                    <div className=" ">
                        <h5 className={"fw-bold border-bottom"}>
                            <FontAwesomeIcon className={"me-1"} icon={faUserPen}/>
                            İşe Alım Yetkilisi</h5>

                    </div>
                    {/*<hr/>*/}
                    {/*Şirket Yetkili ad ve iletişim*/}
                    {/*<div className={"col-12  "}>*/}
                    <div className={"col-md-6"}>

                        <InputField
                            label="Ad"
                            name={"firstName"}
                            value={userData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={"col-md-6"}>

                        <InputField
                            label="Soyad"
                            name={"lastName"}
                            value={userData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    {/*</div>*/}

                    <div className={"col-12 mt-3"}>
                        <InputField
                            label="Telefon Numarası"
                            name={"phone"}
                            value={userData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12 mt-3">
                        <InputField
                            label="E-Posta"
                            name={"email"}
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/*İzinler*/}
                <div className={"col-12 col-sm-4 p-3 py-5 row"}>
                    <div className=" ">
                        <h5 className={"fw-bold border-bottom"}>
                            <FontAwesomeIcon className={"me-1"} icon={faCheck}/>
                            İzinler</h5>

                    </div>
                    <div className="form-check mt-2">
                        <CheckBox label={"Telefon numaramız ilanlarda gözüksün."} name={"showCompanyPhone"}
                                  value={userData.showCompanyPhone} onChange={handleChangeCheckbox}/>

                    </div>

                    <div className="form-check mt-2">

                        <CheckBox label={"Adaylar CV göndererek başvurabilsin."} name={"candidateApplyWithCV"}
                                  value={userData.candidateApplyWithCV} onChange={handleChangeCheckbox}/>

                    </div>
                </div>

                <div className={"col-12  p-3 py-5 "}>
                    <div className=" ">
                        <h5 className={"fw-bold border-bottom"}>
                            <FontAwesomeIcon className={"me-1"} icon={faCheck}/>
                            Şirket Hakkında</h5>

                    </div>

                    <p className={"text-muted"}>Şirketiniz hakkında bilgi vermek için aşağıdaki metin editörünü
                        kullanabilirsiniz.</p>

                    <TextEditor name={"personalInfo"} onChange={handleChangeEditor} value={userData.personalInfo}/>
                </div>



            </div>


            <div className="mt-5 text-center">
                <button onClick={() => updateProfile()} className="btn btn-primary profile-button" type="button">
                    <FontAwesomeIcon icon={faSave} className={`${styles['']} me-2`}/>
                    Kaydet ve Profili İncele
                </button>
            </div>
        </div>
    </div>);
}


export default EditCompanyProfileComp;