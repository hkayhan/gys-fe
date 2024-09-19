import React from 'react';
import MyPaymentsComp from "@/components/myPayments/MyPaymentsComp";
import Topbar from "@/components/topbar/TopbarComponent";

function MyPaymentsCont(props) {
    return (<>
        <Topbar/>
        <MyPaymentsComp/>

    </>);
}

export default MyPaymentsCont;