'use client'
import React from 'react';
import styles from './style.module.css'
import TopbarLinkComp from "@/components/topbarLink/TopbarLinkComp";

async function Topbar(props) {

    // const [userData, setUserData] = useState()

    // //console.log("use auth", await useAuth);
    // const getUserData = async () => {
    //     let userDataRaw = await verifyJwtToken("token")
    //         .then(data => {
    //             //console.log("user raw data", data);
    //         })
    //
    // }

    // getUserData()

    // useEffect(() => {
    //     getUserData()
    // })

    return (
        <div className={styles['topbarContainer'] + ' '}>
            <div className={styles["topbarMain"] + ' container p-0'}>
                <TopbarLinkComp/>
            </div>

        </div>


    );
}

export default Topbar;