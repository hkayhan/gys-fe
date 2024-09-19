'use client'
import React, {useEffect, useState} from 'react';
import styles from './Applicants.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {ApiGetRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";

function ApplicantsComp(props) {
    const searchParams = useSearchParams()
    const advertId = searchParams.get("id")
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])
    const [advertName, setAdvertName] = useState("")
    if (!advertId) {
        return (<div>Hata!!!</div>)
    }
    const getApplicants = async () => {
        const response = await ApiGetRequest("/Applicant/GetByAdvertisementId","advertisementId="+advertId)
        if (!response.errorMessage){
            setData(response.applicantVMList)
            setAdvertName(response?.applicantVMList[0]?.advertisementTitle)
        }

        setIsLoading(true)
    }

    useEffect(()=>{
        getApplicants()
    },[])

    if (!isLoading){
        return <LoadingComp/>
    }
    return (
        <div className={`${styles['']} container mainContent mt-4`}>


            <h4><span className={"text-danger text-decoration-underline"}>{advertName}</span> İsimli İlana Başvuranlar</h4>
            {/*<h6 className={"fst-italic"}>Bu alanda alanda yalnızca aktif ilanlr gözükmektedir.</h6>*/}
            <hr/>
            <br/>
            <table className=" table table-striped text-center">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Başvuran Adı</th>
                    <th scope="col">Başvuru Tarihi</th>
                    <th scope="col">Başvuran Mesajı</th>
                    <th scope="col">Kullanıcı Profili</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((d,index)=>
                        <tr>
                            <th scope="row">{index+1}</th>
                            <td>{d.applicantUserName}</td>
                            <td>{d.applyDate}</td>
                            <td>{d.message}</td>
                            <td><Link href={"/userProfile?uid="+d.applicantUserUId} className={"hoverRed"}><FontAwesomeIcon className={""}
                                                                                                    icon={faAddressCard}/> Profili
                                İncele</Link></td>
                        </tr>

                    )
                }
                </tbody>
            </table>

        </div>

    )
        ;
}

export default ApplicantsComp;