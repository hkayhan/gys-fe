'use client'
import styles from './styles.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faPhone,
    faUser,
    faAnglesRight,
    faBuilding,
    faHourglassHalf, faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, {useState} from "react";
import axios from 'axios'
import {faAngellist} from "@fortawesome/free-brands-svg-icons";
import {useFormik} from "formik";
import {ApiPostRequest} from "@/services/admin";
import {useRouter, useSearchParams} from "next/navigation";
import Swal from "sweetalert2";
import InputText from "@/FormComponents/inputText/InputText";

function RegisterComponent(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const registerType = searchParams.get("type") ? searchParams.get("type") : "person"

    const [registerStatus, setRegisterStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [approveMail, setApproveMail] = useState(false)


    /*
    const [companyError, setCompanyError] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    // const [errors, setErrors]=useState([])


    const [formData, setFormData] = useState({
        name: '',
        surName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
*/
    /*

        const handleChangeOld = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });


            // //console.log(e);
        }

        const handleSubmitOld = async (e) => {
            e.preventDefault();
            if (formData.name === "" || formData.surName === "" || formData.phoneNumber === "" || formData.email === "" || formData.password === "" || formData.confirmPassword === "") {
                setCheckInputs(true)

            }
            try {
                // let url = proces.env.NEXT_PUBLIC_BACKEND_URL;

                // let url = "http://135.181.73.248:5000/api"+ "/Users/Add?identityNumber=1234567801&firstName="+formData.name +"&lastName="+ formData.surName+"&email="+ formData.email+"&phone="+formData.phoneNumber+"&password="+formData.password
                let url = "https://esknet.asystee.com/api" + "/Users/Add?identityNumber=1234567801&firstName=" + formData.name + "&lastName=" + formData.surName + "&email=" + formData.email + "&phone=" + formData.phoneNumber + "&password=" + formData.password

                //console.log("...")
                const response = await axios.post(url);
                if (response?.data?.status) {
                    setRegisterStatus(true)
                } else {
                    setErrorMessage(response?.data?.errorMessage)
                }
                //console.log('Registration successful:', response.data);
            } catch (error) {
                console.error('Registration failed:', error);
            }
        };

    */

    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            companyName: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: '',
        },

        onSubmit: async values => {
            //console.log(typeof values);


            let errorArr = []



            if (values.firstName === "" && registerType === "person") {
                errorArr.push("firstName")
                // setFirstNameError(true)
                // return
            }
            if (values.lastName === "" && registerType === "person") {
                errorArr.push("lastName")
                // setLastNameError(true)
                // return
            }


            if (values.email === "") {
                errorArr.push("email")
                // setEmailError(true)
                // return
            }
            if (values.phone === "") {
                errorArr.push("phone")
                // setEmailError(true)
                // return
            }

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

            //console.log("in here 1")

            if (errorArr.length > 0) {
                console.log(errorArr);
                setErrorMessage(errorArr)
                return
            }
            //console.log("in here 2")

            //console.log(values)
            setIsLoading(false)
            let formDataArr = []

            formDataArr.push({
                name: "firstName", value: values.firstName
            })
            formDataArr.push({
                name: "lastName", value: values.lastName
            })
            formDataArr.push({
                name: "password", value: values.password
            })

            formDataArr.push({
                name: "email", value: values.email
            })
            formDataArr.push({
                name: "phone", value: values.phone
            })



            //console.log("in here 3  ", formDataArr);


            const response = await ApiPostRequest("/register", "", formDataArr)
            console.log(response);
            if (response.errorMessage) {
                if (response.errorMessage === "Yinelenen kayıt - Aynı eposta daha önce kullanılmış") {
                    await Swal.fire({
                        icon: "error",
                        title: "Hata",
                        text: "Bu E-Posta Adresi İle Daha Önce Kayıt Yapılmış!",
                        denyButtonText: "Tamam"
                        // footer: '<a href="#">Why do I have this issue?</a>'
                    });
                } else if (response.errorMessage === "Yinelenen kayıt - Aynı telefon numarası daha önce kullanılmış") {
                    await Swal.fire({
                        icon: "error",
                        title: "Hata",
                        text: "Bu Telefon Numarası İle Daha Önce Kayıt Yapılmış!",
                        denyButtonText: "Tamam"

                        // footer: '<a href="#">Why do I have this issue?</a>'
                    });
                } else {
                    await Swal.fire({
                        title: "Hata",
                        text: response.errorMessage,
                        icon: "error",
                        denyButtonText: "Tamam"
                    })
                }
            } else if (response.user !== null) {
                setApproveMail(true)
            }
            setIsLoading(true)

            /*            if (response.jwtToken !== null) {
                            // document.cookie = `token=${response.jwtToken}; path=/;`;
                            // const nextUrl = searchParams.get("next");
                            // //console.log("next url :", nextUrl);
                            // router.push(nextUrl ?? "/");
                            // router.refresh();
                        } else {
                            alert(response.errorMessage)
                        }*/

        }
    })


    if (approveMail) {
        return (
            <div className={`${styles['']}  mainContent  d-flex align-items-center justify-content-center`}>
                <div className="login-page rounded mb-5 text-center  p-4  ">
                    <h3></h3>
                    <h3>Kaydınızı Tamalamak İçin Sadece 1 Adım Kaldı</h3>
                    <br/>
                    <h4 className={"hoverRed"}><FontAwesomeIcon size={""} className={""} icon={faEnvelope}/> E-Posta
                        adresinize gelen linke tıklayarak kaydınızı tamamlayabilirsiniz.
                    </h4>
                </div>
            </div>
        )
    }
    return (
        <div className={`${styles['']}  mainContent  d-flex align-items-center justify-content-center`}>

            <div className="login-page rounded mb-5">
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-center">
                        <div className="col-lg-10 offset-lg-1 mt-2">
                            {/*<div className={"d-flex justify-content-center align-items-center py-3"}>*/}
                            {/*    <img src="/images/logo.svg" alt="" width={200}/>*/}
                            {/*</div>*/}
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div
                                        className={`${styles['login-image']} rounded-start col-md-5 ps-0 d-none d-md-block  `}>
                                        {/*<img src="/images/signin-image.jpg"  alt=""/>*/}
                                        {/*<div className="form-right h-100 bg-primary text-white text-center pt-5">*/}
                                        {/*    <i className="bi bi-bootstrap"></i>*/}
                                        {/*    <h2 className="fs-1">Welcome Back!!!</h2>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="col-md-7 pe-0 px-5 pt-2 text-center">
                                        <h3 className="mt-2">Kayıt Ol</h3>
                                        <h6 className={"text-primary"}>

                                        </h6>
                                        <div className="form-left h-100 pb-2 px-5">
                                            <form autoComplete={"off"} onSubmit={handleSubmit} className="row g-4">

                                                {/*ad soyad*/}


                                                <>
                                                    <div className="col-12">
                                                        <InputText label={"Ad"}
                                                                   icon={faUser}
                                                                   name={"firstName"}
                                                                   value={values.firstName}
                                                                   onChange={handleChange}
                                                                   error={errorMessage.includes("firstName")
                                                                       && "Ad boş bırakılamaz!"}
                                                        />
                                                    </div>
                                                    {/*soyad*/}
                                                    <div className="col-12">
                                                        <InputText label={"Soyad"}
                                                                   name={"lastName"}
                                                                   icon={faUser}
                                                                   value={values.lastName}
                                                                   onChange={handleChange}
                                                                   error={errorMessage.includes("lastName")
                                                                       && "Ad boş bırakılamaz!"}
                                                        />
                                                    </div>
                                                </>


                                                <div className="col-12">

                                                    <InputText label={"E Posta"}
                                                               name={"email"}
                                                               icon={faEnvelope}
                                                               value={values.email}
                                                               onChange={handleChange}
                                                               error={errorMessage.includes("email")
                                                                   && "E-Posta adresi boş bırakılamaz!"}
                                                    />


                                                </div>
                                                {/*telefon*/}
                                                <div className="col-12">

                                                    <InputText label={"Telefon"}
                                                               name={"phone"}
                                                               type={"number"}
                                                               icon={faPhone}
                                                               value={values.phone}
                                                               onChange={handleChange}
                                                               error={errorMessage.includes("phone")
                                                                   && "Telefon boş bırakılamaz!"}
                                                    />

                                                </div>

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
                                                    <InputText label={"Parola"}
                                                               name={"confirmPassword"}
                                                               type={"password"}
                                                               icon={faLock}
                                                               value={values.confirmPassword}
                                                               onChange={handleChange}
                                                               error={errorMessage.includes("confirmPassword")
                                                                   && "Parola tekrarı eşleşmiyor!"}
                                                    />

                                                </div>

                                                <div className="col-sm-6 text-center text-md-start">
                                                    <Link href="/forgotPassword" className=" text-primary">Şifremi
                                                        Unuttum?</Link>
                                                </div>
                                                <div className="col-sm-6 text-center text-md-end">
                                                    <Link href="/login" className="text-end text-primary">Zaten Hesabın
                                                        Var
                                                        Mı?</Link></div>


                                                <div className="col-12">
                                                    <button type="submit"
                                                            className="btn btn-primary px-4 float-end mt-4">Kayıt Ol
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*
            <div className={styles['wrapper']}>
                <div className={styles['inner']}>
                    <img src="images/register/image-1.png" alt="" className={styles['image-1']}/>

                    {!registerStatus&&<form onSubmit={handleSubmit}>
                        <h3 >Kayıt Ol</h3>
                        {errorMessage!==""&&
                        <>
                        <h5 className={"text-danger"}>{errorMessage}</h5>
                        </>
                        }
                        <div className={styles['form-holder']}>
                            <span className={styles['lnr lnr-user']}>
                                <FontAwesomeIcon icon={faUser}/>
                            </span>
                            <inputText required type="text" className={styles['form-control']} placeholder="Ad" name="name" value={formData.name} onChange={handleChange}

                            />
                        </div>
                        <div className={styles['form-holder']}>
                            <span className={styles['lnr lnr-user']}><FontAwesomeIcon icon={faUser}/></span>
                            <inputText required type="text" className={styles['form-control']} placeholder="Soyad" name="surName" value={formData.surName} onChange={handleChange}/>
                        </div>
                        <div className={styles['form-holder']}>
                            <span className={styles["lnr lnr-phone-handset"]}>
                                <FontAwesomeIcon icon={faPhone}/>
                            </span>
                            <inputText type="tel" className={styles["form-control"]}  name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                                   required placeholder="Telefon Numarası"/>

                        </div>
                        <div className={styles["form-holder"]}>
                            <span className={styles["lnr lnr-envelope"]}><FontAwesomeIcon icon={faEnvelope}/></span>
                            <inputText autoComplete={"off"} required type="text" className={styles["form-control"] } placeholder="E-Posta" name="email"
                                   value={formData.email} onChange={handleChange}/>
                        </div>
                        <div className={styles["form-holder"]}>
                            <span className={styles["lnr lnr-lock"]}><FontAwesomeIcon icon={faLock}/></span>
                            <inputText required type="password" className={styles["form-control"]}
                                   placeholder="Parola" autoComplete={"false"} name="password" value={formData.password} onChange={handleChange}/>
                        </div>
                        <div className={styles["form-holder"]}>
                            <span className={styles["lnr lnr-lock"]}><FontAwesomeIcon icon={faLock}/></span>
                            <inputText required type="password" className={styles["form-control"]}
                                   placeholder="Parola Tekrarı" autoComplete={"false"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}/>
                            {
                                formData.confirmPassword!=="" && (formData.confirmPassword!==formData.password)&&
                                <div className={"text-danger fst-italic"}>* Parola doğrulama eşleşmeli!</div> }
                        </div>
                        {
                            checkInputs&&
                            <>
                            <h5 className={"text-center text-danger"}>Tüm alanlar doldurulmalı!</h5>

                            </>
                        }
                        <button className={`${styles['button']} `}>
                            <span>Kayıt Ol</span>
                        </button>
                        <div className={"text-center mt-3"}>
                            <Link href={"/login"} className={"text-decoration-underline"}>
                                Zaten Hesabın Var Mı?
                            </Link>
                        </div>
                    </form>}

                    {registerStatus&&<div style={{zIndex:100}}>
                        <h4 >Teşekkürler</h4>
                        <p>Kayıt işleminizin tamamlanabilmesi için son bir adımınız kaldı.</p>
                        <p>E-posta adresinize gönderdiğimiz onay linkine tıkladıktan sonra kadınız tamamlanacaktır. </p>


                        <Link href={"/"} className={"btn btn-success"}><FontAwesomeIcon icon={faAnglesRight}/> Devam Et</Link>
                    </div>}

                    <img src="images/register/image-2.png" alt="" className={styles["image-2"]}></img>
                </div>

            </div>
*/}
        </div>


    );
}

export default RegisterComponent;