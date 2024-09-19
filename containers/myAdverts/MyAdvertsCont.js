import React from 'react';
import MyAdvertsComp from "@/components/myAdverts/MyAdvertsComp";
import Topbar from "@/components/topbar/TopbarComponent";

function MyAdvertsCont(props) {
    return (<>
        <Topbar/>
        <MyAdvertsComp/>

    </>);
}

export default MyAdvertsCont;