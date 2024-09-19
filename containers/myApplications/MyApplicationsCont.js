import React from 'react';
import TopbarComponent from "@/components/topbar/TopbarComponent";
import MyApplicationsComp from "@/components/myApplications/MyApplicationsComp";

function MyApplicationsCont(props) {
    return (
        <div className={"mainContent"}>
            <TopbarComponent/>
            <MyApplicationsComp/>

        </div>
    );
}

export default MyApplicationsCont;