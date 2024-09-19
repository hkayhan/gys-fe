'use client'
import React, {useEffect, useState} from 'react';
import styles from "@/components/supporters/style.module.css";
import {ApiGetRequest} from "@/services/admin";

function Supporters(props) {

    // const { data} = props
    // if (!data||data.length<1){
    //     return
    // }
    const [data, setData]=useState([])
    const getSupporters = async () => {
        // const response = await AdminGetRequest("/MainPageSetting/GetByType?type=showcase")
        // const response = await fetch('https://esknet.asystee.com/api/MainPageSetting/GetByType?type=showcase', {cache: 'no-cache'})
        const response = await ApiGetRequest("/MainPageSetting/GetByTypeForMainPage","type=references")
        console.log(response);

        if (!response.errorMessage){
            setData(response.mainPageSettingVMList)
        }

        // const data =await response.json()

        // console.log("--------------------- type=showcase");
        // console.log(data.mainPageSettingVMList);
        // console.log("--------------------- type=showcase");
        // return data.mainPageSettingVMList?? []



    }
    useEffect(()=>{
        getSupporters()
    },[])

    if (!data||data.length<1){
        return
    }
    return (
        <div className={styles['supporterMain']+' container-xl'}>
            <h3 className={"area-header"}>Referanslarımız <i className={"area-header-line"}></i></h3>


            <div className={styles['supporterArea']+" flex-wrap"}>
                    {data.map((d,index)=>
                        <div className={''} key={index}>
                            <div className={styles['card'] + " card shadow shadowHover"}>
                                <img src={d.companyLogoBase64?"data:image/jpeg;base64,"+d.companyLogoBase64:"/images/no_image.jpg"} height={60} className="m-auto my-2" alt={d.companyName}/>

                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
}

export default Supporters;