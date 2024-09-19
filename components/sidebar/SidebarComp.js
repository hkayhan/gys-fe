'use client'
import React, {useState} from 'react';
import styles from './Sidebar.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleLeft, faAngleRight,
    faBackwardFast, faBarsProgress, faBoxesPacking, faComments,
    faGear, faGears, faGlobe,
    faHouse, faLayerGroup,
    faMoneyBill,
    faMoneyBill1Wave, faQuestion, faTags,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import {faPaypal} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import {usePathname} from "next/navigation";

function SidebarComp(props) {
    const url = usePathname();

    const [sidebarShow, setSidebarShow]=useState(true)

    const toggleSidebar = () => {
      setSidebarShow(!sidebarShow)
    }

    // Özellikleri almak için router objesini kullanın
    // //console.log(url);
    //
    const menu = [
        {
            "name": "Admin Panel",
            "link": "/admin",
            "icon": faHouse
        }, {
            "name": "Konular",
            "link": "/admin/topics",
            "icon": faTags
        } ,{
            "name": "Sorular",
            "link": "/admin/questions",
            "icon": faQuestion
        },{
            "name": "Kullanıcılar",
            "link": "/admin/users",
            "icon": faUsers
        },/* {
            "name": "Onay Bekleyenler",
            "link": "/admin/awaitingApprovalList",
            "icon": faClock
        }, {
            "name": "Ödemeler",
            "link": "/admin/paymentsManage",
            "icon": faMoneyBill
        }, {
            "name": "Ayarlar",
            "link": "/admin/settings",
            "icon": faGears
        }, {
            "name": "Ücretler",
            "link": "/admin/advertPrices",
            "icon": faTags
        }, {
            "name": "Paketler",
            "link": "/admin/packets",
            "icon": faBoxesPacking
        }, {
            "name": "Reklam Yönetimi",
            "link": "/admin/adsense/adsenseList",
            "icon": faBarsProgress
        },{
            "name": "Yorumlar",
            "link": "/admin/commentsManage",
            "icon": faComments
        },{
            "name": "Kategoriler",
            "link": "/admin/categoriesManage",
            "icon": faLayerGroup
        },*/
    ]

    return (
        <div className={`${styles['sidebarMain']} d-flex flex-column justify-content-center p-2 `}>
            <div className={`${styles['sidebarLinkContainer']} border rounded shadow p-2 ${!sidebarShow&&styles['sidebarLinkContainerClosed']}`}>

             <div className={`${styles['toggleButton']} p-2  border`} onClick={()=>toggleSidebar()}>

                 <FontAwesomeIcon icon={sidebarShow? faAngleLeft:faAngleRight}/>
             </div>
                {menu.map((m, index) =>

                                <Link href={m.link} key={index} className={`${styles['sidebarMenuLink']} d-block ${styles[url === m.link ? 'sidebarMenuLinkActive':'']} p-2`}>
                                    <div>
                                        <span className={`text-center`}> <FontAwesomeIcon className={"m-0"} icon={m.icon}/></span>
                                       {sidebarShow &&<span className={`${styles['sidebarLinkText']} ms-1 overflow-hidden`}> {m.name}</span>}
                                    </div>
                                </Link>
                )}


                {/*       <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faHouse}/> Admin Panel
                </div>

                <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faUsers}/> Kullanıcılar
                </div>

                <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faClock}/> Onay Bekleyenler
                </div>

                <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faMoneyBill}/> Ödemeler
                </div>

                <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faGears}/> Ayarlar
                </div>

                <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faTags}/> Ücretler
                </div>

                <div className={`${styles['sidebarMenuLink']} p-2`}>
                    <FontAwesomeIcon className={"me-1"} icon={faBarsProgress}/> Reklam Yönetimi
                </div>
*/}

            </div>
        </div>
    );
}

export default SidebarComp;
