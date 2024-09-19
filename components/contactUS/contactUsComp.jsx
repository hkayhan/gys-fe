'use client'
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useAuth2 from "@/hooks/useAuth2";
import {ApiPostRequestWithModel} from "@/services/admin";
import swal from "sweetalert2";

function ContactUsComp(props) {
    const {auth} = useAuth2();

    const [showInput, setShowInput] = useState(false)
    const [userData, setUserData] = useState([])
    const [message, setMessage] = useState("")
    const closeMessageArea = () => {
        setShowInput(false)

    }

    useEffect(() => {
        if (auth && auth.jwt) {
            // //console.log("run useeffect on topbar", auth?.roleList);
            setUserData(auth?.jwt)


        }


    }, [auth]);
    const handleChange = (e) => {
        console.log(e.target.name);
        setMessage({
            ...message, [e.target.name]: e.target.value,
        });

    }

    const sendMessage = async () => {
        if (!message.user_message) {
            return
        }

        const response = await ApiPostRequestWithModel("/Email/SendMainPageMessage", "", {
            subject: "Anasayfa Kullancı Mesajı",
            body: message.user_message
        })

        if (!response.errorMessage) {
            //await swal.fire({icon: "success", text: "Mesajınız Başarıyla Gönderildi", confirmButtonText: "Tamam"})
          await swal.fire({
                position: "top-end",
                icon: "success",
                title: "Mesajınız Başarıyla Gönderildi",
                showConfirmButton: false,
                timer: 1000
            });
        }

    }

    return (
        <div className={styles['contactUsMain'] + " container-xl"}>
            <div className="d-flex flex-wrap bg-white border text-center text-md-start   shadow shadowHoverp-2 rounded align-items-center">
                <div className={"flex-fill p-3 m-auto col-12 col-md-6"}>
                    <h4>Lütfen Bize Ulaşın!</h4>
                    <div>
                        Öneri, şikayet vb konularda görüşlerinizi önemsiyoruz.
                    </div>
                    <div>Görüşlerinizi bize bildirmek isterseniz e-posta ile iletişime geçebilirsiniz.</div>
                </div>
                <div className={" d-flex justify-content-end flex-column col-12 col-md-6"}>
                    <div className={`${styles['address']} d-flex flex-column`}>
                        <address className={"fw-bold "}>
                            <a href="mailto:bilgi@sedefmedya.com"> <FontAwesomeIcon className={"me-2"}
                                                                                    icon={faEnvelope}/>bilgi@sedefmedya.com</a>
                        </address>

                        <div className={`${styles['']} fw-bold pointer`}>

                            {userData?.firstName && !showInput &&
                                <span onClick={() => setShowInput(true)}>Mesajınızı Bırakın</span>}
                            {userData?.firstName && showInput && <div className={"w-100 fw-normal"}>
                                <div className={""}>

                                    {/*<label htmlFor="w3review">Mesajınızı Yazabilirsiniz</label>*/}
                                    <textarea id="user_message"
                                              name="user_message"
                                              rows="4" cols="50"
                                              value={message.user_message}
                                              onChange={handleChange}

                                    ></textarea>
                                    <br/>
                                    <div className={"d-flex justify-content-end"}>
                                        <button onClick={() => closeMessageArea()}
                                                className={"btn btn-block btn-outline-danger"} type="submit"
                                        >İptal
                                        </button>
                                        <button onClick={() => {
                                            closeMessageArea()
                                            sendMessage()
                                        }}
                                                className={"ms-3 btn btn-block btn-success"} type="submit"
                                        >Gönder
                                        </button>
                                    </div>

                                </div>
                            </div>}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ContactUsComp;