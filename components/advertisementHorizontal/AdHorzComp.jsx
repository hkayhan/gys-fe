'use client'
import React, {useEffect, useState} from 'react';
import styles from './style.module.css'
import {ApiGetRequest} from "@/services/admin";
import AdComponent from "@/components/adComponent/AdComponentComp";

function LatestAds({location}) {
    if (!location||location===""){
        return
    }
    const [isShow, setIsShow] = useState(false)
    const [scriptContent, setScriptContent] = useState()
    const [adType, setAdType] = useState("adm")

    const getByLocation = async () => {
        const result = await ApiGetRequest("/Commercial/GetByLocation", "location=" + location)
        if (!result.errorMessage) {
            console.log(result.commercialVMList[0]?.content);
            // setIsShow(true)
            setScriptContent(result.commercialVMList[0]?.content)
        }
    }


    useEffect(() => {
        getByLocation()
    }, [])

    return (

        <div>
            {/*<h1>Dynamic Ad Script</h1>*/}
            {scriptContent && adType &&  <AdComponent adScript={scriptContent} adType={adType}/>}


        </div>

    );
}

export default LatestAds;