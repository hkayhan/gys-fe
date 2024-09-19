'use client'
import React, {useEffect, useState} from 'react';
import styles from './ApproveMail.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faFaceFrownOpen,
    faHome,
    faSignIn,
    faXmark,
    faXmarkCircle
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LoadingComp from "@/components/loading/LoadingComp";
import {useSearchParams} from "next/navigation";
import {ApiGetRequest} from "@/services/admin";

function ApproveMailComp(props) {

    const searchParams = useSearchParams()
    const code = searchParams.get("uid")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")


    const checkCode = async (code) => {
        try {
            // console.log("in here 1");
            const response = await ApiGetRequest("/EmailVerification/UpdateWithVerificationCode", `verificationCode=${code}`)
            console.log(response);
            if (!response.errorMessage) {
                setIsSuccess(true)
                console.log(response)
            } else {
                setIsError(true)
                setErrorMessage(response.errorMessage)
            }


        } catch (error) {
            setIsError(true)
            console.log(error);
        }

        setIsLoading(true)
    }

    useEffect(() => {
        checkCode(code)
    }, [])


    if (!isLoading) {
        return <LoadingComp/>
    }

    return (
        <div
            className={`${styles['']} container mainContent d-flex flex-column align-items-center justify-content-center`}>

            {/*{!isLoading && <LoadingComp/>}*/}
            {
                isSuccess && <>
                    <h3><FontAwesomeIcon size={"2xl"} className={"text-success"} icon={faCircleCheck}/>
                    </h3>
                    <h3>Mail Adresiniz Doğrulandı</h3>

                    <h4>Giriş yaparak <Link className={"text-underline text-primary"} href={"/"}>ilan.eskisehir.net</Link>'i
                        kullanmaya başlayabilirisiniz </h4>

                    <Link href={"/login"} className={"btn btn-primary"}><FontAwesomeIcon className={"me-2"}
                                                                                         icon={faSignIn}/> Giriş Yap</Link>
                </>
            }

            {
                isError && <>
                    <h3><FontAwesomeIcon size={"2xl"} className={"text-danger"} icon={faXmarkCircle}/>
                    </h3>
                    <h3>Bir Hata Oluştu</h3>

                    <div dangerouslySetInnerHTML={{__html: errorMessage}}/>

                    <Link href={"/"} className={"btn btn-primary"}><FontAwesomeIcon className={"me-2"} icon={faHome}/> Ana
                        Sayfa</Link>
                </>
            }
        </div>

    );
}

export default ApproveMailComp;