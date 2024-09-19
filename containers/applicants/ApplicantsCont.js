import React, {Suspense} from 'react';
import ApplicantsComp from "@/components/applicants/ApplicantsComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";

function ApplicantsCont(props) {
    return (<>
        <Topbar/>
        <Suspense fallback={<LoadingComp/>}>
            <ApplicantsComp/>
        </Suspense>
    </>);
}

export default ApplicantsCont;