'use client'
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faBookOpenReader,
    faBuilding,
    faCheck, faEnvelope,
    faGraduationCap,
    faPencil,
    faPersonShelter,
    faPhone,
    faPlus,
    faSave,
    faUserCheck,
    faUserPen
} from "@fortawesome/free-solid-svg-icons";
import Head from 'next/head';

import styles from './companyProfile.module.css'
import TextEditor from "@/components/textEditor/textEditorComp";
import Link from "next/link";
import ListingComp from "@/components/listingComp/listingComp";
import {ApiGetRequest, FileDownload, GetFileListByReferenceId} from "@/services/admin";
import {useSearchParams} from "next/navigation";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import PaginationComp from "@/components/pagination/PaginationComp";



function CompanyProfileComp(props) {
    console.log("in company profile");
    const searchParams = useSearchParams()
    const companyUid = searchParams.get("uid")
    const [userData, setUserData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [adverts, setAdverts] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)

    const getCurrentUserData = async () => {
        try {
            const response = await ApiGetRequest("/Users/GetCurrentUser")
            setUserData(response?.user)
            setIsLoading(true)
            // await getUserPhoto(response.user.uid)
            await getCompanyAdverts(response.user.uid)
        } catch (error) {
            //console.log(error)
        }
    }

    const getUserPhoto2 = async (uid) => {
        const fileList = await GetFileListByReferenceId(uid)
        if (!fileList.errorMessage) {
            if (fileList.length > 0) {
                console.log(fileList[0]);
                const blob = await FileDownload(fileList[0].uId)
                let userPic = document.getElementById("userPic")
                userPic.src = URL.createObjectURL(blob);

            }
        }
    }
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



    const getCompanyAdverts= async(uid)=>{
        // //console.log("getCompanyAdverts");
        const response =await ApiGetRequest("/Advertisement/GetUserAdvertisementList", `userUId=${uid}`)
        if (!response.errorMessage){
            // //console.log(response);
            setAdverts(response.advertisementVMList)
            setTotalListCount(response['count'])

        }
    }

    const getUserDataWithUid=async (uid)=>{
        try {
            const response = await ApiGetRequest("/Users/GetByUidForAdvertisement","uid="+uid)
            setUserData(response?.userVM)
            setIsLoading(true)
            // await getUserPhoto(response.useruserVM.uid)
            await getCompanyAdverts(response.useruserVM.uid)
        } catch (error) {
            //console.log(error)
        }
    }


    useEffect(()=>{
        if (companyUid){
            //get company data from uid
            getUserDataWithUid(companyUid)
        }else {
            getCurrentUserData()
        }

    },[])

    useEffect(() => {

    })
    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (!isLoading){
        return (<LoadingComp/>)
    }

    return (

        <div>
            <div className={`${styles['companyProfileMain']} container rounded bg-white mt-5 mb-5 p-3 shadow`}>
                <div className={"d-flex justify-content-between align-items-center mb-1"}>
                    <h4 className={"text-right"}>Şirket Profil Bilgileri</h4>
                </div>
                <hr/>
                <div className={"row"}>
                    {/*profile photo*/}
                    <div className={"col-12 col-sm-2 p-3 "}>
                        {/*<div className="">*/}
                        {/*    <h5 className={"fw-bold border-bottom"}>*/}
                        {/*        <FontAwesomeIcon className={"me-1"} icon={faBuilding}/>*/}
                        {/*        Şirket Fotoğrafı</h5>*/}
                        {/*</div>*/}
                        <div className={"d-flex flex-column align-items-center text-center  "}>

                            <img alt={""}
                                 id={"userPic"}
                                 className={"rounded "}
                                 width={"150px"}
                                 height={"150px"}
                                 src={"/images/no_image.jpg"}/>
                            {/*<span*/}
                            {/*    className={"fw-bold"}>Ahmet Doğru*/}
                            {/*</span>*/}

                        </div>
                    </div>

                    {/*şirket ad ve adres*/}
                    <div className={"col-12 col-sm-7 p-3 py-5 row"}>
                        {/*<div className="">*/}
                        {/*    <h5 className={"fw-bold border-bottom"}>*/}
                        {/*        <FontAwesomeIcon className={"me-1"} icon={faBuilding}/>*/}
                        {/*        Şirket Bilgileri</h5>*/}
                        {/*</div>*/}
                        {/*<hr/>*/}
                        <div className={"col-12"}>
                            <h4 className={" mb-3"}><span className={"fw-bold border-bottom mb-1 p-1"}>{userData.companyName.toUpperCase()}</span>
                            </h4>
                            {/*<label className={"labels"}>Şirket Adı</label>*/}
                            {/*<inputText type="text" className={"form-control"}*/}
                            {/*       placeholder={"Şirket Adı"}*/}
                            {/*/>*/}

                            <div className={"fw-bold"}>{userData.address1} {userData.address2}</div>
                            <div className={"fw-bold"}>{userData.street}</div>
                            <div className={"fw-bold"}>{userData.district} / {userData.city}</div>
                        </div>


                    </div>

                    {/*Şirket Yetkili İletişim*/}
                    <div className={"col-12 col-sm-3 p-3 py-5 row"}>
                        <div className=" ">
                            <h5 className={"fw-bold border-bottom"}>
                                <FontAwesomeIcon className={"me-1"} icon={faUserPen}/>
                                İşe Alım Yetkilisi</h5>

                        </div>
                        {/*<hr/>*/}
                        {/*Şirket Yetkili ad ve iletişim*/}
                        <div className={"col-12  "}>
                            {userData.firstName} {userData.lastName}
                        </div>

                        <div className={"col-12 mt-3"}>
                            <span className={"mt-4  pointer "}>
                                <Link href={"tel:+905371234567"}><FontAwesomeIcon className={"me-1"} icon={faPhone}/> {userData.phone} </Link>
                            </span>
                        </div>

                        <div className="col-12 mt-3">
                           <span className={"mt-2  pointer "}>
                                <Link href={"mail:ahmetdogru@gmail.com"}><FontAwesomeIcon className={"me-1"}
                                                                                          icon={faEnvelope}/> {userData.email} </Link>
                            </span>
                        </div>
                    </div>


                    <div className={"col-12  p-3  "}>
                        <div className=" ">
                            <h5 className={"fw-bold border-bottom"}>
                                {/*<FontAwesomeIcon className={"me-1"} icon={faCheck}/>*/}
                                Şirket Hakkında</h5>

                        </div>

                        <div className={"text-muted"}>
                            <div dangerouslySetInnerHTML={{__html: userData.personalInfo}}/>
                        </div>

                    </div>

                    <div className={"col-12  p-3  "}>
                        <div className=" ">
                            <h5 className={"fw-bold border-bottom"}>
                                {/*<FontAwesomeIcon className={"me-1"} icon={faCheck}/>*/}
                                Şirkete Ait İlanlar</h5>

                        </div>
                        <ListingComp adverts={adverts}/>
                        <div className="d-flex  flex-column justify-content-center align-items-center mt-5">
                            {/*<h2><FontAwesomeIcon icon={faExclamation}/></h2>*/}
                            {totalListCount===0&&
                                <h4 className={" "}>Şirkete ait ilan bulunamadı.</h4>

                            }
                        </div>
                    </div>
                    {
                        totalListCount > 25 &&

                        <PaginationComp
                            // postsPerPage={perPage}
                            currentPage={currentPage}
                            totalPosts={totalListCount}
                            paginate={paginate}
                        />
                    }

                </div>



            </div>
        </div>);
}


export default CompanyProfileComp;