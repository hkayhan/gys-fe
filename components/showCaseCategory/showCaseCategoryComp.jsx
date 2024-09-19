'use client'
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
import Image from "next/image";
import {ApiGetRequest} from "@/services/admin";
import Link from "next/link";

function ShowCaseCategoryComponent(props) {

    const [data, setData] = useState([])
    console.log("---------------------------------------")
    const [highLights, setHighLights] = useState([])
    const getHighlights = async () => {
        console.log("response.mainPageSettingVMList.slice(0, 4)");

        const response = await ApiGetRequest("/MainPageSetting/GetByType?type=highlights")
        console.log(response.mainPageSettingVMList.slice(0, 4));

        if (!response.errorMessage) {
            setData(response.mainPageSettingVMList.slice(0,4))

            console.log(response.mainPageSettingVMList.slice(0, 4));
        }
    }

    useEffect(() => {
        console.log("getHighlights");
        getHighlights()
    }, [])

    return (
        <div className={styles['showCaseCategoryMain'] + ' flex-wrap  container '}>
            {/*<div className={"d-flex"}>*/}
            {/*<div className="row p-0 m-0">*/}
{/*            {data.map((d, index) =>
                <div key={index} className={styles['item'] + ' col-md-3'}>

                    <div className={styles['showCaseCategoryCard'] + " card shadow"}>
                        <img src={d.image.src} className={styles['cardImgTop'] + " card-img-top"} alt="..."/>
                        <img src={d.logo.src} width={40} height={40} className="m-auto my-2" alt="..."/>
                        <div className="card-body ">
                            <p className="card-text text-center  fs-6">
                                {d.title}

                            </p>
                        </div>
                    </div>
                </div>
            )}*/}
            {/*<div className="d-flex flex-wrap justify-content-around m-0">*/}
                {data.map((d, index) =>
                    <div key={index} className={styles['item'] + ' col-md-2 col-12'}>
                        {/*{//console.log(d)}*/}
                        <Link href={"listingDetail?id="+d.advertisementId} className={styles['showCaseCard'] + " card shadow shadowHover"}>
                            {/*<img src={d.image.src} className={styles['cardImgTop']+" card-img-top"} alt="..."/>*/}
                            <img src={d.imageBase64? ("data:image/jpeg;base64,"+d.imageBase64):"logo_2.png"}  height={60} className="m-auto my-2 rounded" alt="..."/>
                            <div className="card-body">
                                <p className="card-text text-center">
                                    {d.advertisementTitle}

                                </p>
                            </div>
                        </Link>
                    </div>
                )}

            {/*</div>*/}

            {/*</div>*/}

        </div>
    );
}

export default ShowCaseCategoryComponent;