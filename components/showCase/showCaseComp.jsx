'use client'
import React, {useEffect, useState} from 'react';
import styles from './style.module.css'
import Image from "next/image";
import Link from "next/link";
import {ApiGetRequest} from "@/services/admin";

function ShowCaseComponent(props) {

    // const { data} = props
    // if (!data||data.length<1){
    //     return
    // }
    const [data, setData]=useState([])
    const getShowCaseData = async () => {
        // const response = await AdminGetRequest("/MainPageSetting/GetByType?type=showcase")
        // const response = await fetch('https://esknet.asystee.com/api/MainPageSetting/GetByType?type=showcase', {cache: 'no-cache'})
        const response = await ApiGetRequest("/MainPageSetting/GetByTypeForMainPage","type=showcase")

        if (!response.errorMessage){
            // console.log(response);
            setData(response.mainPageSettingVMList)
        }

        // const data =await response.json()

        // console.log("--------------------- type=showcase");
        // console.log(data.mainPageSettingVMList);
        // console.log("--------------------- type=showcase");
        // return data.mainPageSettingVMList?? []



    }
    useEffect(()=>{
        getShowCaseData()
    },[])

    if (!data||data.length<1){
        return
    }
    return (
        <div className={styles['showCaseMain'] + '  container-xl '}>
            {/*<div className={"d-flex"}>*/}
            <h3 className={"area-header"}>Vitrin <i className={"area-header-line"}></i></h3>

            {/*</div>*/}
            <div className="d-flex m-0 flex-wrap justify-content-center">
                {data.map((d, index) =>
                    <div key={index} className={styles['item'] + ' col-md-3-'}>

                        <Link href={"/ilan/detay/"+d.advertisementTitle+"/"+d.advertisementId+"?id="+d.advertisementId} className={styles['showCaseCard'] + " card shadow border-0 shadowHover"}>
                            <img src={d.imageBase64? ("data:image/jpeg;base64,"+d.imageBase64):"/images/no_image.jpg"} width={255} height={192} className={styles['cardImgTop']+" "} alt={d.advertisementTitle}/>
                           <div className={"d-flex flex-column w-100 vh-100 justify-content-center align-items-center"}>
                               {d.companyLogoBase64&&   <img src={ ("data:image/jpeg;base64,"+d.companyLogoBase64)} height={100} width={75} className="m-auto my-2 w-75 " alt={d.companyName}/>}

                               {/*<img src={ ("/images/no_image.jpg")} height={60} width={40} className="m-auto my-2 w-75 " alt={d.companyName}/>*/}

                               <p className="card-text text-center fw-bold fs-6">
                                   {d.advertisementTitle}
                               </p>
                           </div>
                            <div className="card-body">

                            </div>
                        </Link>
                    </div>
                )}

            </div>

        </div>
    );
}

export default ShowCaseComponent;