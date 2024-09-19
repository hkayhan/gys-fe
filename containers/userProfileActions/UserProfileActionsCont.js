'use client'
import React from 'react';
import UserProfileActionsComp from "@/components/userProfileActions/userProfileActionsComp";
import UserProfileComp from "@/components/userProfile/userProfileComp";
import { useSearchParams } from 'next/navigation'
import CompanyProfile from "@/components/companyProfile/companyProfile";

function UserProfileActionsCont(props) {

    const searchParams = useSearchParams()

    const uid = searchParams.get('uid')
    const userType = searchParams.get('userType')

    return (<>
        {userType==="person"?
            <UserProfileComp uid={uid}/>
        :
            <CompanyProfile uid={uid}/>
        }
        <UserProfileActionsComp uid={uid} />


    </>);
}

export default UserProfileActionsCont;