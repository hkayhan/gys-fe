'use client'
import React from 'react';
import UserProfileComp from "@/components/userProfile/userProfileComp";
import Topbar from "@/components/topbar/TopbarComponent";
import { useSearchParams } from 'next/navigation'

function UserProfileCont(props) {
    const searchParams = useSearchParams()
    const uid = searchParams.get("uid")
    return (<>
        <Topbar/>

        {/*<UserProfileComp uid={"cfa35ae5-8062-49da-9ad2-b96cb9e71ba3"} />*/}
        <UserProfileComp uid={uid} />

    </>);
}

export default UserProfileCont;