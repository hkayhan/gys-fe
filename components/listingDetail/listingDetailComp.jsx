'use client'
import React, {useEffect, useState} from 'react';

import styles from './styles.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBolt,
    faBuilding,
    faCalendarDays,
    faCheck,
    faEnvelope,
    faHeart,
    faHeartCircleCheck,
    faLocationDot,
    faMarsAndVenus,
    faPeopleGroup,
    faPhone,
    faPlus,
    faShare
} from "@fortawesome/free-solid-svg-icons";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import FavoritesButtonItem from "@/Items/favoritesButton/FavoritesButtonItem";
import {ApiGetRequest, ApiPostRequestWithModel, FileDownload, GetFileListByReferenceId} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";
import swal from "sweetalert2";
import ShareAdvertComp from "@/components/shareAdvert/ShareAdvertComp";

function ListingDetailComp(props) {

    const {advertId, advertTitle} = props
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [advertisement, setAdvertisement] = useState([])
    const [user, setUser] = useState([])
    const [currentUser, setCurrentUser] = useState([])
    const [advertType, setAdvertType] = useState("")
    const [activeImageUid, setActiveImageUid] = useState("")
    const [fileList, setFileList] = useState([])
    const [properties, setProperties] = useState([])
    const [applicantData, setApplicantData] = useState(false)

    const getAdvertisement = async () => {
        const response = await ApiGetRequest("/Advertisement/GetById", `id=${advertId}`)
        if (!response.errorMessage) {
            setAdvertisement(response.advertisementVM)
            setAdvertType(response.advertisementType)
            await getOwnerByUid(response.advertisementVM.userUId)
            setIsLoading(true)
            await getAdvertPhotos(response.advertisementVM.uid)
            await getApplicantData()

        }
    }


    const getApplicantData = async () => {
        const response = await ApiGetRequest("/Applicant/GetApplicantData", `advertisementId=${advertId}`)
        if (!response.errorMessage) {
            setApplicantData(true)

        }
    }


    const getCurrentUserData = async () => {
        try {
            const response = await ApiGetRequest("/Users/GetCurrentUser")
            setCurrentUser(response?.user)
            // setCvProperties(response?.cvPropertyVMList)
            // setPropertyAdd(property)
            // setShowPropertyAddArea("")

        } catch (error) {
            //console.log(error)
        }
        setIsLoading(true)

    }
    const getOwnerByUid = async (uid) => {
        const response = await ApiGetRequest("/Users/GetByUidForAdvertisement", `uid=${uid}`)
        if (!response.errorMessage) {
            setUser(response.userVM)
        }
    }

    const getAdvertPhotos = async (referenceId) => {
        const fileList = await GetFileListByReferenceId(referenceId)
        if (fileList.length > 0) {
            setFileList(fileList)
            // await getActivePic(fileList[0].uId)

        }
        //console.log(fileList);
    }

    const getAdvertProperties = async () => {
        const response = await ApiGetRequest("/AdvertisementProperty/GetAdvertisementPropertyByAdvertisementId", `advertisementId=${advertId}&isSocialMedia=true`)
        if (!response.errorMessage) {
            const groupedData = response.advertisementPropertyVMList.reduce((acc, obj) => {
                if (!acc[obj.value]) {
                    acc[obj.value] = [];
                }
                acc[obj.value].push(obj.propertyValue);
                return acc;
            }, {});
            const groupedArray = Object.entries(groupedData).map(([key, value]) => ({
                value: key, propertyValues: value
            }));
            setProperties(groupedArray)

            // //console.log("groupedData", groupedArray);
        }
    }

    useEffect(() => {
        getAdvertisement()
        getAdvertProperties()
        getCurrentUserData()
    }, [])

    useEffect(() => {
        if (fileList && fileList.length > 0) {
            getActivePic(fileList[0].uId)
        }
    }, [fileList])

    const formatDate = (dateStr) => {

        console.log("dateStr:", dateStr);
        let date = new Date(dateStr)
        try {
            let localDate = date// .toLocaleString('tr-TR'); // Türkçe yerel saat dilimi kullanarak biçimlendirme

            let dtf = new Intl.DateTimeFormat('tr-TR', {
                year: 'numeric', month: '2-digit', day: '2-digit', // hour: 'numeric',
                // minute: 'numeric',
                // second: 'numeric',
                hour12: false, // 24 saat biçiminde göstermek için
            });

            return dtf.format(localDate);
        } catch (e) {
            console.log("format date error", e, "-------", dateStr)
        }

    }

    const getActivePic = async (uid) => {
        // //console.log(fileList?.fileVMList[0]);
        const blob = await FileDownload(uid)
        setActiveImageUid(uid)
        //console.log(blob);
        let userPic = document.getElementById("activePic")
        userPic.src = URL.createObjectURL(blob);


    }

    function callPhoneNumber(phoneNumber) {
        window.location.href = `tel:${phoneNumber}`;
    }

    const applyAdvert = async (message) => {

        let formData = {
            AdvertisementId: advertId, Message: message
        }

        const response = await ApiPostRequestWithModel("/Applicant/Add", "", formData)
        console.log("response");
        console.log(response);
    }

    const applyAdvertPopup = async () => {
        Swal.fire({
            title: "Başvuruna not eklemek ister misin?",
            input: "textarea",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Başvur",
            cancelButtonText: "Vazgeç",
            showLoaderOnConfirm: true,
            preConfirm: async (data) => {
                try {
                    await applyAdvert(data)
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Başarılı",
                    text: "Başvurun İlgiliye Gönderildi",
                    showConfirmButton: false,
                    timer: 1500
                });

                getApplicantData()
            }
        });
    }

    const gotoCompanyPage = () => {
        router.push("/companyProfile?uid=" + user.uid)
        router.refresh()
    }

    const openSharePopup = () => {

    }
    if (!isLoading) {
        return <LoadingComp/>
    }
    return (<div className={styles['listingDetailMain'] + ' w-100 container d-flex flex-wrap'}>


        <div className=" col-md-8 col-12 p-2">
            <div className="card h-100">

                <div className={styles['listingDetailCardHeader'] + " card-header "}>
                    <h2 className={"card-title mt-2 ps-2 pt-2"}>
                        {advertisement.title}
                    </h2>
                    {user?.userTypeKey === "firm" && <h6 className={"pointer card-subtitle px-2"}>
                        {user.companyName}
                    </h6>}
                    <div className={"text-muted mt-2 ms-2 d-flex"}>
                        {/*<span className={"me-4 "}>
                                <FontAwesomeIcon className={"me-1"} icon={faLocationDot}/>Eskişehir
                            </span>*/}
                        <span
                            className={"ms-2"}>
                                <FontAwesomeIcon className={"me-1"}
                                                 icon={faCalendarDays}/> {formatDate(advertisement?.adStartDate)}  </span>
                        <div
                            className={"flex-grow-1 d-flex justify-content-end align-items-center text-underline"}>
                            <FavoritesButtonItem advertId={advertId}/>
                        </div>
                        <div
                            className={"ms-2 d-flex justify-content-end align-items-center text-underline pointer"}>


                        <ShareAdvertComp/>
                        </div>
                    </div>
                </div>
                <div className={styles['listingDetailCardBody'] + " card-body"}>
                    {fileList && fileList.length > 0 && <div className={""}>

                        <div className={"d-flex justify-content-center"}>
                            <img alt={""}
                                 id={"activePic"}
                                 className={" "}
                                 width={""}
                                 height={"500px"}
                                 src={""}/>

                        </div>
                        <div className={"d-flex justify-content-center  my-1"}>
                            {fileList && fileList.length > 1 && fileList.map((f, index) => // <img key={index} src={"data:image/png;base64 " +f.thumbnailImageBase64} alt=""/>
                                <img key={index} onClick={() => getActivePic(f.uId)}
                                     className={`mx-1 ${f.uId === activeImageUid && styles['activeImageUrl']}`}
                                     src={"data:image/png;base64, " + f.thumbnailImageBase64}/>)
                                // <div key={index}>{f.thumbnailImageBase64}</div>)
                            }
                        </div>
                        <hr/>

                    </div>}
                    <div dangerouslySetInnerHTML={{__html: advertisement?.description}}/>

                </div>
                {/*<div className={"p-2"}>*/}
                {/*    <hr className={styles['listingDetailCardBodyHr'] + ' '}/>*/}

                {/*</div>*/}
                {properties && properties.length > 0 && <>
                    <hr/>
                    <div className={"d-flex justify-content-evenly flex-wrap"}>
                        {properties.map((p, index) => <div key={index}>
                            <div className={"fw-bold"}>{p.value}</div>
                            {p.propertyValues.map((pp, index) => <div key={index}>{pp}</div>)}
                        </div>)}
                    </div>
                    <hr/>
                </>}
                {/*{advertType}*/}
                {/*{JSON.stringify(user?.candidateApplyWithCV)}*/}
                {advertType === "employee" && user?.candidateApplyWithCV && currentUser?.showMyCVData && !applicantData &&
                    <div
                        className={styles['listingDetailCardBodyButtons'] + " d-flex justify-content-center align-items-center"}>
                        <button onClick={() => applyAdvertPopup()} className="btn btn-primary">
                            <FontAwesomeIcon className={"me-2"} icon={faPlus}/>Hemen Başvur
                        </button>
                    </div>}

                {advertType === "employee" && user?.candidateApplyWithCV && currentUser?.showMyCVData && applicantData &&
                    <div
                        className={styles['listingDetailCardBodyButtons'] + " d-flex justify-content-center align-items-center"}>
                        <button onClick={() => applyAdvertPopup()} className="btn btn-success disabled">
                            <FontAwesomeIcon className={"me-2"} icon={faCheck}/>Başvurun Gönderildi
                        </button>
                    </div>}

                <br/>
            </div>

        </div>

        <div className={styles['ownerCard'] + " col-md-4 col-12 p-2 "}>
            <div className="card">
                <div className="card-header">
                    <h5>İlan sahibi</h5>
                    {/*{user.userTypeKey ==="person" ?(user.firstName+" "+user.lastName):user.companyName}*/}
                </div>

                <div className="card-body d-flex flex-column align-items-center ">

                    {user.imageBase64 &&
                        <img className={"rounded"} height={100} src={"data:image/png;base64, " + user.imageBase64}
                             alt="..."/>}
                    <div className={"mt-2 fw-bold"}>  {user.firstName + " " + user.lastName}</div>

                    <div className={"text-start w-100 my-3"}>
                        {user.address1 !== "" && <div>{user.address1}</div>}
                        {user.address2 !== "" && <div>{user.address2}</div>}
                        {user.district !== "" && <div>{user.district}</div>}
                        {user.city !== "" && <div>{user.city}</div>}

                    </div>

                    <button className="btn btn-outline-secondary text-start w-100">
                        <FontAwesomeIcon icon={faEnvelope}/>
                        {user.email}
                    </button>
                    {user.showCompanyPhone && <button onClick={() => callPhoneNumber(user.phone)}
                                                      className="btn btn-outline-secondary text-start mt-1 w-100">
                        <FontAwesomeIcon icon={faPhone}/>
                        İlan Yetkilisi Ara
                    </button>}

                    <button onClick={() => {
                        gotoCompanyPage()
                    }} className="btn btn-outline-secondary text-start mt-2 w-100">
                        <FontAwesomeIcon icon={faBuilding}/> {user.userTypeKey === "person" ? "" : "Firmanın"} Tüm
                        İlanları
                    </button>


                    {/*<button className="btn btn-outline-secondary text-start mt-2 w-100">*/}
                    {/*    <FontAwesomeIcon icon={faShare}/>*/}
                    {/*    İlanı Paylaş*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    </div>);
}

export default ListingDetailComp;