import React from 'react';
import Topbar from "@/components/topbar/TopbarComponent";
import AddAdvertPreviewComp from "@/components/addAdvertPreview/AddAdvertPreviewComp";

function AddAdvertPreviewCont(props) {
    return (
        <div>
            <Topbar/>
            <AddAdvertPreviewComp/>
        </div>
    );
}

export default AddAdvertPreviewCont;