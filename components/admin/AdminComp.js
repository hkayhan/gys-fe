'use client'
import React, {useEffect, useState} from 'react';
import styles from './Admin.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendarDay, faCalendarXmark,
    faCartPlus,
    faMoneyBill1Wave, faUsers,
    faXmarkCircle,
    faXmarksLines
} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import CountAnimationComp from "@/components/CountAnimation/CountAnimationComp";

function AdminComp(props) {
    const [isLoading, setIsLoading]=useState(true)
    const [dashboardData, setDashboardData]=useState([])


    const getDashboardData =async () => {
        const response = await ApiGetRequest("/Reports/GetMainPageSummaryReport")
        setDashboardData(response)
        setIsLoading(true)
        //console.log(response);
    }

    useEffect(()=>{
        // getDashboardData()
    },[])


    if (!isLoading){
        return (
            <LoadingComp/>
        )
    }

    return (
        <div className={`${styles['']} container mt-3 mb-3 rounded  mainContent shadow`}>
            <div className="row p-3">
                <h5>Datalar Hazırlanıyor</h5>
                {/*Onay Bekleyenler*/}
                <div className="col-md-6 col-xl-3">
                    <div className={`${styles['bg-c-yellow']} ${styles['order-card']} ${styles['card']}  shadowHover `}>
                        <div className={`${styles['card-block']} d-flex flex-column justify-content-evenly`}>
                            <h4 className="mb-md-5 mb-4">Onay Bekleyen Soru</h4>
                            <h2 className="mb-0 d-flex justify-content-between">

                                <FontAwesomeIcon icon={faCartPlus}/>
                               {/*<span>{dashboardData['waitingForApproveAdvertisementCount']}</span>*/}
                               <span><CountAnimationComp n={dashboardData['waitingForApproveAdvertisementCount']}/> </span>

                            </h2>
                        </div>
                    </div>
                </div>
                {/*Ödeme Bekleyenler*/}
                <div className="col-md-6 col-xl-3">
                    <div className={`${styles['bg-c-yellow2']} ${styles['order-card']} ${styles['card']}  shadowHover `}>
                        <div className={`${styles['card-block']} `}>
                            <h4 className="mb-4">Toplam Soru</h4>
                            <h2 className="d-flex justify-content-between">

                                <FontAwesomeIcon icon={faMoneyBill1Wave}/>
                                {/*<span>{dashboardData['waitingForPaymentAdvertisementCount']}</span>*/}
                                <span><CountAnimationComp n={dashboardData['waitingForPaymentAdvertisementCount']}/> </span>

                            </h2>
                        </div>
                    </div>
                </div>
                {/*Bugün Yayınlanan*/}
                <div className="col-md-6 col-xl-3">
                    <div className={`${styles['bg-c-green']} ${styles['order-card']} ${styles['card']}  shadowHover `}>
                        <div className={`${styles['card-block']} `}>
                            <h4 className="mb-4">Bugün Hazırlanan Soru</h4>
                            <h2 className="d-flex justify-content-between">

                                <FontAwesomeIcon icon={faCalendarDay}/>
                                {/*<span>{dashboardData['last24HourAdvertisementCount']}</span>*/}
                                <span><CountAnimationComp n={dashboardData['last24HourAdvertisementCount']}/> </span>

                            </h2>
                        </div>
                    </div>
                </div>
                {/*Reddedilen İlanlar*/}
                <div className="col-md-6 col-xl-3">
                    <div className={`${styles['bg-c-pink']} ${styles['order-card']} ${styles['card']}  shadowHover `}>
                        <div className={`${styles['card-block']} `}>
                            <h4 className="mb-md-5 mb-4">Aktif Konu</h4>
                            <h2 className="d-flex justify-content-between">

                                <FontAwesomeIcon icon={faCalendarXmark}/>
                                {/*<span>{dashboardData['cancelledAdvertisementCount']}</span>*/}
                                <span><CountAnimationComp n={dashboardData['cancelledAdvertisementCount']}/> </span>

                            </h2>
                        </div>
                    </div>
                </div>
                {/*Aktif İlanlar(Tüm Süreç)*/}
                <div className="col-md-6 col-xl-3">
                    <div className={`${styles['bg-c-green2']} ${styles['order-card']} ${styles['card']}  shadowHover `}>
                        <div className={`${styles['card-block']} `}>
                            <h4 className={"m-0"}>Aktif Soru</h4>
                            <div className="mb-4">Tüm Süreç</div>
                            <h2 className="d-flex justify-content-between">

                                <FontAwesomeIcon icon={faCartPlus}/>
                                {/*<span>{dashboardData['activeAdvertisementCount']}</span>*/}
                                <span><CountAnimationComp n={dashboardData['activeAdvertisementCount']}/> </span>

                            </h2>
                        </div>
                    </div>
                </div>
                {/*Aktif Kullanıcı(Tüm Süreç)*/}
                <div className="col-md-6 col-xl-3">
                    <div className={`${styles['bg-c-blue']} ${styles['order-card']} ${styles['card']}  shadowHover `}>
                        <div className={`${styles['card-block']} `}>
                            <h4 className={"m-0"}>Aktif Kullanıcı</h4>
                            <div className="mb-4">Tüm Süreç</div>
                            <h2 className="d-flex justify-content-between">

                                <FontAwesomeIcon icon={faUsers}/>
                                {/*<span>{dashboardData['activeUserCount']}</span>*/}
                                <span><CountAnimationComp n={dashboardData['activeUserCount']}/> </span>

                            </h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default AdminComp;