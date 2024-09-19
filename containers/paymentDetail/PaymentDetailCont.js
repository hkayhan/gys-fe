import React, {Suspense} from 'react';
import PaymentDetailComp from "@/components/paymentDetail/PaymentDetailComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";

function PaymentDetailCont(props) {
    return (<>
        <Suspense fallback={<LoadingComp/>}>
            <PaymentDetailComp/>
        </Suspense>
    </>);
}

export default PaymentDetailCont;