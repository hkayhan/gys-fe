'use client'
import React, {useEffect, useState} from 'react';
import Link from "next/link";
import styles from './style.module.css'
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressCard,
    faArrows, faChevronDown,
    faPlus,
    faRightToBracket, faUnlock, faUser,
    faUserGear,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import useAuth2 from "@/hooks/useAuth2";
import {ApiGetRequest} from "@/services/admin";
import Swal from "sweetalert2";

function TopbarLinkComp(props) {
    const {auth} = useAuth2();
    // console.log(auth);


    const [userData, setUserData] = useState([])
    const [messageCount, setMessageCount] = useState(0)

    // console.log(userData);
    const [showAdminPanel, setShowAdminPanel] = useState([])

    const cookies = new Cookies();

    const getMessageCount = async () => {
        const response = await ApiGetRequest("/Message/GetCurrentUserMessageList", "")
        if (response.errorMessage === null) {

            // console.log(response);
            // setMessages(response.messageVMList)
            // setTotalListCount(response['count'])
            const count = response.messageVMList.filter(item => item.status === 'Okunmadı').length;
            // console.log(count)
            setMessageCount(count)
        } else {
            await Swal.fire({title: "Hata", text: response.errorMessage, icon: "error", denyButtonText: "Tamam"})
        }
    }

    useEffect(() => {
        if (auth) {
            // console.log("run useeffect on topbar", auth);
            setUserData(auth)

            let isMod = auth.role === "admin" || auth.role === "moderator"

            // //console.log("ismod");
            // //console.log(isMod);
            setShowAdminPanel(isMod)
        }

        // getMessageCount()
    }, [auth]);


    return (
        <div
            className={`${styles['topBarContentMain']} d-flex justify-content-between w-100 align-items-center fw-lower`}>


            <Link href={"/"} className={`${styles['']} logo d-flex align-items-end` }>

                <Image width={50} height={50} src={'/images/logo_2.png'} alt={"Eskisehir.net"}/><h4 className={"text-underline"}>gys.com</h4>
            </Link>

            <div className={styles['userLinkGroup'] + ' '}>
                {!userData?.firstName &&
                    <><Link href={'/login'} className={styles['link']}>
                        <FontAwesomeIcon className={'me-1'} icon={faRightToBracket}/>
                        GİRİŞ YAP
                    </Link>
                        <Link href={'/register'} className={styles['link']}>
                            <FontAwesomeIcon className={'me-1'} icon={faUserPlus}/>
                            ÜYE OL</Link>
                    </>


                }
                {
                    userData?.firstName && <>
                        {showAdminPanel && <Link href={'/admin'} className={`${styles['link']} bg-warning`}>
                            <FontAwesomeIcon className={'me-1'} icon={faUserGear}/>
                            <span className={"d-none d-md-inline"}>YÖNETİM PANELİ</span> </Link>}
                        <Link href={'/advert/selectCategory'} className={styles['link'] + " d-none d-md-inline"}>
                            <FontAwesomeIcon className={'me-1'} icon={faPlus}/>
                            <span className={"d-none d-md-inline"}>İLAN YAYINLA</span></Link>

                       {/* {userType === "person" &&
                            <Link href={'/myProfile'} className={styles['link'] + " "}>
                                <FontAwesomeIcon className={'me-1'} icon={faAddressCard}/>
                                <span className={"d-none d-md-inline"}>ÖZGEÇMİŞ OLUŞTUR</span></Link>}
*/}

                        <div className={`${styles['dropdown']}  ${styles['link']}`}>
                            <span
                                // href={'/myProfile'}
                                className={`${styles['link_old']} ${styles['dropbtn']} pointer`}>
                                <FontAwesomeIcon className={'me-1 d-none d-md-inline'} icon={faChevronDown}/>
                                <FontAwesomeIcon icon={faUser} className={"d-md-none"}/>
                                    <span
                                        className={"d-none d-md-inline"}>{userData?.firstName.toUpperCase()} {userData?.lastName.toUpperCase()}</span>
                                {messageCount > 0 &&
                                    <span className={"p-2 bg-danger rounded ms-2 text-white"}>{messageCount}</span>}
                            </span>
                            <div className={`${styles['dropdown-content']} ${styles['link']} p-0`}>
                                <Link href={"/myAdverts"}>İlanlarım</Link>
                                <Link href={"/messages"}>Mesajlarım
                                    {messageCount > 0 &&
                                        <span className={"p-2 bg-danger rounded ms-2 text-white"}>{messageCount}</span>}

                                </Link>
                                <Link href={"/myApplications"}>Başvurularım</Link>
                                <Link href={"/favorites"}>Favorilerim</Link>
                                {/*{userType === "person" && <Link href="/myProfile">Profil</Link>}*/}
                                {/*{userType === "firm" && <Link href="/editCompanyProfile">Profil</Link>}*/}
                                <Link className={"border-top"} href="/logout">Çıkış</Link>
                            </div>

                        </div>
                    </>
                }

            </div>


        </div>
    );
}

export default TopbarLinkComp;
