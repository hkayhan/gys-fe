'use client'
import React, {useEffect, useState} from 'react';
import styles from './RenewPassword.module.css'
import InputText from "@/FormComponents/inputText/InputText";
import {faBuilding, faEnvelope, faLock, faPhone, faUser} from "@fortawesome/free-solid-svg-icons";
import {useRouter, useSearchParams} from "next/navigation";
import {useFormik} from "formik";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import Swal from "sweetalert2";
import Link from "next/link";
import swal from "sweetalert2";

function RenewPasswordComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mailUid = searchParams.get("uid")
    const [isFirst, setIsFirst]=useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])
    const [userId, setUserUid] = useState("")


    const getUserDataByMailUid = async () => {
        const response = await ApiGetRequest("/ForgotPassword/VerifyForgotPasswordCode", `emailCode=${mailUid}`)
        console.log(response);
        if (!response.errorMessage) {
            setUserUid(response.userUId)
            setIsLoading(true)
        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }

    }

    useEffect(() => {
        if (isFirst===0){
            getUserDataByMailUid()
            setIsFirst(1)
        }
    }, [])


    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            password: "",
            confirmPassword: '',
        },

        onSubmit: async values => {
            //console.log(typeof values);


            let errorArr = []


            if (values.password === "" || values.password.length < 6) {
                errorArr.push("password")
                // setPasswordError(true)
                // return
            }
            if (values.confirmPassword === "" || (values.confirmPassword !== values.password)) {
                errorArr.push("confirmPassword")
                // setConfirmPasswordError(true)
                // return
            }


            if (errorArr.length > 0) {
                setErrorMessage(errorArr)
                return
            }
            setIsLoading(false)
            let formDataArr = []


            const response = await ApiGetRequest("/Users/ChangePassword", `userUId=${userId}&newPassword=${values.password}&emailCode=${mailUid}`)
            if (response.errorMessage !== null) {

                await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})

            }else{
                await swal.fire({title:"Başarılı",text:"Şifreniz başarı ile güncellendi. Giriş yaparak <a>ilan.eskisehir.net</a> uygulamamızı kullanmaya devam edebilirsiniz.",icon:"success",denyButtonText:"Tamam"})
                router.push("/login")
                router.refresh()
            }
            setIsLoading(true)

        }
    })

    return (
        <div className={`${styles['']} container mainContent d-flex justify-content-center my-auto`}>

            <form autoComplete={"off"} onSubmit={handleSubmit} className="">


                <div className="col-12">

                    <InputText label={"Parola"}
                               name={"password"}
                               type={"password"}
                               icon={faLock}
                               value={values.password}
                               onChange={handleChange}
                               error={errorMessage.includes("password")
                                   && "Parola en az 6 karakter uzunluğunda olmalıdır!"}
                    />

                </div>

                <div className="col-12">
                    <InputText label={"Parola Tekrarı"}
                               name={"confirmPassword"}
                               type={"password"}
                               icon={faLock}
                               value={values.confirmPassword}
                               onChange={handleChange}
                               error={errorMessage.includes("confirmPassword")
                                   && "Parola tekrarı eşleşmiyor!"}
                    />

                </div>


                <div className="col-12">
                    <button type="submit"
                            className="btn btn-primary px-4 float-end mt-4">Gönder
                    </button>
                </div>
            </form>

        </div>

    );
}

export default RenewPasswordComp;