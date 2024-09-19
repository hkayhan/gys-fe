'use client'
import styles from './styles.module.css'
import {faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";
import {useFormik} from "formik"
import {ApiPostRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import InputText from "@/FormComponents/inputText/InputText";
import Link from "next/link";

function LoginComponent(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const {handleSubmit, handleChange, values} = useFormik({
        initialValues: {
            username: "",
            password: ""
        },

        onSubmit: async values => {

            if (values.username === "") {
                setUsernameError(true)
                return
            }

            if (values.password === "") {
                setPasswordError(true)
                return
            }

            //console.log(values)
            setIsLoading(false)
            let formDataArr = []
            formDataArr.push({
                name: "email", value: values.username
            })

            formDataArr.push({
                name: "password", value: values.password
            })

            const response = await ApiPostRequest("/login", "", formDataArr)
            //console.log( response);

            if (response.token) {
                document.cookie = `token=${response.token}; path=/;maxAge: 10800`;
                const nextUrl = searchParams.get("next");
                //console.log("next url :",nextUrl);
                router.push(nextUrl ?? "/");
                router.refresh();
            } else {
                alert(response.errorMessage)
                setIsLoading(true)

            }

        }
    })


    /*    // const searchParams = useSearchParams()
        const [formDataInputs, setFormDataInputs] = useState({
            email: '',
            password: '',
        });

        const [errorMessage, setErrorMessage] = useState("")


        const handleChangeOld = (e) => {
            setFormDataInputs({
                ...formDataInputs,
                [e.target.name]: e.target.value,
            });
            setErrorMessage("")

            //console.log(e.target.value);
        }

        const handleSubmitOld = async (event) => {
            event.preventDefault();

            const formData = new FormData(event.target);
            // const tc = formData.get("userName");
            // const password = formData.get("password");
            try {
                // const formDataRequest = new FormData();
                formData.append('UserLogin', formDataInputs.email);
                formData.append('Password', formDataInputs.password);
                let url = `https://esknet.asystee.com/api/Users/Login`
                // const response = await fetch('https://lmslogin.anadolu.edu.tr/alternative-login', {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });
                let result = await response.json()
                if (response.ok) {
                    //console.log(result);
                    if (result?.message) {
                        setErrorMessage(result.message)
                        // alert(result.message)
                    } else {
                        //console.log('İstek başarılı!');
                        // const responseData = await response.json();
                        const {jwtToken} = result;

                        // Token'i cookie'ye yazmak için document.cookie kullanabilirsiniz.
                        document.cookie = `token=${jwtToken}; path=/;`;
                        // const nextUrl = searchParams.get("next");
                        // @see: https://github.com/vercel/next.js/discussions/44149
                        // router.push(nextUrl ?? "/");
                        router.push("/");
                        router.refresh();
                    }


                } else {
                    console.error('İstek başarısız!', response);


                }
            } catch (error) {
                console.error('Bir hata oluştu:', error);
            }

        };*/

    if (!isLoading) {
        return (<LoadingComp/>)
    }

    return (<div className={`${styles['mainContent']} mainContent d-flex align-items-center justify-content-center`}>

            {/*
            <div className={styles['wrapper']}>
                <div className={styles['inner']}>
                    <img src="images/register/image-1.png" alt="" className={styles['image-1']}/>
                    <form onSubmit={handleSubmit}>
                        <h3>Giriş Yap</h3>
                        {errorMessage !== "" && <>
                            <h5 className={"text-center text-danger"}>
                                {errorMessage}
                            </h5></>}
                        <div className={styles['form-holder']}>
                            <span className={styles["lnr lnr-phone-handset"]}><FontAwesomeIcon icon={faPhone}/></span>
                            <inputText type="text" name={"email"} className={styles["form-control"]}
                                   placeholder="E-Posta veyam Telefon Numarası" onChange={handleChange}/>
                        </div>

                        <div className={styles["form-holder"]}>
                            <span className={styles["lnr lnr-lock"]}><FontAwesomeIcon icon={faLock}/></span>
                            <inputText type="password" name={"password"} className={styles["form-control"]}
                                   placeholder="Parola" onChange={handleChange}/>
                        </div>

                        <button onSubmit={handleSubmit}>
                            <span>Giriş Yap</span>
                        </button>

                        <div className={"text-center mt-3"}>
                            <Link href={""} className={"text-decoration-underline"}>
                                Hesap Oluştur
                            </Link>
                        </div>

                    </form>
                    <img src="images/register/image-2.png" alt="" className={styles["image-2"]}></img>
                </div>

            </div>
*/}

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
                                        <div className={"d-flex justify-content-center"}>
                                            <h3 className="mb-3 mt-3 ">Giriş Yap</h3>

                                        </div>
                                        <div className="form-left h-100 py-3 px-5">
                                            <form onSubmit={handleSubmit} className="row g-4">
                                                <div className="col-12">
                                                    <InputText label={"E-Posta Giriniz"}
                                                               name={"username"}
                                                               icon={faEnvelope}
                                                               value={values.username}
                                                               onChange={handleChange}
                                                               error={usernameError && "E-Posta Adresi Girilmelidir!"}

                                                    />
                                                    {/*<label htmlFor={"username"}>E-Posta<span className="text-danger">*</span></label>
                                                    <div className="input-group border-danger">
                                                        <div className={"inputText-group-text "+(usernameError&&"border-danger")}>
                                                            <FontAwesomeIcon icon={faEnvelope}/>
                                                        </div>
                                                        <input type="text"
                                                               id={"username"}
                                                               className={"form-control "+(usernameError&&"border-danger")}
                                                               placeholder="E-Posta Giriniz"
                                                               value={values.username}
                                                               onChange={handleChange}
                                                               name={"username"}


                                                        />
                                                    </div>
                                                    {usernameError&&<div className={"text-danger"}> E-Posta Adresi Girilmelidir</div>}*/}
                                                </div>

                                                <div className="col-12">

                                                    <InputText label={"Parola"}
                                                               name={"password"}
                                                               icon={faLock}
                                                               type={"password"}
                                                               value={values.password}
                                                               onChange={handleChange}

                                                    />
                                                    {/* <label htmlFor={"password"}>Parola<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <div className={"inputText-group-text "+(passwordError&&"border-danger")}>
                                                            <FontAwesomeIcon icon={faLock}/>
                                                        </div>
                                                        <input type="password"
                                                               id={"password"}
                                                               className={"form-control "+(usernameError&&"border-danger")}
                                                               placeholder="Parola Giriniz"
                                                               value={values.password}
                                                               onChange={handleChange}
                                                               name={"password"}
                                                        />
                                                    </div>*/}
                                                </div>

                                                <div className="col-sm-6 text-center text-md-start">
                                                    <Link href="/forgotPassword" className=" text-primary">Şifremi
                                                        Unuttum?</Link>
                                                </div>
                                                <div className="col-sm-6 text-center text-md-end">
                                                    <Link href="/register" className="text-end text-primary">Hesap
                                                        Oluştur</Link></div>


                                                <div className="col-12">
                                                    <button type="submit"
                                                            className="btn btn-primary px-4 float-end mt-4">Giriş
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
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


            {/*
            <section className="h-100">
                <div className="container h-100">
                    <div className="row justify-content-sm-center h-100">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                            <div className="text-center my-5">
                                <img src="/images/logo.svg" alt="logo"
                                    // width="100"
                                />
                            </div>
                            <div className="card shadow-lg">
                                <div className="card-body p-5">
                                    <h1 className="fs-4 card-title fw-bold mb-4">Giriş</h1>
                                    <form method="POST" className="needs-validation" noValidate="" autoComplete="off">
                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="email">E-Posta Adresi</label>
                                            <inputText id="email" type="email" className="form-control" name="email"
                                                   value=""
                                                   required autoFocus/>
                                            <div className="invalid-feedback">
                                                Email is invalid
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="mb-2 w-100">
                                                <label className="text-muted" htmlFor="password">Parola</label>
                                                <Link href={"forgot"} className="float-end">
                                                    Şifremi Unuttum
                                                </Link>
                                            </div>
                                            <inputText id="password" type="password" className="form-control"
                                                   name="password"
                                                   required/>
                                            <div className="invalid-feedback">
                                                Parolla girilmelidir
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <div className="form-check">
                                                <inputText type="checkbox" name="remember" id="remember"
                                                       className="form-check-inputText"/>
                                                <label htmlFor="remember" className="form-check-label">Remember
                                                    Me</label>
                                            </div>
                                            <button type="submit" className="btn btn-primary ms-auto">
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer py-3 border-0">
                                    <div className="text-center">
                                        Hesabınız Yok Mu? <Link href={"register"}
                                                                className="text-primary text-underline">Üye Ol</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-5 text-muted">
                                Copyright &copy; 2024 &mdash; Sedef Medya
                            </div>
                        </div>
                    </div>
                </div>
            </section>
*/}

        </div>


    );
}

export default LoginComponent;