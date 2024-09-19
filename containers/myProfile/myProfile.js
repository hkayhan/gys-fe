import React, {Suspense} from 'react';
import Topbar from "@/components/topbar/TopbarComponent";
import MyProfileComp from "@/components/myProfile/myProfileComp";
import LoadingComp from "@/components/loading/LoadingComp";

function MyProfileCont(props) {
    return (<>
        <Topbar/>
        <Suspense fallback={<LoadingComp/>}>
            <MyProfileComp/>
        </Suspense>
    </>);
}

export default MyProfileCont;