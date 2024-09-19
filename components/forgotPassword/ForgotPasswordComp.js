'use client'
import React, {useEffect, useState} from 'react';
import styles from './ForgotPassword.module.css'
import {useSearchParams} from "next/navigation";
import LoadingComp from "@/components/loading/LoadingComp";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import InputText from "@/FormComponents/inputText/InputText";
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";
import Link from "next/link";

function ForgotPasswordComp(props) {
    // const searchParams = useSearchParams()
    // const mailUid = searchParams.get("uid")
    // if (!mailUid) {
    //     return (<div>Hata!!!</div>)
    // }
    const [userData, setUserData] = useState([])
    const [usernameError, setUsernameError] = useState(false)
    const [sendMailSuccess, setSendMailSuccess] = useState(false)

    const sendMail = async () => {
        console.log(userData.email);
        if (!userData.email || userData.email === "") {
            await Swal.fire({title:"Hata", text:"E-Posta Girilmelidir!",icon:"error",denyButtonText:"Tamam"})
            return
        }if (!isValidEmail(userData.email)) {
            await Swal.fire({title:"Hata", text:"Geçerli Bir E-Posta Girilmelidir!",icon:"error",denyButtonText:"Tamam"})
            return
        }
        const response = await ApiPostRequest("/ForgotPassword/SendForgotPasswordEmail", `email=${userData.email}`)
        if (!response.errorMessage) {
            setSendMailSuccess(true)
        }
    }
    const isValidEmail=(email)=> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    const handleChange = (e) => {
        const {name, value} = e.target;
        //console.log("name, value");
        //console.log(name, value);

        setUserData(prevData => ({
            ...prevData, [name]: value
        }));
    };


    return (
        <div className={`${styles['']} container mainContent d-flex flex-column justify-content-center`}>


            <div className=" login-page rounded mb-5">
                <div className="container h-100 ">
                    <div className="d-flex justify-content-center align-items-center  my-auto">
                        <div className="col-lg-12 col-sm-6">
                            <div className={"d-flex justify-content-center align-items-center py-3"}>
                                <img src="/images/logo.svg" alt="" width={200}/>
                            </div>
                            <div className="bg-white shadow rounded">

                                <div className="d-flex">
                                    <div className="col-md-6 pe-0">
                                        {!sendMailSuccess?
                                        <div className="form-left h-100 py-3 px-5">
                                            <h4>Şifremi Unuttum</h4>
                                            <InputText label={"E-Posta Giriniz"}
                                                       name={"email"}
                                                       icon={faEnvelope}
                                                       value={userData.email}
                                                       onChange={handleChange}
                                                       error={usernameError && "E-Posta Adresi Girilmelidir!"}

                                            />

                                            <button onClick={() => sendMail()}
                                                    className={"btn btn-secondary mt-3"}>Gönder
                                            </button>
                                        </div>:
                                            <div className={"form-left h-100 py-3 px-5"}>  <h5>
                                                E-Posta Gönderildi
                                            </h5>

                                                <p>
                                                    Belirttiğiniz E-Posta adresine şifrenizi yenileme linki gönderildi.
                                                    <br/>
                                                    Linke tıklayarak şifrenizi yenileyebilirsiniz.
                                                    <br/>
                                                    <br/>
                                                    E-posta "Gelen Kutusu" alanında yoksa "Spam Mail" alanını kontrol ediniz.
                                                </p></div>}
                                    </div>
                                    <div
                                        className={`${styles['login-image']} rounded-end col-md-6 ps-0 d-none d-md-block  `}>
                                        {/*<img src="/images/signin-image.jpg"  alt=""/>*/}
                                        {/*<div className="form-right h-100 bg-primary text-white text-center pt-5">*/}
                                        {/*    <i className="bi bi-bootstrap"></i>*/}
                                        {/*    <h2 className="fs-1">Welcome Back!!!</h2>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>

    );
}

export default ForgotPasswordComp;