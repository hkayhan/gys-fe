import React, {Suspense} from 'react';
import AwaitingApprovalComp from "@/components/awaitingApproval/AwaitingApprovalComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";

function AwaitingApprovalCont(props) {
    return (
        <>
            <Suspense fallback={<LoadingComp/> }>
                <AwaitingApprovalComp/>
            </Suspense>
        </>
    );
}

export default AwaitingApprovalCont;