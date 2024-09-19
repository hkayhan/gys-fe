// 'use client'
import React from 'react';
import Link from 'next/link'
import styles from './styles.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faHome, faPhone, faPrint} from "@fortawesome/free-solid-svg-icons";
// import {usePathname} from "next/navigation";


function Footer(props) {
    // const pathName = usePathname()
    // if (pathName.includes("/register")||pathName.includes("/login")){
    //     return(<></>)
    //
    // }
    return (
        <section className={` ${styles['footerMain']}  `}>

            <div className={styles['footerContent'] + " container"}>
                <div className="">
                    <h6><img src="/images/logo_2.png" alt="" width={150} height={30}/></h6>
                    <hr className=""/>
                    <p>Sedef Medya Basım İletişim Organizasyon San. ve Tic. A.Ş.

                    </p>
                </div>

                <div className="">
                    <h6 className={styles['header'] + " align-content-end"}>Sosyal Medyada Biz</h6>
                    <hr className=""/>
                    <ul className="list-unstyled list-inline mt-3">
                        {/*<li className={ styles["socialMediaButtonOutline"]+ " list-inline-item border rounded-circle p-1"}>*/}
                            <Link href={"https://www.facebook.com/eskisehirnet"} target={"_blank"} title="Facebook"
                                  // className="btn-floating btn-sm bg-facebook  mx-1 "
                                  className={ styles["social-media-button-outline"]+ " btn btn-outline-primary list-inline-item border rounded-circle p-1"}
                            >
                                <FontAwesomeIcon icon="fa-brands fa-facebook-f " size={"1x"}/>
                            </Link>
                        {/*</li>*/}
                        {/*<li className={ styles["socialMediaButtonOutline"]+ " list-inline-item border rounded-circle p-1"}>*/}
                            <Link href={'https://www.twitter.com/eskisehirnet'} target={"_blank"} title="X"
                                  // className="btn-floating btn-sm  mx-1  "
                                  className={ styles["social-media-button-outline"]+ " btn btn-outline-secondary list-inline-item border rounded-circle p-1"}

                            >
                                <FontAwesomeIcon icon="fa-brands fa-x-twitter " size={"1x"}/>
                            </Link>
                        {/*</li>*/}
                        {/*<li className={ styles["socialMediaButtonOutline"]+ " list-inline-item border rounded-circle p-1"}>*/}
                            <Link href={'https://www.instagram.com/eskisehirnet'}  target={"_blank"} title="Instagram"
                                  // className="btn-floating btn-sm  mx-1 "
                                  className={ styles["social-media-button-outline"]+ " btn btn-outline-purple list-inline-item border rounded-circle p-1"}
                            >
                                <FontAwesomeIcon icon="fa-brands fa-instagram" size={"1x"}/>
                            </Link>
                        {/*</li>*/}

                        {/*<li className={ styles["socialMediaButtonOutline"]+ " list-inline-item border rounded-circle p-1"}>*/}
                            <Link href={'https://tr.linkedin.com/in/sedef-medya-b2794b227?trk=public_profile_samename-profile'}  target={"_blank"} title="LinkedIn"
                                  className="btn-floating btn-sm  mx-1 "
                                  className={ styles["social-media-button-outline"]+ " btn btn-outline-primary list-inline-item border rounded-circle p-1"}
                            >
                                <FontAwesomeIcon icon="fa-brands fa-linkedin-in" size={"1x"}/>
                            </Link>
                        {/*</li>*/}
                        {/*<li className={ styles["socialMediaButtonOutline"]+ " list-inline-item border rounded-circle p-1"}>*/}
                            <Link href={'https://www.youtube.com/@EskisehirnetSehrinSitesi'} target={"_blank"} title="Youtube"
                                  // className="btn-floating btn-sm  mx-1 "
                                  className={ styles["social-media-button-outline"]+ " btn btn-outline-danger list-inline-item border rounded-circle p-1"}
                            >
                                <FontAwesomeIcon icon="fa-brands fa-youtube" size={"1x"}/>
                            </Link>
                        {/*</li>*/}
                        {/*<li className={ styles["socialMediaButtonOutline"]+ " list-inline-item border rounded-circle p-1"}>*/}
                            <Link href={'https://api.whatsapp.com/send?phone=05384064433'} target={"_blank"} title="Whatsapp"
                                  // className="btn-floating btn-sm  mx-1 "
                                  className={ styles["social-media-button-outline"]+ " btn btn-outline-success list-inline-item border rounded-circle p-1"}
                            >
                                <FontAwesomeIcon icon="fa-brands fa-whatsapp" size={"1x"}/>
                            </Link>
                        {/*</li>*/}

                    </ul>

                </div>

            </div>
             <div className="bg-dark-purple text-white p-0">
                <div className="container">
                    <div className="row d-flex">
                        <div className="col-lg-12 col-sm-12 mt-1 mb-1 text-center ">
                            Powered by Asystee
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Footer;