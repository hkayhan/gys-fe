'use client'
import React,{useState, useEffect} from 'react';
import styles from './style.module.css'
import Image from "next/image";
import Link from "next/link";
import {ApiGetRequest} from "@/services/admin";

function ShowCaseSmallComponent(props) {

    // const { data} = props
    // if (!data||data.length<1){
    //     return
    // }
    const [data, setData]=useState([])
    const getShowCaseData = async () => {
        // const response = await AdminGetRequest("/MainPageSetting/GetByType?type=showcase")
        // const response = await fetch('https://esknet.asystee.com/api/MainPageSetting/GetByType?type=showcase', {cache: 'no-cache'})
        const response = await ApiGetRequest("/MainPageSetting/GetByTypeForMainPage","type=highlights")

        if (!response.errorMessage){
            // console.log("show small case :", response);
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
        <div className={styles['showCaseSmallMain'] + '  container-xl '}>
            {/*<div className={"d-flex"}>*/}
            <h3 className={"area-header"}>Öne Çıkanlar <i className={"area-header-line"}></i></h3>

            {/*</div>*/}
            <div className="d-flex flex-wrap justify-content-around m-0">
                {data.map((d, index) =>
                    <div key={index} className={styles['item'] + ' col-md-2'}>
                        {/*{//console.log(d)}*/}
                        <Link title={d.advertisementTitle} href={"/ilan/detay/"+d.advertisementTitle+"/"+d.advertisementId+"?id="+d.advertisementId} className={styles['showCaseCard'] + " card shadow shadowHover border-0"}>
                            {/*<img src={d.image.src} className={styles['cardImgTop']+" card-img-top"} alt="..."/>*/}
                            <img src={d.imageBase64? ("data:image/jpeg;base64,"+d.imageBase64):"/images/no_image.jpg"}  height={100} className={styles['cardImgTop']+" card-img-top"} alt={d.advertisementTitle}/>
                            <div className="card-body">
                                <p className="card-text text-center multiline-ellipsis">
                                    {d.advertisementTitle}

                                </p>
                            </div>
                        </Link>
                    </div>
                )}

            </div>

        </div>
    );
}

export default ShowCaseSmallComponent;