import React from 'react';
import MessagesComp from "@/components/messages/MessagesComp";
import Topbar from "@/components/topbar/TopbarComponent";

function MessagesCont(props) {
    return (<>
        <Topbar/>
        <MessagesComp/>

    </>);
}

export default MessagesCont;