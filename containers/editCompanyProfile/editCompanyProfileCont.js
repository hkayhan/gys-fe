import React, {Suspense} from 'react';
import EditCompanyProfileComp from "@/components/editCompanyProfile/editCompanyProfileComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";

function EditCompanyProfileCont(props) {
    return (
        <>
            <Topbar/>
            <Suspense fallback={<LoadingComp/>}>
                <EditCompanyProfileComp/>

            </Suspense>

        </>
    );
}

export default EditCompanyProfileCont;