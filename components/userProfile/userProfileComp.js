'use client'
import React, {useEffect, useState} from 'react';
import styles from './style.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressCard,
    faBookmark,
    faEnvelope,
    faIdBadge,
    faPhone,
    faUserCheck
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LoadingComp from "@/components/loading/LoadingComp";
import {ApiGetRequest, FileDownload} from "@/services/admin";
import Swal from "sweetalert2";
// import { useSearchParams } from 'next/navigation'
// import { useRouter } from "next/navigation";


function UserProfileComp(props) {
    const {uid} = props


    const [userData, setUserData] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [cvListRaw, setCvListRaw] = useState([])
    const [cvList, setCvList] = useState([])

    const getUserData = async () => {
        const data = await ApiGetRequest("/Users/GetByUid", "uId=" + uid);
        // //console.log("response");
        // //console.log(response);
        // const data = await response.json();
        setUserData(data['user']);
        setCvListRaw(data['cvPropertyVMList'])
        // //console.log(data);
        setIsLoading(true)
    };
    const getUserPhoto = async () => {

        //console.log("get user photo", userData)

        const fileList = await ApiGetRequest("/File/GetByReferenceId", `referenceId=${userData?.uid}`)
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
            //console.log(fileList?.fileVMList[0]);
            const blob = await FileDownload(fileList?.fileVMList[0].uId)
            let userPic = document.getElementById("userPic")
            userPic.src = URL.createObjectURL(blob);

        }
        //console.log(fileList);
    }


    useEffect(() => {
        getUserPhoto()
    }, [userData])

    const formatDate = (date) => {
        const dateObject = new Date(date);

        return dateObject.toLocaleDateString("tr-TR")
    }
    useEffect(() => {
        /*
                const getUserData = async () => {
                    try {
                        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
                        const response = await fetch(backendUrl+'/Users/GetByUid?uId=' + uid);
                        if (!response.ok) {
                            throw new Error('Failed to fetch users');
                        }
                        const data = await response.json();
                        setUserData(data['user']);
                        setCvListRaw(data['cvPropertyVMList'])
                        // //console.log(data);
                        setIsLoading(true)


                    } catch (error) {
                        console.error('Error fetching users:', error);
                        setIsLoading(true)
                    }
                };
        */
        getUserData();

    }, []);

    useEffect(() => {
        // //console.log("cvList")
        // //console.log(cvListRaw)
        let cvs = {}
        if (cvListRaw) {
            cvListRaw.forEach(c => {
                if (cvs[c.type] === undefined) {
                    cvs[c.type] = []
                }
                cvs[c.type].push(c)
                // //console.log(c)
            })
        }
        // //console.log("cvs");
        // //console.log(cvs);
        setCvList(cvs)

    }, [cvListRaw])

    if (!isLoading) {
        return <LoadingComp/>
    }

    return (
        <div>


            <div className={`${styles['userProfileMain']} container shadow  rounded bg-white mt-3 mb-5 p-3`}>


                <>
                    <div className={"d-flex justify-content-between align-items-center mb-3"}>
                        <h4 className={"text-right"}>{userData?.firstName.toUpperCase()} {userData?.lastName.toUpperCase()} Profil
                            Bilgileri</h4>
                    </div>
                    <hr/>
                    <div className={"row"}>
                        <div className={"col-md-4 border-right"}>
                            <div className={"d-flex flex-column align-items-start  p-3 py-5"}>

                                <img alt={""}
                                     id={"userPic"}
                                     className={"align-self-center rounded-circle mt-5"}
                                     width={"150px"}
                                     height={"150px"}
                                     src={"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}/>
                                <h5
                                    className={"align-self-center mt-3 border-bottom fw-bold"}>{userData?.firstName.toUpperCase()} {userData?.lastName.toUpperCase()}
                                </h5>


                                <span className={"mt-4  pointer "}>
                            <Link href={"tel:+905371234567"}><FontAwesomeIcon className={"me-1"}
                                                                              icon={faPhone}/> {userData?.phone} </Link>
                        </span>

                                <span className={"mt-2  pointer "}>
                            <Link href={"mail:ahmetdogru@gmail.com"}><FontAwesomeIcon className={"me-1"}
                                                                                      icon={faEnvelope}/> {userData?.email} </Link>
                        </span>

                                {userData?.address1 &&
                                    <span className={"mt-2   "}>
                                <span><FontAwesomeIcon className={"me-1"} icon={faAddressCard}/> {userData?.address1}  </span>
                                <span> {userData?.address2 && <>{userData?.address2}</>} </span>
                            </span>
                                }
                                {userData?.birthdate &&
                                    <span className={"mt-2   "}>
                            <span><FontAwesomeIcon className={"me-1"} icon={faIdBadge}/> {formatDate(userData?.birthdate)}</span>
                        </span>

                                }
                                <hr/>

                            </div>
                        </div>


                        <div className="col-md-8 p-3 py-5">

                            {/*Kendinden bahset*/}
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <div className="d-flex justify-content-between align-items-end experience">
                                        <h5 className={"fw-bold mb-0"}>Hakkımda</h5>
                                    </div>
                                    <hr/>
                                    <div>
                                        {userData?.personalInfo ? userData?.personalInfo : "Hakkımda Bilgisi Eklenmedi."}
                                    </div>

                                </div>

                                {/*eğitim*/}
                                <div className="col-12 col-md-6">
                                    <div className="d-flex justify-content-between align-items-end experience">
                                        <h5 className={"fw-bold mb-0"}>Eğitim</h5>

                                    </div>
                                    <hr/>
                                    {cvList['education'] === undefined && "Eğitim Bilgisi Eklenmedi."}
                                    {
                                        cvList['education'] !== undefined &&
                                        cvList['education'].map((e, index) =>
                                            <div className={"mb-3"} key={index}>

                                                <div className={`${styles['']}  fw-bold`}><FontAwesomeIcon
                                                    className={"me-2"}
                                                    icon={faBookmark}/>
                                                    {e.organizationName}</div>
                                                <div>{e.positionName}</div>
                                                <div></div>
                                                <div className={"text-muted"}>{e.startDate &&
                                                    <div>Başlangıç :{e.startDate}</div>} {e.endDate &&
                                                    <div>Bitiş :{e.endDate}</div>}</div>
                                            </div>)}
                                </div>

                                {/*deneyim*/}
                                <div className="col-12 col-md-6">
                                    <div className="d-flex justify-content-between align-items-end experience">
                                        <h5 className={"fw-bold mb-0"}>Deneyim</h5>

                                    </div>
                                    <hr/>
                                    {cvList['experience'] === undefined && "Deneyim Bilgisi Eklenmedi."}
                                    {
                                        cvList['experience'] !== undefined &&
                                        cvList['experience'].map((e, index) =>
                                            <div className={"mb-3"} key={index}>

                                                <div className={`${styles['']}  fw-bold`}><FontAwesomeIcon
                                                    className={"me-2"}
                                                    icon={faUserCheck}/>
                                                    {e.organizationName}</div>
                                                <div>{e.positionName}</div>
                                                <div></div>
                                                <div className={"text-muted"}>{e.startDate &&
                                                    <div>Başlangıç :{e.startDate}</div>} {e.endDate &&
                                                    <div>Bitiş :{e.endDate}</div>}</div>
                                            </div>)}

                                </div>

                                {/*yetenekler*/}
                                <div className="col-12  col-md-6">
                                    <div className="d-flex justify-content-between align-items-end experience">
                                        <h5 className={"fw-bold mb-0"}>Beceriler</h5>

                                    </div>
                                    <hr/>
                                    {cvList['knowledge'] === undefined && "Beceri Bilgisi Eklenmedi."}
                                    {
                                        cvList['knowledge'] !== undefined &&
                                        cvList['knowledge'].map((e, index) =>
                                            <div className={"mb-3"} key={index}>

                                                <div className={`${styles['']}  fw-bold`}><FontAwesomeIcon
                                                    className={"me-2"}
                                                    icon={faUserCheck}/>
                                                    {e.organizationName}</div>
                                                <div>{e.positionName}</div>
                                                <div></div>
                                                <div className={"text-muted"}>{e.startDate &&
                                                    <div>Başlangıç :{e.startDate}</div>} {e.endDate &&
                                                    <div>Bitiş :{e.endDate}</div>}</div>
                                            </div>)}

                                </div>

                            </div>
                        </div>


                    </div>
                </>
            </div>
        </div>);
}

export default UserProfileComp;